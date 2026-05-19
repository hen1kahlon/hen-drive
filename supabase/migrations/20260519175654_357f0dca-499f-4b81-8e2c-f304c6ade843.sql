GRANT USAGE ON SCHEMA app_private TO sandbox_exec, service_role;
GRANT EXECUTE ON FUNCTION app_private.has_role(uuid, public.app_role) TO sandbox_exec, service_role;
GRANT EXECUTE ON FUNCTION app_private.has_admin_or_editor(uuid) TO sandbox_exec, service_role;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO sandbox_exec, service_role;
GRANT EXECUTE ON FUNCTION public.has_admin_or_editor(uuid) TO sandbox_exec, service_role;