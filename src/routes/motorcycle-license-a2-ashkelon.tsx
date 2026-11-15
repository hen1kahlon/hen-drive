import { createFileRoute } from "@tanstack/react-router";
import SeoLanding, { buildFaqJsonLd, buildLocalBusinessJsonLd, type SeoFaq } from "@/components/SeoLanding";

const URL = "https://hendrive.co.il/motorcycle-license-a2-ashkelon";
const TITLE = "רישיון אופנוע A2 באשקלון | קטנוע ואופנוע קל מגיל 16 – חן כחלון";
const DESC = "לימוד אופנוע A2 באשקלון מגיל 16 – ידני או אוטומט, עד 11 קילוואט (כ-14.6 כ״ס). תנאים, מספר שיעורים, תיאוריה וטסט – מורה נהיגה חן כחלון.";

const faqs: SeoFaq[] = [
  { q: "מאיזה גיל אפשר להוציא רישיון A2?", a: "הטסט אפשרי מגיל 16, ואת מבחן התיאוריה אפשר לעשות כבר מגיל 15 וחצי. עד גיל 17 נדרש אישור הורים בכתב." },
  { q: "על אילו כלים מותר לנהוג עם A2?", a: "על קטנוע או אופנוע בהספק של עד 11 קילוואט (כ-14.6 כ״ס). אפשר ללמוד על ידני או על אוטומט." },
  { q: "כמה שיעורים צריך ל-A2?", a: "המינימום לפי משרד התחבורה הוא 15 שיעורים. מספר השיעורים בפועל תלוי בקצב ובביטחון של כל תלמיד." },
  { q: "יש לי רישיון רכב – מה משתנה?", a: "בעלי רישיון B פטורים ממבחן התיאוריה לאופנוע. בהתאם לוותק, הטסט עשוי לכלול רק את מבחן השליטה במגרש. נבדוק יחד מה חל עליך." },
  { q: "מה ההבדל בין ידני לאוטומט?", a: "רישיון על אוטומט מגביל לנהיגה על כלי אוטומטי. רישיון על ידני מאפשר לנהוג על שני הסוגים." },
  { q: "מה הדרגה הבאה אחרי A2?", a: "אחרי שנה עם A2 אפשר לשדרג ל-A1 עם מינימום 8 שיעורים בלבד, מגיל 18." },
];

export const Route = createFileRoute("/motorcycle-license-a2-ashkelon")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "רישיון A2 אשקלון, רישיון קטנוע אשקלון, אופנוע A2 אשקלון, שיעורי קטנוע אשקלון, רישיון אופנוע גיל 16" },
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
      { type: "application/ld+json", children: JSON.stringify(buildLocalBusinessJsonLd({ serviceName: "אופנוע A2 באשקלון", serviceDesc: DESC, url: URL })) },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SeoLanding
      slug="motorcycle-license-a2-ashkelon"
      eyebrow="אופנוע A2 · אשקלון"
      h1Lead="רישיון אופנוע A2 באשקלון –"
      h1Highlight="מגיל 16"
      intro="הרישיון הראשון על שני גלגלים: קטנוע או אופנוע קל, ידני או אוטומט. שיעורים במגרש אימונים ובכבישי אשקלון, עד טסט ראשון."
      ctaSubline="רוצים להתחיל עם A2?"
      waMessage="היי חן, אני מעוניין/ת ברישיון אופנוע A2 באשקלון, אשמח לפרטים"
      highlights={[
        { icon: "bike", title: "מגיל 16", body: "גיל מינימלי לטסט: 16. עד גיל 17 נדרש אישור הורים בכתב." },
        { icon: "bike", title: "עד 11 קילוואט", body: "קטנועים ואופנועים קלים עד כ-14.6 כ״ס. ידני או אוטומט – לבחירתך." },
        { icon: "grad", title: "מינימום 15 שיעורים", body: "זה המינימום של משרד התחבורה. בפועל מתקדמים בקצב שלך." },
        { icon: "shield", title: "ציוד כלול", body: "קסדה, כפפות ואופנוע מתוחזק. מגיעים עם נעליים סגורות ובגדים ארוכים." },
        { icon: "car", title: "יש לך רישיון רכב?", body: "בעלי רישיון B פטורים מתיאוריה לאופנוע, והמבחן עשוי להיות קצר יותר." },
        { icon: "trophy", title: "ליווי עד הטסט", body: "תרגול במגרש, נהיגה בעיר והכנה מסודרת ליום המבחן." },
      ]}
      reviews={[]}
      reviewLicenseTypes={["A2"]}
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
