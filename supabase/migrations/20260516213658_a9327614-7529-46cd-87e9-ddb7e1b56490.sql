REVOKE EXECUTE ON FUNCTION public.has_admin_or_editor(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_admin_or_editor(uuid) TO postgres, service_role;