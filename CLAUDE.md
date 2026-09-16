# CLAUDE.md — תעודת זהות לפרויקט hen-drive

## מה הפרויקט

אתר תדמית למורה נהיגה **חן כחלון** (אשקלון).  
דומיין פרודקשן: `hendrive.co.il`  
בעלים: `hen1kahlon@gmail.com`

---

## טכנולוגיות

| שכבה | כלי |
|---|---|
| Framework | TanStack Start (React 19, SSR) |
| Routing | TanStack Router (file-based, `src/routes/`) |
| Runtime | Cloudflare Workers |
| Deploy tool | Wrangler (via `npx wrangler deploy`) |
| Package manager | Bun |
| DB / Auth | Supabase |
| Styling | Tailwind CSS v4 |

---

## ארכיטקטורה חשובה

### TanStack Start + Wrangler

הבנייה (`bun run build`) מייצרת `.output/server/wrangler.json` שמחליף את `wrangler.jsonc`.  
לכן **כל הגדרה חשובה** (custom domains, שם Worker) חייבת להיות מוזרקת **אחרי הבנייה** דרך ה-CI, לא ב-`wrangler.jsonc`.

### useSiteSettings

`src/lib/site-settings.tsx` — טוען הגדרות מ-Supabase (`site_settings` table).  
סופרמסה על קוד: ה-DB תמיד מנצח. כדי לשנות טקסט/תמונות/קישורים → עדכן ב-Supabase, לא בקוד.

### landing_pages

תוכן SEO (כותרת, תיאור, slug) נשמר ב-Supabase `landing_pages`.

---

## תהליך עבודה — חובה לקרוא לפני כל שינוי

```
שינוי בקוד
    ↓
push לסניף staging
    ↓
GitHub Actions מ-deploy לאוטומטית → tanstack-start-app-staging.hen1kahlon.workers.dev
    ↓
המשתמש בודק בחלון אינקוגניטו ומאשר
    ↓
merge ל-main
    ↓
GitHub Actions מ-deploy לאוטומטית → hendrive.co.il
```

### כלל ברזל — ללא יוצאים מן הכלל

> **כל שינוי — בלי יוצא מן הכלל — עובר קודם דרך staging ומחכה לאישור מפורש של המשתמש לפני שמגיע לפרודקשן.**

אין "חריגים לתיקונים דחופים". אין push ישיר ל-`main`. אם המשתמש לא אישר — לא דוחפים.

---

## Environments

| סביבה | Branch | URL | Worker |
|---|---|---|---|
| Production | `main` | `hendrive.co.il` | `tanstack-start-app` |
| Staging | `staging` | `tanstack-start-app-staging.hen1kahlon.workers.dev` | `tanstack-start-app-staging` |

---

## GitHub Actions

| קובץ | מתי רץ | מה עושה |
|---|---|---|
| `.github/workflows/Deploy.yml` | push ל-`main` | בונה + מוסיף custom domains + deploy לפרודקשן |
| `.github/workflows/Staging.yml` | push ל-`staging` | בונה + משנה שם Worker + deploy לסטייג' |

ה-CI מזריק custom domains עם `jq` לתוך `.output/server/wrangler.json` לאחר הבנייה:
- Production: `routes: [{ pattern: "hendrive.co.il", custom_domain: true }, { pattern: "www.hendrive.co.il", custom_domain: true }]`
- Staging: `name = "tanstack-start-app-staging"`, ללא custom domains

---

## קבצים מרכזיים

| קובץ | תפקיד |
|---|---|
| `src/server.ts` | נקודת הכניסה ל-Worker. מכיל redirect מ-www לאפקס |
| `src/lib/site-settings.tsx` | מיזוג הגדרות Supabase + ברירות מחדל |
| `src/components/landing/Hero.tsx` | קומפוננט ה-Hero הראשי |
| `src/routes/` | דפים (file-based routing) |
| `wrangler.jsonc` | קונפיגורציה בסיסית (לא מגיעה ל-deploy — ראה הערה למעלה) |
| `.github/workflows/` | CI/CD pipelines |

---

## מה לא לשבור

- **`useSiteSettings`** — לא לשנות את ה-schema ב-Supabase בלי לעדכן את הטיפוסים בקוד
- **`src/server.ts`** — מכיל לוגיקת redirect ו-error handling. כל שינוי דורש בדיקה
- **Deploy.yml** — ה-`jq` patch חיוני; בלעדיו `hendrive.co.il` לא יעבוד
- **branch `main`** — deploy אוטומטי לפרודקשן. לא לדחוף קוד שבור

---

## קונבנציות

- אין קומנטים בקוד אלא אם ה-WHY לא מובן
- שמות commits: `feat:`, `fix:`, `style:`, `chore:`, `revert:`
- אין TypeScript `any` — יש `unknown` עם guard
- RTL בעברית — layout עם `dir="rtl"` ו-Tailwind עם `text-right` / `lg:text-right`
