REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.force_pending_on_insert() FROM anon;
REVOKE EXECUTE ON FUNCTION public.validate_review() FROM anon;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM anon;