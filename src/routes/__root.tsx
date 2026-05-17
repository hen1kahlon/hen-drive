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
import { installGlobalErrorLogger, logError } from "@/lib/log-error";

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
  useEffect(() => {
    void logError({ message: error.message, stack: error.stack, context: { boundary: "root" } });
  }, [error]);

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
    const GA4_ID = "G-FCTY88L68Z";
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
      { name: "twitter:title", content: "חן כחלון | מורה נהיגה באשקלון – רכב ואופנוע" },
      { name: "twitter:description", content: "מוציאים רישיון בביטחון — מורה שמלווה אותך עד ההצלחה. רכב ואופנוע, אשקלון והסביבה." },
      { name: "theme-color", content: "#0a0a14" },
      { name: "color-scheme", content: "dark" },
      { name: "format-detection", content: "telephone=yes" },
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
      { rel: "dns-prefetch", href: "https://mtsxyebkjvcitpdsasem.supabase.co" },
      { rel: "preconnect", href: "https://mtsxyebkjvcitpdsasem.supabase.co", crossOrigin: "anonymous" } as any,
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
    installGlobalErrorLogger();
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
    const scheduleOverlayCleanup = () => {
      window.setTimeout(cleanupOverlays, 50);
      window.setTimeout(cleanupOverlays, 250);
      window.setTimeout(cleanupOverlays, 900);
    };

    const markExternalNavigation = () => {
      document.documentElement.dataset.externalReturnCleanup = "true";
      window.sessionStorage.setItem("external-return-cleanup", "true");
      scheduleOverlayCleanup();
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;

      // GA4 conversion tracking for tap-to-call / WhatsApp clicks
      const gtag = (window as any).gtag;
      if (typeof gtag === "function") {
        if (href.startsWith("tel:")) {
          gtag("event", "click_call", { event_category: "contact", value: 1 });
        } else if (href.includes("wa.me") || href.includes("api.whatsapp.com")) {
          gtag("event", "click_whatsapp", { event_category: "contact", value: 1 });
        }
      }

      if (href.startsWith("tel:") || href.includes("wa.me") || href.includes("api.whatsapp.com")) {
        markExternalNavigation();
      }

      if (!href.startsWith("#")) return;
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

    // Clear any stale body locks, orphan overlays, or injected editor badges
    // when returning from external apps (WhatsApp/tel) or browser bfcache.
    const cleanupOverlays = () => {
      const body = document.body;
      if (!body) return;
      document.documentElement.removeAttribute("data-external-return-cleanup");
      window.sessionStorage.removeItem("external-return-cleanup");
      body.style.pointerEvents = "";
      body.style.overflow = "";
      body.removeAttribute("data-scroll-locked");
      // Remove orphaned Radix overlays that lost their owner
      document
        .querySelectorAll<HTMLElement>('[data-radix-portal] [data-state="open"]')
        .forEach((el) => {
          if (!el.isConnected) return;
          // If the trigger that owns it is no longer in the DOM, hide it
          const id = el.getAttribute("aria-labelledby");
          if (id && !document.getElementById(id)) el.remove();
        });
      // Some mobile browsers restore injected preview/editor iframes as a blank
      // white fixed panel after returning from WhatsApp. Hide only top-level,
      // textless light overlays so normal page UI remains untouched.
      Array.from(body.children).forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        const style = window.getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        const text = node.innerText?.trim() ?? "";
        const isExternalBadge =
          node.matches('[data-lovable-badge], [id*="lovable" i], [class*="lovable" i], [id*="gpteng" i], [class*="gpteng" i]') ||
          (node instanceof HTMLIFrameElement && /lovable|gpteng/i.test(node.src || ""));
        const isSuspiciousBlankPanel =
          text.length === 0 &&
          (style.position === "fixed" || style.position === "absolute") &&
          rect.width >= 70 &&
          rect.width <= 240 &&
          rect.height >= 90 &&
          rect.height <= 340 &&
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.top < window.innerHeight &&
          rect.left < window.innerWidth &&
          /rgb\(2[3-5]\d, 2[3-5]\d, 2[3-5]\d\)|rgba\(2[3-5]\d, 2[3-5]\d, 2[3-5]\d/.test(style.backgroundColor);
        if (isExternalBadge || isSuspiciousBlankPanel) {
          node.style.setProperty("display", "none", "important");
          node.style.setProperty("pointer-events", "none", "important");
        }
      });
    };
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted || window.sessionStorage.getItem("external-return-cleanup")) scheduleOverlayCleanup();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") scheduleOverlayCleanup();
    };
    const onFocus = () => scheduleOverlayCleanup();
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
