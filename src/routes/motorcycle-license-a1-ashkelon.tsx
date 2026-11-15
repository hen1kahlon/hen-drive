import { createFileRoute } from "@tanstack/react-router";
import SeoLanding, { buildFaqJsonLd, buildLocalBusinessJsonLd, type SeoFaq } from "@/components/SeoLanding";

const URL = "https://hendrive.co.il/motorcycle-license-a1-ashkelon";
const TITLE = "רישיון אופנוע A1 באשקלון | עד 47 כ״ס מגיל 18 – חן כחלון";
const DESC = "לימוד אופנוע A1 באשקלון מגיל 18 – ידני או אוטומט, עד 35 קילוואט (47.46 כ״ס). מינימום שיעורים, שדרוג מ-A2 וטסט – מורה נהיגה חן כחלון.";

const faqs: SeoFaq[] = [
  { q: "מאיזה גיל אפשר להוציא רישיון A1?", a: "מגיל 18. אין צורך ברישיון אופנוע קודם." },
  { q: "על אילו אופנועים מותר לנהוג עם A1?", a: "על אופנועים בהספק של עד 35 קילוואט (47.46 כ״ס). אפשר ללמוד על ידני או על אוטומט." },
  { q: "כמה שיעורים צריך ל-A1?", a: "המינימום הוא 15 שיעורים. מי שמחזיק ברישיון A2 לפחות שנה – מינימום 8 שיעורים." },
  { q: "אני צריך לעשות שוב תיאוריה?", a: "בעלי רישיון רכב (B) או רישיון אופנוע אחר פטורים ממבחן התיאוריה לאופנוע." },
  { q: "מתי אפשר לשדרג ל-A?", a: "אחרי שנה לפחות עם רישיון A1, ומגיל 21." },
];

export const Route = createFileRoute("/motorcycle-license-a1-ashkelon")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "רישיון A1 אשקלון, אופנוע A1 אשקלון, שיעורי אופנוע A1, שדרוג A2 ל-A1, רישיון אופנוע 500 סמק" },
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
      { type: "application/ld+json", children: JSON.stringify(buildLocalBusinessJsonLd({ serviceName: "אופנוע A1 באשקלון", serviceDesc: DESC, url: URL })) },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SeoLanding
      videos={[{ id: "7686478543789788436", title: "יום טסט אצלנו" }, { id: "7701800344614964500", title: "משימה 3 – השערים" }]}
      slug="motorcycle-license-a1-ashkelon"
      eyebrow="אופנוע A1 · אשקלון"
      h1Lead="רישיון אופנוע A1 באשקלון –"
      h1Highlight="מגיל 18"
      intro="הדרגה הפופולרית ביותר אצלי: אופנוע אמיתי עד 47 כ״ס, ידני או אוטומט. מתחילים מאפס או משדרגים מ-A2."
      ctaSubline="רוצים רישיון A1?"
      waMessage="היי חן, אני מעוניין/ת ברישיון אופנוע A1 באשקלון, אשמח לפרטים"
      highlights={[
        { icon: "bike", title: "מגיל 18", body: "אפשר להתחיל ישר ב-A1 בלי רישיון קודם על אופנוע." },
        { icon: "bike", title: "עד 35 קילוואט", body: "אופנועים עד 47.46 כ״ס. ידני או אוטומט – לבחירתך." },
        { icon: "grad", title: "15 שיעורים, או 8", body: "מינימום 15 שיעורים. מחזיקי A2 עם שנת ותק – 8 שיעורים בלבד." },
        { icon: "shield", title: "ציוד כלול", body: "אופנוע מתוחזק וקסדה בכל שיעור. כפפות מביאים מהבית." },
        { icon: "car", title: "פטור מתיאוריה", body: "בעלי רישיון רכב או רישיון אופנוע אחר פטורים ממבחן התיאוריה." },
        { icon: "trophy", title: "טסט ראשון", body: "הכנה ממוקדת למבחן השליטה ולמבחן בכביש." },
      ]}
      reviews={[]}
      reviewLicenseTypes={["A1"]}
      faqs={faqs}
      related={[
        { to: "/motorcycle-license-a2-ashkelon", title: "רישיון A2 באשקלון" },
        { to: "/motorcycle-license-a-ashkelon", title: "רישיון A באשקלון" },
        { to: "/motorcycle-test-ashkelon", title: "טסט לאופנוע – מה מצפה לך" },
        { to: "/motorcycle-lessons-ashkelon", title: "כל דרגות האופנוע" },
      ]}
    />
  );
}
