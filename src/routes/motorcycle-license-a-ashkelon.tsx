import { createFileRoute } from "@tanstack/react-router";
import SeoLanding, { buildFaqJsonLd, buildLocalBusinessJsonLd, type SeoFaq } from "@/components/SeoLanding";
import bikeA from "@/assets/vehicle-bike-a.webp";

const URL = "https://hendrive.co.il/motorcycle-license-a-ashkelon";
const TITLE = "רישיון אופנוע A באשקלון | ללא הגבלת הספק – חן כחלון";
const DESC = "שדרוג לרישיון אופנוע A באשקלון – ללא הגבלת הספק, מגיל 21 עם שנת ותק ב-A1. מינימום 8 שיעורים והכנה לטסט – מורה נהיגה חן כחלון.";

const faqs: SeoFaq[] = [
  { q: "מי יכול להוציא רישיון A?", a: "מי שבן 21 לפחות ומחזיק ברישיון A1 לפחות שנה." },
  { q: "כמה שיעורים צריך ל-A?", a: "המינימום הוא 8 שיעורים." },
  { q: "צריך לעשות תיאוריה?", a: "מי שכבר מחזיק ברישיון אופנוע פטור ממבחן התיאוריה." },
  { q: "על איזה אופנוע לומדים?", a: "על אופנוע ידני. רישיון A מאפשר לנהוג על כל אופנוע, ללא הגבלת הספק." },
];

export const Route = createFileRoute("/motorcycle-license-a-ashkelon")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "רישיון A אשקלון, אופנוע A אשקלון, שדרוג A1 ל-A, רישיון אופנוע כבד אשקלון, רישיון אופנוע ללא הגבלה" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "he_IL" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(buildFaqJsonLd(faqs)) },
      { type: "application/ld+json", children: JSON.stringify(buildLocalBusinessJsonLd({ serviceName: "אופנוע A באשקלון", serviceDesc: DESC, url: URL })) },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SeoLanding
      slug="motorcycle-license-a-ashkelon"
      eyebrow="אופנוע A · אשקלון"
      h1Lead="רישיון אופנוע A באשקלון –"
      h1Highlight="בלי הגבלה"
      intro="הדרגה הגבוהה ביותר: כל אופנוע, בלי הגבלת הספק. שדרוג למחזיקי A1, עם שיעורים ממוקדים עד הטסט."
      ctaSubline="מוכנים לשדרג ל-A?"
      waMessage="היי חן, אני מעוניין/ת ברישיון אופנוע A באשקלון, אשמח לפרטים"
      highlights={[
        { icon: "bike", title: "מגיל 21", body: "הרישיון ניתן מגיל 21, לבעלי A1 בתוקף." },
        { icon: "bike", title: "שנת ותק ב-A1", body: "תנאי לשדרוג: לפחות שנה עם רישיון A1." },
        { icon: "grad", title: "מינימום 8 שיעורים", body: "שיעורים ממוקדים על אופנוע כבד, בקצב שלך." },
        { icon: "shield", title: "ציוד כלול", body: "קסדה, כפפות ואופנוע מתוחזק בכל שיעור." },
        { icon: "bike", title: "ידני בלבד", body: "השיעורים והמבחן על אופנוע ידני." },
        { icon: "trophy", title: "הכנה לטסט", body: "שליטה במגרש ונהיגה בכביש עד שאתה מוכן." },
      ]}
      reviews={[]}
      reviewLicenseTypes={["A"]}
      faqs={faqs}
      related={[
        { to: "/motorcycle-license-a1-ashkelon", title: "רישיון A1 באשקלון" },
        { to: "/motorcycle-license-process", title: "איך מוציאים רישיון – שלב אחר שלב" },
        { to: "/motorcycle-test-ashkelon", title: "טסט לאופנוע – מה מצפה לך" },
        { to: "/motorcycle-lessons-ashkelon", title: "כל דרגות האופנוע" },
      ]}
    />
  );
}
