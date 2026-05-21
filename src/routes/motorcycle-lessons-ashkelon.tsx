import { createFileRoute } from "@tanstack/react-router";
import SeoLanding, { buildFaqJsonLd, buildLocalBusinessJsonLd, type SeoFaq } from "@/components/SeoLanding";

const URL = "https://hendrive.co.il/motorcycle-lessons-ashkelon";
const TITLE = "שיעורי אופנוע באשקלון | בית ספר לנהיגה לאופנוע – חן כחלון";
const DESC = "שיעורי נהיגה לאופנוע באשקלון – דרגות A, A1, A2 ידני ואוטומט. מורה צעיר, ציוד חדש, הכנה לטסט וליווי עד ההצלחה באשקלון והסביבה.";

const faqs: SeoFaq[] = [
  { q: "מהן דרגות האופנוע ומה ההבדל?", a: "A – מגיל 21, אופנוע ללא הגבלת נפח. A2 – מגיל 16, עד 125 סמ\"ק (ידני/אוטומט). A1 – מגיל 18, עד 500 סמ\"ק (ידני/אוטומט)." },
  { q: "כמה שיעורי אופנוע צריך עד הטסט?", a: "תלוי בדרגה ובניסיון: A2 בדרך כלל 12–20 שיעורים, A1 בין 14 ל-22, A לרוב 16–24. אצלי השיעורים ממוקדים – ופחות שיעורים בפועל." },
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
        { icon: "bike", title: "A – אופנוע גדול", body: "מגיל 21, ללא הגבלת נפח. הכנה מלאה למגרש ולטסט עם אופנוע מתאים." },
        { icon: "bike", title: "A1 ידני/אוטומט", body: "מגיל 18, עד 500 סמ\"ק. בחירה בין ידני לאוטומט לפי מה שנוח לך." },
        { icon: "bike", title: "A2 ידני/אוטומט", body: "מגיל 16, עד 125 סמ\"ק – הדרך המהירה לרישיון אופנוע ראשון." },
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
          title: "רישיון אופנוע A – ללא הגבלת נפח",
          image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=70",
          body: "מגיל 21, אופנוע גדול ללא הגבלת נפח מנוע (cc). הכנה מלאה למגרש ולכביש עם אופנוע מתאים, דגש על שליטה במהירויות גבוהות ובלימה בטוחה.",
          transmission: "ידני בלבד · שיעורים פרטניים עד הטסט",
          waMessage: "היי חן, אני מעוניין/ת ברישיון אופנוע A באשקלון, אשמח לפרטים",
        },
        {
          code: "A1",
          title: "רישיון אופנוע A1 – עד 500 סמ\"ק",
          image: "https://images.unsplash.com/photo-1568708474879-cb37e1e8a8a8?auto=format&fit=crop&w=900&q=70",
          body: "מגיל 18, אופנוע עד 500 סמ\"ק. מתאים למי שרוצה אופנוע בינוני לעיר ולכביש בין-עירוני, עם הספק נוח ושליטה קלה.",
          transmission: "ידני או אוטומט – לבחירתכם",
          waMessage: "היי חן, אני מעוניין/ת ברישיון אופנוע A1 באשקלון, אשמח לפרטים",
        },
        {
          code: "A2",
          title: "רישיון אופנוע A2 – עד 125 סמ\"ק",
          image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&w=900&q=70",
          body: "מגיל 16, אופנוע עד 125 סמ\"ק. הדרך המהירה והנגישה לרישיון אופנוע ראשון – מושלם לעיר, לימודים ועבודה.",
          transmission: "ידני או אוטומט – לבחירתכם",
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