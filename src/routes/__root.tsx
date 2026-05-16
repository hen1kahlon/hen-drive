import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => {
    const GA4_ID = (import.meta.env.VITE_GA4_ID as string | undefined)?.trim();
    const SITE_VERIFICATION = (import.meta.env.VITE_GOOGLE_SITE_VERIFICATION as string | undefined)?.trim();

    const meta: Array<Record<string, string>> = [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "חן כחלון | מורה נהיגה באשקלון – לימוד נהיגה רכב ואופנוע" },
      { name: "description", content: "מורה נהיגה באשקלון לרכב אוטומט ואופנוע (A/A1/A2). שיעורי נהיגה מקצועיים, אווירה צעירה, ליווי אישי עד הטסט. התקשרו: 050-3250150" },
      { name: "keywords", content: "מורה נהיגה אשקלון, לימוד נהיגה אשקלון, מורה נהיגה לרכב באשקלון, לימוד נהיגה אופנוע אשקלון, שיעורי נהיגה אשקלון, מורה אופנוע אשקלון, רישיון נהיגה אשקלון, חן כחלון" },
      { name: "author", content: "חן כחלון" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "geo.region", content: "IL" },
      { name: "geo.placename", content: "Ashkelon" },
      { property: "og:title", content: "חן כחלון | מורה נהיגה באשקלון – רכב ואופנוע" },
      { property: "og:description", content: "מוציאים רישיון בביטחון — מורה שמלווה אותך עד ההצלחה. רכב ואופנוע, אשקלון והסביבה." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "he_IL" },
      { property: "og:site_name", content: "חן כחלון – מורה נהיגה" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0a0a14" },
    ];
    if (SITE_VERIFICATION) {
      meta.push({ name: "google-site-verification", content: SITE_VERIFICATION });
    }

    const scripts: Array<Record<string, string>> = [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "חן כחלון - מורה נהיגה",
          description: "מורה נהיגה לרכב אוטומט ואופנוע באשקלון והסביבה",
          telephone: "+972503250150",
          email: "hen1kahlon@gmail.com",
          areaServed: "אשקלון והסביבה",
          address: { "@type": "PostalAddress", addressLocality: "אשקלון", addressCountry: "IL" },
          priceRange: "₪₪",
          aggregateRating: { "@type": "AggregateRating", ratingValue: "5", reviewCount: "120" },
        }),
      },
    ];
    if (GA4_ID) {
      scripts.push({
        src: `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`,
        async: "true",
      } as any);
      scripts.push({
        children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4_ID}',{anonymize_ip:true});`,
      });
    }

    return {
      meta,
      links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" } as any,
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap" },
      ],
      scripts,
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    // Strip any hash so the browser doesn't auto-scroll to #lead etc. on initial load
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);

    // Intercept hash anchor clicks: smooth-scroll to the target without
    // mutating the URL hash. Prevents the browser from auto-scrolling on
    // subsequent re-renders / focus events and stops unrelated bubbling.
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      e.preventDefault();
      const id = href.slice(1);
      if (!id || id === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
