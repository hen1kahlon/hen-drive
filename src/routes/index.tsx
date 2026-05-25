import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Toaster } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  SiteSettingsProvider,
  useSiteSettings,
  DEFAULT_SETTINGS,
  mergeSettings,
  type SiteSettings,
} from "@/lib/site-settings";
import heroImg from "@/assets/hero-driving.webp";
import heroImgMobile from "@/assets/hero-driving-mobile.webp";

import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Categories, scrollToLead } from "@/components/landing/Categories";
import { About } from "@/components/landing/About";
import { WhyMe } from "@/components/landing/WhyMe";
import { Reviews } from "@/components/landing/Reviews";
import { LeadForm } from "@/components/landing/LeadForm";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
import { MobileBar } from "@/components/landing/MobileBar";
import { SuccessGallery } from "@/components/landing/SuccessGallery";
import { VideoIntro } from "@/components/landing/VideoIntro";
import { ExitIntent } from "@/components/landing/ExitIntent";
import { AccessibilityWidget } from "@/components/landing/AccessibilityWidget";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      const { data } = await supabase
        .from("site_settings")
        .select("data")
        .eq("id", "main")
        .maybeSingle();
      return { initialSettings: data?.data ? mergeSettings(data.data) : DEFAULT_SETTINGS };
    } catch {
      return { initialSettings: DEFAULT_SETTINGS };
    }
  },
  head: () => ({
    links: [
      {
        rel: "preload",
        as: "image",
        href: heroImgMobile,
        imageSrcSet: `${heroImgMobile} 768w, ${heroImg} 1920w`,
        imageSizes: "(max-width: 768px) 100vw, 60vw",
        fetchPriority: "high",
      } as any,
      { rel: "canonical", href: "https://hendrive.co.il/" },
    ],
    meta: [
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { property: "og:url", content: "https://hendrive.co.il/" },
      { property: "og:image", content: `https://hendrive.co.il${heroImg}` },
      { property: "og:image:width", content: "1920" },
      { property: "og:image:height", content: "1080" },
      { property: "og:image:alt", content: "חן כחלון – מורה נהיגה לאופנוע ורכב באשקלון" },
      { name: "twitter:image", content: `https://hendrive.co.il${heroImg}` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "כמה זמן לוקח להוציא רישיון?", acceptedAnswer: { "@type": "Answer", text: "לרכב (דרגה B) משך הלימוד נע בדרך כלל בין חודשיים ל-4 חודשים. לאופנוע (A / A1 / A2) התהליך מהיר יותר וניתן לסיים גם בתוך שבוע, בהתאם לזמינות וניסיון קודם." } },
            { "@type": "Question", name: "באיזה אזורים מתקיימים השיעורים?", acceptedAnswer: { "@type": "Answer", text: "לרכב באשקלון והסביבה עם אפשרות איסוף מבית התלמיד בתיאום מראש. לאופנוע במגרש ייעודי בתיאום מראש." } },
            { "@type": "Question", name: "האם אפשר ללמוד גם רכב וגם אופנוע?", acceptedAnswer: { "@type": "Answer", text: "בהחלט! אני מלמד את שני התחומים ואפשר לשלב." } },
            { "@type": "Question", name: "איך קובעים שיעור ראשון?", acceptedAnswer: { "@type": "Answer", text: "פשוט שולחים הודעת וואטסאפ או מתקשרים — ונמצא יחד את הזמן הכי נוח לכם." } },
            { "@type": "Question", name: "איזה דרגות אופנוע אפשר ללמוד?", acceptedAnswer: { "@type": "Answer", text: "ניתן ללמוד את כל דרגות האופנוע: A מגיל 21, A1 ידני/אוטומט מגיל 18, ו-A2 ידני/אוטומט מגיל 16." } },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": "https://hendrive.co.il/#business",
          name: "חן כחלון – בית הספר לנהיגה ואופנוע אשקלון",
          aggregateRating: { "@type": "AggregateRating", ratingValue: "5.0", reviewCount: "120", bestRating: "5", worstRating: "1" },
          review: [
            { "@type": "Review", author: { "@type": "Person", name: "ליאור מ׳" }, reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" }, reviewBody: "חן הכי סבלני בעולם — עברתי טסט ראשון על רכב אוטומט באשקלון. ממליץ בחום." },
            { "@type": "Review", author: { "@type": "Person", name: "יובל א׳" }, reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" }, reviewBody: "למדתי אופנוע A2 אצל חן — רישיון ביד מהפעם הראשונה, ציוד חדש ובטוח." },
            { "@type": "Review", author: { "@type": "Person", name: "נועה ש׳" }, reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" }, reviewBody: "הרגשתי בטוחה מהשיעור הראשון. עברתי טסט ראשון על רכב פרטי." },
            { "@type": "Review", author: { "@type": "Person", name: "עומר כ׳" }, reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" }, reviewBody: "הוצאתי A1 אצל חן. שיעורים ממוקדים, הכנה אמיתית לטסט — ממליץ בענק על בית הספר לאופנוע באשקלון." },
          ],
        }),
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const { initialSettings } = Route.useLoaderData() as { initialSettings: SiteSettings };
  return (
    <SiteSettingsProvider initialSettings={initialSettings}>
      <LandingPageInner />
    </SiteSettingsProvider>
  );
}

function LandingPageInner() {
  // Subscribe to settings so this tree re-renders when CMS values change.
  useSiteSettings();
  const [hydrated, setHydrated] = useState(false);
  const [leadInterest, setLeadInterest] = useState<string | null>(null);
  useEffect(() => { setHydrated(true); }, []);

  const handleSelectInterest = useCallback((interest: string) => {
    setLeadInterest(interest);
    requestAnimationFrame(() => requestAnimationFrame(scrollToLead));
  }, []);

  return (
    <div className={`${hydrated ? "" : "rendering-stable "}min-h-screen bg-background text-foreground overflow-x-hidden`}>
      {hydrated && <Toaster position="top-center" theme="dark" richColors />}
      <Nav />
      <main className="pb-24 md:pb-0">
        <Hero />
        <Categories onSelectInterest={handleSelectInterest} />
        <About />
        <WhyMe />
        <SuccessGallery />
        <VideoIntro />
        <Reviews />
        <FAQ />
        <LeadForm selectedInterest={leadInterest} />
      </main>
      <Footer />
      <MobileBar />
      <AccessibilityWidget />
      {hydrated && <ExitIntent />}
    </div>
  );
}
