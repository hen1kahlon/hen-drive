
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "users can read their roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Reviews
CREATE TYPE public.review_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  rating smallint NOT NULL,
  license_type text NOT NULL,
  content text NOT NULL,
  image_url text,
  status review_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.validate_review()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.rating < 1 OR NEW.rating > 5 THEN
    RAISE EXCEPTION 'rating must be between 1 and 5';
  END IF;
  IF char_length(NEW.full_name) < 1 OR char_length(NEW.full_name) > 100 THEN
    RAISE EXCEPTION 'full_name length invalid';
  END IF;
  IF char_length(NEW.content) < 1 OR char_length(NEW.content) > 2000 THEN
    RAISE EXCEPTION 'content length invalid';
  END IF;
  IF NEW.license_type NOT IN ('B', 'A2', 'A1', 'A') THEN
    RAISE EXCEPTION 'invalid license_type';
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END $$;

CREATE TRIGGER reviews_validate BEFORE INSERT OR UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.validate_review();

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can submit, but status is forced to 'pending' via trigger
CREATE OR REPLACE FUNCTION public.force_pending_on_insert()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.status := 'pending';
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER reviews_force_pending BEFORE INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.force_pending_on_insert();

CREATE POLICY "anyone can submit a review" ON public.reviews
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "anyone can read approved reviews" ON public.reviews
  FOR SELECT TO anon, authenticated USING (status = 'approved');

CREATE POLICY "admins read all reviews" ON public.reviews
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins update reviews" ON public.reviews
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins delete reviews" ON public.reviews
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins insert reviews" ON public.reviews
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Storage bucket for review images
INSERT INTO storage.buckets (id, name, public) VALUES ('review-images', 'review-images', true);

CREATE POLICY "anyone can upload review images" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'review-images');

CREATE POLICY "anyone can read review images" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'review-images');

CREATE POLICY "admins delete review images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'review-images' AND public.has_role(auth.uid(), 'admin'));
