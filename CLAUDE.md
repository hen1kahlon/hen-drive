# CLAUDE.md — hen-drive

## הפרויקט

אתר שיווקי עבור **חן כחלון** — מורה נהיגה לרכב אוטומט ואופנוע באשקלון.
האתר בעברית, RTL, ומיועד ללידים אורגניים (SEO + וואטסאפ).
קהל יעד: תושבי אשקלון והסביבה המעוניינים ברישיון B, A, A1, A2.

**טלפון:** 050-3250150
**דומיין פרודקשן:** https://hendrive.co.il
**דומיין staging:** https://tanstack-start-app-staging.hen1kahlon.workers.dev

---

## Stack טכנולוגי

| שכבה | טכנולוגיה |
|------|-----------|
| Framework | TanStack Start (React 19, SSR) |
| Routing | TanStack Router — file-based (`src/routes/`) |
| Hosting | Cloudflare Workers (`tanstack-start-app`) |
| DB / CMS | Supabase PostgreSQL |
| Styling | Tailwind CSS v4 |
| Build | Bun + Vite |
| CI/CD | GitHub Actions |

---

## ארכיטקטורה — דברים קריטיים להבין

### useSiteSettings()
ה-hook `src/lib/site-settings.tsx` טוען נתונים מטבלת `site_settings` בSupabase ומאחד אותם עם defaults בקוד (`DEFAULT_SETTINGS`).
**Supabase תמיד דורס את הקוד.** שינוי ב-`DEFAULT_SETTINGS` בלבד לא יעדכן את האתר החי אם יש ערך בSupabase.

### landing_pages table
טבלת `landing_pages` בSupabase מחזיקה תוכן לעמודי SEO (`/car-lessons-ashkelon`, `/motorcycle-lessons-ashkelon`).
הקומפוננטה `src/components/SeoLanding.tsx` מאחדת props מהקוד עם נתוני Supabase.

### Hero.tsx
`src/components/landing/Hero.tsx` — הסקשן הראשי. הכותרת בנויה מ:
- `s.hero.headline_line1` — שורה ראשונה (לבן)
- `s.hero.headline_highlight` — שורה שנייה (כחול `#60a5fa`)
- `s.hero.tagline` — שורה שלישית (כחול)

---

## Git Workflow

```
staging branch  →  deploy אוטומטי לstageing URL  →  בדיקה ואישור  →  merge ל-main  →  פרודקשן
```

**חוקים:**
- כל שינוי הולך ל-`staging` תחילה
- merge ל-`main` רק לאחר אישור מפורש של חן
- אף פעם לא push ישיר ל-`main` בלי בדיקה

---

## CI/CD

| Branch | Workflow | יעד |
|--------|----------|-----|
| `staging` | `.github/workflows/Staging.yml` | `tanstack-start-app-staging` Worker |
| `main` | `.github/workflows/Deploy.yml` | `tanstack-start-app` Worker + `hendrive.co.il` |

ה-deploy מריץ: `bun install` → `bun run build` → `wrangler deploy`
Staging מבצע patch על `.output/server/wrangler.json` לשינוי שם ה-Worker לפני ה-deploy.

---

## קבצים חשובים

| קובץ | תפקיד |
|------|--------|
| `src/lib/site-settings.tsx` | הגדרות ברירת מחדל + `useSiteSettings()` hook |
| `src/components/landing/Hero.tsx` | סקשן Hero הראשי |
| `src/components/landing/About.tsx` | סקשן "עליי" עם סטטיסטיקות |
| `src/components/SeoLanding.tsx` | template לעמודי SEO |
| `src/routes/__root.tsx` | root layout + meta tags גלובליים |
| `src/routes/index.tsx` | עמוד הבית |
| `src/routes/car-lessons-ashkelon.tsx` | עמוד SEO — שיעורי רכב |
| `src/routes/motorcycle-lessons-ashkelon.tsx` | עמוד SEO — שיעורי אופנוע |
| `wrangler.jsonc` | הגדרות Cloudflare Workers |
| `supabase/migrations/` | migrations לDB |

---

## מה אסור לשבור

- **GA4** — קוד Google Analytics בroot layout
- **כפתורי וואטסאפ** — `waUrl(s)` משתמש במספר מ-settings
- **כפתורי טלפון** — `tel:${s.contact.phone}`
- **Supabase connection** — env vars `VITE_SUPABASE_URL` ו-`VITE_SUPABASE_ANON_KEY`
- **SEO meta tags** — title, description, canonical, og:*, twitter:*
- **robots meta** — `index, follow` בכל עמוד
- **JSON-LD structured data** — `buildFaqJsonLd`, `buildLocalBusinessJsonLd`

---

## קונבנציות קוד

- אין comments מיותרים — רק WHY לא WHAT
- אין emojis בקוד
- עברית RTL — כיוון `dir="rtl"` בroot
- צבעים עיקריים: כחול `#2563eb` / `#60a5fa`, צהוב/ענבר לאקסנטים
- Tailwind v4 — משתמש ב-CSS variables, לא `tailwind.config.js`

---

## Supabase

פרויקט Supabase מכיל:
- `site_settings` — הגדרות גלובליות (hero, stats, contact, buttons)
- `landing_pages` — תוכן לעמודי SEO לפי `slug`

שינויים בDB דרך migrations ב-`supabase/migrations/`.
