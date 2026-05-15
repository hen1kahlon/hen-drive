GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.force_pending_on_insert() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.validate_review() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.touch_updated_at() TO anon, authenticated;