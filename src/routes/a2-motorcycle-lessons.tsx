import { createFileRoute } from "@tanstack/react-router";
import SeoLanding, { buildFaqJsonLd, buildLocalBusinessJsonLd, type SeoFaq } from "@/components/SeoLanding";

const URL = "https://hendrive.co.il/a2-motorcycle-lessons";
const TITLE = "שיעורי אופנוע A2 באשקלון | מגיל 16 ידני ואוטומט – חן כחלון";
const DESC = "שיעורי אופנוע A2 (עד 125 סמ\"ק) באשקלון מגיל 16 – ידני ואוטומט. הדרך המהירה לרישיון אופנוע ראשון עם מורה מנוסה, ציוד חדש ו-98% טסט ראשון.";

const faqs: SeoFaq[] = [
  { q: "מה זה רישיון A2?", a: "רישיון אופנוע A2 מתיר נהיגה עד 125 סמ\"ק והספק עד 14.6 קילוואט. מותר כבר מגיל 16." },
  { q: "כמה שיעורים צריך?", a: "לרוב 12–20 שיעורים בלבד עד הטסט – אחת הדרגות המהירות ביותר להוצאת רישיון." },
  { q: "מה ההבדל בין ידני לאוטומט ב-A2?", a: "אוטומט (קטנוע) קל ללימוד ומספיק לרוב הנהגים הצעירים. ידני מאפשר שליטה מלאה ומוסיף מיומנות." },
  { q: "צריך רישיון רכב לפני A2?", a: "לא חייב – אפשר להוציא A2 כרישיון ראשון מגיל 16, ללא קשר לרישיון רכב." },
  { q: "האם אפשר להמיר אחר כך ל-A1 או A?", a: "כן, לאחר תקופת ותק אפשר לעלות דרגה ל-A1 (מגיל 18) ובהמשך ל-A (מגיל 21)." },
];

export const Route = createFileRoute("/a2-motorcycle-lessons")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "אופנוע A2 אשקלון, רישיון A2, שיעורי A2 ידני, שיעורי A2 אוטומט, רישיון אופנוע מגיל 16, מורה אופנוע A2 אשקלון, חן כחלון" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "he_IL" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(buildFaqJsonLd(faqs)) },
      { type: "application/ld+json", children: JSON.stringify(buildLocalBusinessJsonLd({
        serviceName: "שיעורי אופנוע A2 באשקלון",
        serviceDesc: DESC, url: URL,
      })) },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SeoLanding
      eyebrow="אופנוע A2 · אשקלון"
      h1Lead="רישיון אופנוע A2 –"
      h1Highlight="מגיל 16"
      intro={'הדרגה המהירה ביותר להוצאת רישיון אופנוע: עד 125 סמ"ק, ידני או אוטומט. שיעורים באשקלון על ציוד חדש – לרוב טסט ראשון.'}
      ctaSubline="מוכנים לרישיון אופנוע ראשון?"
      waMessage="היי חן, אני מעוניין/ת ברישיון A2 באשקלון, אשמח לפרטים"
      highlights={[
        { icon: "bike", title: "מגיל 16", body: "הרישיון הראשון המותר באופנוע – דרך מצוינת להתחיל מוקדם." },
        { icon: "bike", title: "ידני או אוטומט", body: "בוחרים את הסגנון המתאים: קטנוע אוטומט או אופנוע ידני." },
        { icon: "trophy", title: "12–20 שיעורים", body: "אחת הדרגות המהירות – אפשר לסיים אפילו תוך 3 שבועות." },
        { icon: "shield", title: "ציוד חדש", body: "קסדה, כפפות ואופנוע מתוחזק – בטיחות מההתחלה." },
        { icon: "grad", title: "הכנה לטסט", body: "מגרש אימונים באשקלון + נהיגה בכבישים – עד שמרגישים מוכנים." },
        { icon: "car", title: "שירות מקומי", body: "אשקלון והסביבה – שיעורים על מסלולי הטסט בעיר." },
      ]}
      reviews={[
        { name: "יובל א׳ – אשקלון", type: "אופנוע A2", text: "ציוד חדש, הסבר מסודר ורישיון ביד מהפעם הראשונה." },
        { name: "ניצן מ׳ – אשקלון", type: "אופנוע A2", text: "בגיל 16.5 כבר עם רישיון אופנוע. תודה ענקית לחן." },
        { name: "ירדן פ׳ – אשקלון", type: "אופנוע A2", text: "מורה רגוע ומקצועי, סיימתי תוך פחות מחודש." },
      ]}
      faqs={faqs}
      related={[
        { to: "/a-motorcycle-license", title: "רישיון אופנוע A" },
        { to: "/a1-motorcycle-lessons", title: "אופנוע A1" },
        { to: "/motorcycle-lessons-ashkelon", title: "כל דרגות האופנוע" },
        { to: "/car-lessons-ashkelon", title: "שיעורי רכב באשקלון" },
      ]}
    />
  );
}