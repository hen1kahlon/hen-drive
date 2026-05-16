-- Allow RLS policies and triggers to call the admin-role helper.
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.force_pending_on_insert() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.validate_review() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.touch_updated_at() TO anon, authenticated;

-- Lead workflow needs: new -> contacted -> closed.
ALTER TYPE public.lead_status ADD VALUE IF NOT EXISTS 'closed';

-- Recreate review triggers. The current database has the functions but no triggers.
DROP TRIGGER IF EXISTS reviews_force_pending_on_insert ON public.reviews;
CREATE TRIGGER reviews_force_pending_on_insert
BEFORE INSERT ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.force_pending_on_insert();

DROP TRIGGER IF EXISTS reviews_validate_review ON public.reviews;
CREATE TRIGGER reviews_validate_review
BEFORE INSERT OR UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.validate_review();

-- Recreate updated_at triggers for admin-edited tables.
DROP TRIGGER IF EXISTS leads_touch_updated_at ON public.leads;
CREATE TRIGGER leads_touch_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS license_cards_touch_updated_at ON public.license_cards;
CREATE TRIGGER license_cards_touch_updated_at
BEFORE UPDATE ON public.license_cards
FOR EACH ROW
EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS site_settings_touch_updated_at ON public.site_settings;
CREATE TRIGGER site_settings_touch_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.touch_updated_at();