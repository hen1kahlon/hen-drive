import { createFileRoute } from "@tanstack/react-router";
import SeoLanding, { buildFaqJsonLd, buildLocalBusinessJsonLd, type SeoFaq } from "@/components/SeoLanding";

const URL = "https://hendrive.co.il/a1-motorcycle-lessons";
const TITLE = "שיעורי אופנוע A1 באשקלון | ידני ואוטומט – חן כחלון";
const DESC = "שיעורי אופנוע A1 (עד 500 סמ\"ק) באשקלון – ידני ואוטומט, מגיל 18. ציוד חדש, מגרש אימונים מסודר, הכנה לטסט וליווי אישי עד הרישיון.";

const faqs: SeoFaq[] = [
  { q: "מה זה רישיון אופנוע A1?", a: "רישיון A1 מתיר נהיגה על אופנוע עד 500 סמ\"ק והספק עד 35 קילוואט. מותר מגיל 18." },
  { q: "ידני או אוטומט – מה עדיף ב-A1?", a: "אוטומט קל יותר להתחלה ומספיק לרובם. ידני נותן שליטה מלאה ופותח דלת לאופנועים גדולים יותר בעתיד." },
  { q: "תוך כמה זמן מסיימים A1?", a: "בדרך כלל 2–4 שבועות עם 14–22 שיעורים, תלוי בזמינות שלך." },
  { q: "מה ההבדל בין A1 ל-A2?", a: "A2 מגיל 16 ועד 125 סמ\"ק. A1 מגיל 18 ועד 500 סמ\"ק – אופנוע גדול ויציב יותר." },
  { q: "האם אפשר להתחיל מאוטומט ולעבור לידני?", a: "כן, אבל מומלץ לבחור מההתחלה את הדרגה שתשרת אותך לטווח ארוך." },
];

export const Route = createFileRoute("/a1-motorcycle-lessons")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "אופנוע A1 אשקלון, רישיון A1, שיעורי A1 ידני, שיעורי A1 אוטומט, מורה אופנוע A1 אשקלון, חן כחלון" },
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
        serviceName: "שיעורי אופנוע A1 באשקלון",
        serviceDesc: DESC, url: URL,
      })) },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SeoLanding
      eyebrow="אופנוע A1 · אשקלון"
      h1Lead="רישיון אופנוע A1 –"
      h1Highlight="ידני ואוטומט"
      intro={'עד 500 סמ"ק, מגיל 18. ציוד חדש, מגרש מסודר באשקלון והכנה ממוקדת לטסט – עם מורה שבאמת אכפת לו שתעבור.'}
      ctaSubline="רוצה רישיון A1?"
      waMessage="היי חן, אני מעוניין/ת ברישיון A1 באשקלון, אשמח לפרטים"
      highlights={[
        { icon: "bike", title: "ידני או אוטומט", body: "בוחרים מה שמתאים לך – ולומדים על אופנוע חדש ויציב." },
        { icon: "shield", title: "ציוד ובטיחות", body: "קסדה, כפפות ואופנוע מתוחזק – בטיחות מההתחלה ועד הטסט." },
        { icon: "grad", title: "הכנה מלאה לטסט", body: "מגרש + כבישים בצירי אשקלון, עד שמרגישים בנוח לחלוטין." },
        { icon: "trophy", title: "טסט ראשון", body: "תלמידי A1 אצלי עוברים ברובם הגדול בטסט הראשון." },
        { icon: "bike", title: "קצב גמיש", body: "אפשר לסיים תוך 2–4 שבועות בלבד בקורס מרוכז." },
        { icon: "car", title: "שירות מקומי", body: "אשקלון והסביבה – איסוף בתיאום ושיעורים בכבישי העיר." },
      ]}
      reviews={[
        { name: "עומר כ׳ – אשקלון", type: "אופנוע A1", text: "שיעורים ממוקדים, הכנה אמיתית לטסט. רישיון ביד!" },
        { name: "תום ר׳ – אשקלון", type: "אופנוע A1", text: "אופנוע חדש, מורה רגוע ואחרי שלושה שבועות עברתי." },
        { name: "אורי ב׳ – אשקלון", type: "אופנוע A1", text: "המעבר מאוטומט לידני היה חלק, הסברים מעולים." },
      ]}
      faqs={faqs}
      related={[
        { to: "/a-motorcycle-license", title: "רישיון אופנוע A" },
        { to: "/a2-motorcycle-lessons", title: "אופנוע A2" },
        { to: "/motorcycle-lessons-ashkelon", title: "כל דרגות האופנוע" },
        { to: "/car-lessons-ashkelon", title: "שיעורי רכב באשקלון" },
      ]}
    />
  );
}