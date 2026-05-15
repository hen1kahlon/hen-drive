## Admin Dashboard — Hebrew RTL

Build a comprehensive admin panel on top of the existing auth/admin scaffolding (`/auth`, `/admin`, `user_roles`, `has_role`).

### Database (new migration)

New tables (all RLS-locked to `has_role(auth.uid(), 'admin')`, public read where noted):

- **leads** — `id, full_name, phone, license_type, source, status (new|contacted|archived), notes, created_at, updated_at`. Public INSERT (with length/format validation), admin-only SELECT/UPDATE/DELETE.
- **gallery_items** — `id, image_url, category (cars|motorcycles|success), title, sort_order, created_at`. Public SELECT, admin-only write.
- **faqs** — `id, question, answer, sort_order, is_active, created_at`. Public SELECT (active only), admin-only write.
- **site_settings** — single-row key/value JSONB store for hero (headline, subheadline, cta, hero_media_url) and social links (instagram, tiktok, facebook, whatsapp). Public SELECT, admin-only write.
- **reviews** — extend with `is_featured boolean default false`.

New storage bucket: `gallery` (public read, admin write) — reuse existing `review-images` for student photos.

### Routes

Refactor `/admin` into a tabbed dashboard with sidebar nav:

```
/admin              → Overview (analytics cards)
/admin/leads        → Leads table (search, filter by status/license, mark contacted, delete, CSV export)
/admin/reviews      → existing reviews + feature toggle + image upload
/admin/gallery      → grid with upload (drag/drop), category filter, delete
/admin/faqs         → inline-edit list, add/remove, reorder
/admin/settings     → hero editor + social links editor
```

Shared `<AdminLayout>` with RTL sidebar (collapsible on mobile via Sheet), top bar with logout, route guard via existing pattern.

### Frontend wiring

- Public homepage (`src/routes/index.tsx`) reads hero text, social URLs, FAQs, gallery, and featured reviews from new tables instead of hardcoded strings.
- Lead-capture forms (existing CTAs) insert into `leads` with `source` = button identifier.

### Analytics overview

Compute from DB: total leads, leads in last 7d, breakdown by license_type, breakdown by source (proxy for "WhatsApp opens" / button clicks), pending reviews count.

### Tech notes

- All admin pages: `dir="rtl"`, dark premium design matching existing `/admin`.
- Mobile: collapsible Sheet sidebar, stacked cards instead of wide tables.
- CSV export: client-side blob download.
- Image uploads: direct to Supabase Storage from browser using authenticated client.
- Admin gate: same pattern as current `/admin` — check `user_roles` after session load.

### Out of scope

- Social OAuth login (keeping email/password only as currently configured).
- Editing video hero (image URL only; video can be added later).
- Multi-admin role hierarchy.
