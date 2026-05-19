CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND _user_id = auth.uid()
  )
$$;

CREATE OR REPLACE FUNCTION public.has_admin_or_editor(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin'::public.app_role, 'editor'::public.app_role)
      AND _user_id = auth.uid()
  )
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_admin_or_editor(uuid) FROM PUBLIC;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_admin_or_editor(uuid) TO authenticated;

GRANT EXECUTE ON FUNCTION public.force_pending_on_insert() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.validate_review() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.touch_updated_at() TO anon, authenticated;