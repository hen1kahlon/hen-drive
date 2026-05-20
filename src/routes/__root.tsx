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
    const GA4_ID = "G-PPTGL967ZY";
    const SITE_VERIFICATION =
      (import.meta.env.VITE_GOOGLE_SITE_VERIFICATION as string | undefined)?.trim() ||
      "KASmw16sVNguMFCtBDmK5quyVvk5nxdGTChHOtaTd0E";

    const meta: Array<Record<string, string>> = [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "מורה נהיגה באשקלון וביבנה | רכב ואופנוע – חן כחלון" },
      { name: "description", content: "מורה נהיגה מומלץ באשקלון, יבנה, ראשון לציון, חולון ובת ים – שיעורי נהיגה לרכב אוטומט ואופנוע (A / A1 / A2), הכנה לטסט וליווי אישי עד ההצלחה. חייגו 050-3250150" },
      { name: "keywords", content: "מורה נהיגה אשקלון, מורה נהיגה יבנה, מורה נהיגה ראשון לציון, מורה נהיגה חולון, מורה נהיגה בת ים, מורה נהיגה לאופנוע, מורה נהיגה מומלץ, שיעורי נהיגה, הכנה לטסט, טסט ראשון, לימוד נהיגה אופנוע, לימוד נהיגה אשקלון, לימוד נהיגה יבנה, מורה אופנוע אשקלון, רישיון נהיגה אשקלון, חן כחלון" },
      { name: "author", content: "חן כחלון" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "geo.region", content: "IL" },
      { name: "geo.placename", content: "Ashkelon, Yavne" },
      { name: "geo.position", content: "31.6688;34.5743" },
      { name: "ICBM", content: "31.6688, 34.5743" },
      { property: "og:title", content: "מורה נהיגה באשקלון וביבנה | רכב ואופנוע – חן כחלון" },
      { property: "og:description", content: "מורה נהיגה מומלץ באשקלון וביבנה – שיעורי נהיגה לרכב ואופנוע, הכנה לטסט וטסט ראשון, ליווי אישי עד ההצלחה." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "he_IL" },
      { property: "og:site_name", content: "חן כחלון – מורה נהיגה" },
      { property: "og:url", content: "https://hendrive.co.il/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "מורה נהיגה באשקלון וביבנה | רכב ואופנוע – חן כחלון" },
      { name: "twitter:description", content: "שיעורי נהיגה לרכב ואופנוע באשקלון וביבנה, הכנה לטסט וליווי אישי עד ההצלחה." },
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
          "@type": ["LocalBusiness", "DrivingSchool"],
          "@id": "https://hendrive.co.il/#business",
          name: "חן כחלון - מורה נהיגה",
          alternateName: "Hendrive - Chen Kahlon Driving School",
          description: "מורה נהיגה מומלץ באשקלון וביבנה – שיעורי נהיגה לרכב אוטומט ואופנוע (A / A1 / A2), הכנה לטסט וטסט ראשון, ליווי אישי עד ההצלחה.",
          url: "https://hendrive.co.il/",
          image: "https://hendrive.co.il/og-image.jpg",
          telephone: "+972503250150",
          email: "hen1kahlon@gmail.com",
          areaServed: [
            { "@type": "City", name: "אשקלון" },
            { "@type": "City", name: "יבנה" },
            { "@type": "City", name: "אשדוד" },
            { "@type": "City", name: "קרית מלאכי" },
            { "@type": "City", name: "גן יבנה" },
            { "@type": "City", name: "ראשון לציון" },
            { "@type": "City", name: "חולון" },
            { "@type": "City", name: "בת ים" },
            { "@type": "City", name: "רחובות" },
            { "@type": "City", name: "נס ציונה" },
          ],
          address: { "@type": "PostalAddress", addressLocality: "אשקלון", addressRegion: "דרום", addressCountry: "IL" },
          geo: { "@type": "GeoCoordinates", latitude: 31.6688, longitude: 34.5743 },
          priceRange: "₪₪",
          openingHoursSpecification: [
            { "@type": "OpeningHoursSpecification", dayOfWeek: ["Sunday","Monday","Tuesday","Wednesday","Thursday"], opens: "07:00", closes: "20:00" },
            { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "07:00", closes: "14:00" },
          ],
          sameAs: [
            "https://www.instagram.com/hen_drive/",
            "https://www.tiktok.com/@hen_drive",
            "https://www.facebook.com/hendrive",
          ],
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "שיעורי נהיגה",
            itemListElement: [
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "שיעורי נהיגה רכב אוטומט (דרגה B)", areaServed: ["אשקלון", "יבנה", "ראשון לציון", "חולון", "בת ים"] } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "לימוד נהיגה אופנוע A", areaServed: ["אשקלון", "יבנה", "ראשון לציון", "חולון", "בת ים"] } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "לימוד נהיגה אופנוע A1 / A2 ידני ואוטומט", areaServed: ["אשקלון", "יבנה", "ראשון לציון", "חולון", "בת ים"] } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "הכנה לטסט וטסט ראשון", areaServed: ["אשקלון", "יבנה", "ראשון לציון", "חולון", "בת ים"] } },
            ],
          },
          aggregateRating: { "@type": "AggregateRating", ratingValue: "5", reviewCount: "120" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "חן כחלון",
          jobTitle: "מורה נהיגה לרכב ואופנוע",
          worksFor: { "@id": "https://hendrive.co.il/#business" },
          telephone: "+972503250150",
          areaServed: ["אשקלון", "יבנה", "ראשון לציון", "חולון", "בת ים"],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          url: "https://hendrive.co.il/",
          name: "חן כחלון – מורה נהיגה באשקלון וביבנה",
          inLanguage: "he-IL",
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
          gtag("event", "click_call", {
            event_category: "contact",
            event_label: href.replace("tel:", ""),
            value: 1,
            transport_type: "beacon",
          });
        } else if (href.includes("wa.me") || href.includes("api.whatsapp.com")) {
          gtag("event", "click_whatsapp", {
            event_category: "contact",
            event_label: href,
            value: 1,
            transport_type: "beacon",
          });
        }
      }

      const isWhatsAppLink = href.includes("wa.me") || href.includes("api.whatsapp.com");
      const isMobileExternal = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;

      if (href.startsWith("tel:") || isWhatsAppLink) {
        markExternalNavigation();
      }

      // On mobile Chrome/Samsung Internet, opening WhatsApp in a new tab can
      // leave a restored blank white popup/iframe over the site. Use the same
      // browsing context on mobile while keeping normal new-tab behavior on desktop.
      if (isWhatsAppLink && isMobileExternal) {
        e.preventDefault();
        window.location.assign(href);
        return;
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
