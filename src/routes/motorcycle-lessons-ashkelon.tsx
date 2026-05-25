import { createFileRoute } from "@tanstack/react-router";
import SeoLanding, { buildFaqJsonLd, buildLocalBusinessJsonLd, type SeoFaq } from "@/components/SeoLanding";
import bikeA from "@/assets/vehicle-bike-a.webp";
import bikeA1 from "@/assets/vehicle-bike-a1-manual.webp";
import bikeA2 from "@/assets/vehicle-bike-a2-manual.webp";

const URL = "https://hendrive.co.il/motorcycle-lessons-ashkelon";
const TITLE = "שיעורי אופנוע באשקלון | בית ספר לנהיגה לאופנוע – חן כחלון";
const DESC = "שיעורי נהיגה לאופנוע באשקלון – דרגות A, A1, A2 ידני ואוטומט. מורה צעיר, ציוד חדש, הכנה לטסט וליווי עד ההצלחה באשקלון והסביבה.";

const faqs: SeoFaq[] = [
  { q: "מהן דרגות האופנוע ומה ההבדל?", a: "A2 – מגיל 16, עד 14.7 כ\"ס, מינימום 15 שיעורים. A1 – מגיל 18, עד 47 כ\"ס, מינימום 15 שיעורים (או 8 שיעורים למחזיקי A2 עם ותק שנה). A – מגיל 21, ללא הגבלה, מינימום 8 שיעורים (מותנה ב-A1 עם ותק שנה)." },
  { q: "כמה שיעורי אופנוע צריך עד הטסט?", a: "A2 – מינימום 15 שיעורים. A1 – מינימום 15 שיעורים, או 8 בלבד למחזיקי A2 עם ותק שנה. A – מינימום 8 שיעורים למחזיקי A1 עם ותק שנה." },
  { q: "איפה מתקיימים השיעורים?", a: "במגרש אימונים מוסדר באשקלון לתרגול ראשוני, ולאחר מכן בכבישי אשקלון והסביבה להכנה אמיתית לטסט." },
  { q: "האם הציוד כלול?", a: "כן – קסדה, כפפות ואופנוע חדש ומתוחזק. צריך להגיע עם נעליים סגורות ובגדים ארוכים." },
  { q: "אפשר ללמוד אופנוע גם בלי רישיון רכב?", a: "כן, אין צורך ברישיון רכב מוקדם. אפשר להתחיל ישר ברישיון אופנוע מהדרגה המתאימה לגיל שלך." },
];

export const Route = createFileRoute("/motorcycle-lessons-ashkelon")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "שיעורי אופנוע אשקלון, מורה אופנוע אשקלון, בית ספר לנהיגה לאופנוע אשקלון, רישיון אופנוע אשקלון, אופנוע A אשקלון, אופנוע A1 אשקלון, אופנוע A2 אשקלון, חן כחלון" },
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
        serviceName: "שיעורי נהיגה לאופנוע באשקלון",
        serviceDesc: DESC, url: URL,
      })) },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SeoLanding
      slug="motorcycle-lessons-ashkelon"
      eyebrow="אופנוע · אשקלון"
      h1Lead="שיעורי אופנוע באשקלון –"
      h1Highlight="כל הדרגות"
      intro="A, A1, A2 – ידני ואוטומט. ציוד חדש, מגרש אימונים מסודר באשקלון, ושיטה שמביאה לטסט ראשון. בית הספר לנהיגה לאופנוע של חן כחלון."
      ctaSubline="רוצים להוציא רישיון אופנוע?"
      waMessage="היי חן, אני מעוניין/ת בשיעורי אופנוע באשקלון, אשמח לפרטים"
      highlights={[
        { icon: "bike", title: "A – מגיל 21", body: "ללא הגבלת נפח. מותנה ב-A1 עם ותק שנה. מינימום 8 שיעורים." },
        { icon: "bike", title: "A1 – מגיל 18", body: "עד 47 כ\"ס, ידני או אוטומט. מינימום 15 שיעורים, או 8 למחזיקי A2 עם ותק שנה." },
        { icon: "bike", title: "A2 – מגיל 16", body: "עד 14.7 כ\"ס, ידני או אוטומט. מינימום 15 שיעורים. מגיל 16–17 נדרש אישור הורים." },
        { icon: "shield", title: "ציוד חדש ובטוח", body: "קסדה, כפפות ואופנוע מתוחזק. בטיחות לפני הכל בשיעורים ובמגרש." },
        { icon: "trophy", title: "98% טסט ראשון", body: "תלמידי אופנוע מאשקלון והסביבה עוברים ברובם בפעם הראשונה." },
        { icon: "grad", title: "ליווי עד הטסט", body: "הכנה מנטלית, תיאום מועד טסט וטיפים אחרונים לרגע האמת." },
      ]}
      reviews={[
        { name: "יובל א׳ – אשקלון", type: "אופנוע A2", text: "ציוד חדש, הסבר מסודר ורישיון ביד מהפעם הראשונה." },
        { name: "עומר כ׳ – אשקלון", type: "אופנוע A1", text: "שיעורים ממוקדים והכנה אמיתית לטסט. ממליץ בענק." },
        { name: "אדיר ל׳ – אשקלון", type: "אופנוע A", text: "תוך חודש סיימתי כל השיעורים ועברתי טסט ראשון על A." },
      ]}
      licenseTiers={[
        {
          code: "A",
          title: "רישיון אופנוע A – מגיל 21",
          image: bikeA,
          body: "אופנוע ללא הגבלה — הדרגה הגבוהה ביותר. מותנה ברישיון A1 עם ותק של שנה לפחות. ידני בלבד · שיעורים פרטניים עד הטסט. מינימום 8 שיעורים.",
          waMessage: "היי חן, אני מעוניין/ת ברישיון אופנוע A באשקלון, אשמח לפרטים",
        },
        {
          code: "A1",
          title: "רישיון אופנוע A1 – מגיל 18",
          image: bikeA1,
          body: "אופנוע עד 47 כ\"ס. מחזיקי A2 עם ותק שנה — 8 שיעורים בלבד. ידני או אוטומט — לבחירתכם. מינימום 15 שיעורים.",
          waMessage: "היי חן, אני מעוניין/ת ברישיון אופנוע A1 באשקלון, אשמח לפרטים",
        },
        {
          code: "A2",
          title: "רישיון אופנוע A2 – מגיל 16",
          image: bikeA2,
          body: "רישיון אופנוע ראשון — עד 14.7 כ\"ס. מגיל 16-17 נדרש אישור הורים בכתב. בעלי ותק 3 שנים על רכב פטורים ממסלול בטסט. ידני או אוטומט — לבחירתכם. מינימום 15 שיעורים.",
          waMessage: "היי חן, אני מעוניין/ת ברישיון אופנוע A2 באשקלון, אשמח לפרטים",
        },
      ]}
      faqs={faqs}
      related={[
        { to: "/car-lessons-ashkelon", title: "שיעורי רכב באשקלון" },
        { to: "/", title: "חזרה לעמוד הבית" },
      ]}
    />
  );
}