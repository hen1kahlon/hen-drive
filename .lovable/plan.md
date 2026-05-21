# Cleanup & Optimization Plan

This is a large scope. I'll deliver it in 4 phases so you can verify each one in preview before moving on.

---

## Phase 1 — Route cleanup (quick, ~5 min)

**Delete:**
- `/first-test-preparation-ashkelon`
- `/driving-instructor-ashkelon`

**Keep + rename to final set:**
- `/car-lessons-ashkelon` — שיעורי רכב
- `/motorcycle-lessons-ashkelon` — שיעורי אופנוע (general)
- `/a-motorcycle-license` — **NEW**: רישיון A (אופנוע גדול)
- `/a1-motorcycle-lessons` — already exists, will add manual+automatic content
- `/a2-motorcycle-lessons` — already exists, will add manual+automatic content

Update sitemap, internal links, homepage hub, and remove all cross-links to deleted pages.

**Strip all non-Ashkelon city mentions** (Ashdod, Kiryat Gat, Gan Yavne, "southern areas") from every page, FAQ, review, schema, and meta — replace with "אשקלון והסביבה" only. This includes the existing reviews on the homepage that name other cities.

---

## Phase 2 — CMS for landing pages (the big one, ~30–45 min)

Add a new Supabase table `landing_pages` with one row per landing page:

```
landing_pages
├─ slug (text, PK)            e.g. "car-lessons-ashkelon"
├─ seo (jsonb)                { title, description, keywords, og_title, og_description }
├─ hero (jsonb)               { eyebrow, h1_lead, h1_highlight, intro, cta_subline, wa_message }
├─ highlights (jsonb)         [{ icon, title, body }]
├─ reviews (jsonb)            [{ name, type, text }]
├─ faqs (jsonb)               [{ q, a }]
├─ pricing (jsonb)            { car_title, car_body, bike_title, bike_body }
├─ related (jsonb)            [{ to, title }]
└─ updated_at
```

- RLS: public read; admin/editor write (matches existing `faqs`/`license_cards` pattern).
- Seed all 5 landing pages with their current content.
- Refactor `SeoLanding.tsx` + each route to load from the table via a public `getLandingPage(slug)` server fn (SSR-safe, uses `supabaseAdmin` with explicit slug WHERE).
- Add `/admin/landing-pages` dashboard page with a form per slug to edit all sections (text, FAQs, reviews, pricing, SEO meta). No image uploads in v1 — text-only fields plus existing gallery for hero media if needed.

**Tradeoff:** I'll make SEO meta editable from the CMS, but the page `<title>` and JSON-LD will still be set per-route in `head()` from the loaded data. That works but means a hard refresh is needed after edits to re-prerender meta — acceptable for a low-traffic admin flow.

---

## Phase 3 — Performance (~15 min)

**Likely culprits given what I can see:**
- Heavy framer-motion usage on every section of `index.tsx` causing layout thrash.
- Exit-intent + sticky bars mounting on initial paint.
- Reviews/FAQ rendering full lists upfront.

**Fixes I'll apply:**
- Code-split heavy below-fold sections via `React.lazy` + Suspense.
- Replace `whileInView` animations on long lists with CSS-only transitions; keep motion only for hero.
- Defer exit-intent popup mount until after first user interaction.
- Add `loading="lazy"` + explicit width/height on all images.
- Reduce `framer-motion` import surface (`m` from `framer-motion` + `LazyMotion`).

I will **not** rewrite the whole index page — surgical perf edits only.

---

## Phase 4 — SEO & indexability (~10 min)

- Verify `robots.txt` allows all public routes (already does, will double-check).
- Sitemap already exists at `/sitemap.xml` — will update entries to match final route list.
- Add **per-page H1 + breadcrumb schema** on each landing page.
- Add internal links from homepage hero/footer to the 5 landing pages with keyword-rich anchor text.
- Tighten meta titles for the 4 target keywords (מורה נהיגה אשקלון / לימוד נהיגה אופנוע אשקלון / A1 אשקלון / A2 אשקלון).
- Add `<link rel="alternate" hreflang="he-IL">` and confirm canonical on every route.

**What I can't fix from code:**
- Actually submitting the sitemap to Google Search Console — you need to do that in GSC once (Sitemap → add `https://hendrive.co.il/sitemap.xml`). I'll remind you.
- Google ranking takes weeks; code-side I can only make the site crawlable and on-topic.

---

## Questions before I start

1. **"A motorcycle license" page** — should the URL be `/a-motorcycle-license` or `/motorcycle-license-a-ashkelon`? (I'll default to the first if no answer.)
2. **Admin auth** — the `/admin/*` routes already exist with role gating. Do you already have an admin user, or do I need to confirm the role-assignment flow works?
3. **Performance** — desktop "flickering/freezing": do you see it on a specific page (homepage?) or everywhere? If you can name the page it speeds up diagnosis a lot.
4. **City mentions** — strict mode: I'll remove **every** other city including from existing reviews (e.g. "יובל א׳ – אשדוד" becomes "יובל א׳ – אשקלון"). Confirm that's OK — it means slightly less-authentic review attribution.

Once you approve (and answer Q1–Q4 if you want), I'll execute Phase 1 immediately and work through 2–4 in order, pausing between phases so you can verify in preview.
