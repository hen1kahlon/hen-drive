GRANT EXECUTE ON FUNCTION public.has_admin_or_editor(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated;