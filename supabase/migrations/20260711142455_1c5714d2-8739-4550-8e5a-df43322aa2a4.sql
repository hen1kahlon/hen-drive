
-- Revoke EXECUTE on internal email-queue SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.email_queue_wake() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.email_queue_dispatch() FROM anon, authenticated, PUBLIC;

-- Restrict realtime subscriptions on the leads channel to admins
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins subscribe leads channel" ON realtime.messages;
CREATE POLICY "admins subscribe leads channel"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  (realtime.topic() NOT LIKE 'leads%'
   AND realtime.topic() NOT LIKE 'realtime:public:leads%')
  OR public.has_role(auth.uid(), 'admin')
);
