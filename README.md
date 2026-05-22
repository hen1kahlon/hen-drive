# HenDrive — Driving School Website

TanStack Start (React 19 + Vite 7) app with Supabase backend, originally built on Lovable.
This README covers local development and the steps to fully detach from Lovable after exporting the repo.

## Quick start (local)

```bash
npm install
cp .env.example .env   # fill in values (see below)
npm run dev            # http://localhost:8080
```

Scripts:
- `npm run dev` — Vite dev server
- `npm run build` — production build (Cloudflare Worker target)
- `npm run build:dev` — development-mode build
- `npm run preview` — preview the production build
- `npm run lint` / `npm run format`

## Environment variables

Client-side (exposed to the browser, `VITE_` prefix required):

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ref |

Server-side (server functions / SSR only — never exposed to the browser):

| Variable | Purpose |
|---|---|
| `SUPABASE_URL` | Same as VITE_SUPABASE_URL |
| `SUPABASE_PUBLISHABLE_KEY` | Same as VITE_SUPABASE_PUBLISHABLE_KEY |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (bypasses RLS) — keep secret |
| `RESEND_API_KEY` | Transactional email via Resend |
| `LOVABLE_API_KEY` | Only required if you keep the email-preview route under `src/routes/lovable/` |

Optional: Google Analytics 4 (GA4) is wired in the frontend; no extra env vars needed locally.

## Project structure

```
src/
  routes/                        file-based routes (TanStack Router)
    __root.tsx                   root layout (head, providers)
    index.tsx                    home page
    car-lessons-ashkelon.tsx
    motorcycle-lessons-ashkelon.tsx
    admin.*.tsx                  CMS / admin pages
    api/public/*.ts              public HTTP endpoints (lead form, webhooks)
    lovable/*                    Lovable-only email preview (safe to delete)
  components/                    UI + landing sections
    ui/                          shadcn/ui primitives
    landing/                     Hero, Categories, Reviews, etc.
  integrations/supabase/         Supabase clients + generated types
  lib/                           server functions (*.functions.ts), helpers
  styles.css                     Tailwind v4 + design tokens
supabase/
  migrations/                    SQL migration history
  config.toml                    Supabase CLI config
```

## Migrating off Lovable (after `git clone`)

The project depends on two Lovable wrapper packages. To fully detach:

### 1. Replace the Vite config

`@lovable.dev/vite-tanstack-config` bundles tanstackStart + viteReact + tailwindcss
+ tsConfigPaths + cloudflare plugins. Replace `vite.config.ts` with:

```ts
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { cloudflare } from "@cloudflare/vite-plugin"; // optional, only for CF deploy

export default defineConfig({
  server: { port: 8080 },
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({ customViteReactPlugin: true, server: { entry: "server" } }),
    viteReact(),
    // cloudflare(),
  ],
});
```

Then: `npm remove @lovable.dev/vite-tanstack-config`.

### 2. Remove Lovable email/webhook packages (optional)

If you don't use the email preview route or Lovable webhooks:
- Delete `src/routes/lovable/` and unused email helpers.
- `npm remove @lovable.dev/email-js @lovable.dev/webhooks-js`
- Replace with the direct `resend` SDK inside a `createServerFn`.

### 3. Supabase clients

Files under `src/integrations/supabase/` are standard Supabase code — keep them.
Regenerate types when the schema changes:

```bash
npx supabase gen types typescript --project-id <your-ref> > src/integrations/supabase/types.ts
```

### 4. Deployment

Currently configured for Cloudflare Workers (`wrangler.jsonc`, `src/server.ts`).
Alternatives:
- **Node**: change tanstackStart target to `node-server`.
- **Vercel**: use the Vercel preset for `@tanstack/react-start`.
- **Cloudflare**: keep current setup; `npx wrangler deploy`.

### 5. Clean up

```bash
rm -rf .lovable/   # Lovable workspace metadata, safe to remove off-platform
```

## Supabase setup

1. Create a Supabase project, copy URL + anon key into `.env`.
2. Link + apply migrations:
   ```bash
   npx supabase link --project-ref <ref>
   npx supabase db push
   ```
3. Create public storage buckets `gallery` and `review-images`.
4. Set the same env vars in your hosting provider.

## What stays working out of the box

- All landing pages (home, car-lessons, motorcycle-lessons)
- CMS / admin routes (`/admin/*`)
- Lead form (`/api/public/lead`)
- Supabase auth, gallery uploads, reviews, FAQs
- GA4, sitemap.xml, robots.txt, SEO meta tags

## License

Proprietary — HenDrive driving school.
