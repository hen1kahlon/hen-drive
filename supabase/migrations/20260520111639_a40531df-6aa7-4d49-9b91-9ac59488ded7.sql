DELETE FROM public.leads WHERE source = 'production-test';
DELETE FROM public.email_send_log WHERE template_name = 'lead-notification' AND status = 'pending' AND created_at > now() - interval '1 day';