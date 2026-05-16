CREATE TABLE public.error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  level text NOT NULL DEFAULT 'error',
  source text NOT NULL DEFAULT 'client',
  message text NOT NULL,
  stack text,
  url text,
  user_agent text,
  user_id uuid,
  context jsonb,
  resolved boolean NOT NULL DEFAULT false
);

CREATE INDEX idx_error_logs_created_at ON public.error_logs (created_at DESC);
CREATE INDEX idx_error_logs_resolved ON public.error_logs (resolved);

ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can log an error"
ON public.error_logs FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(message) BETWEEN 1 AND 4000
  AND (stack IS NULL OR char_length(stack) <= 20000)
  AND (url IS NULL OR char_length(url) <= 2000)
  AND (user_agent IS NULL OR char_length(user_agent) <= 1000)
  AND level IN ('error','warning','info')
  AND source IN ('client','server','network')
);

CREATE POLICY "admins read error logs"
ON public.error_logs FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "admins update error logs"
ON public.error_logs FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "admins delete error logs"
ON public.error_logs FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));