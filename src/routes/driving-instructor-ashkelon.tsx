import { createFileRoute } from "@tanstack/react-router";
import SeoLanding, { buildFaqJsonLd, buildLocalBusinessJsonLd, type SeoFaq } from "@/components/SeoLanding";

const URL = "https://hendrive.co.il/driving-instructor-ashkelon";
const TITLE = "מורה נהיגה באשקלון – חן כחלון | רכב ואופנוע, ליווי עד הטסט";
const DESC = "מחפשים מורה נהיגה באשקלון? חן כחלון – בית ספר לנהיגה לרכב ולאופנוע, יחס אישי, סבלנות, רכב חדש ו-98% טסט ראשון. שירות באשקלון, אשדוד, קריית גת והדרום.";

const faqs: SeoFaq[] = [
  { q: "איך בוחרים מורה נהיגה טוב באשקלון?", a: "חשוב לבדוק ותק, המלצות אמיתיות מתלמידים, סוג הרכב/אופנוע, סבלנות והתאמה אישית. אצל חן כחלון מקבלים את כל אלה יחד עם 98% הצלחה בטסט ראשון." },
  { q: "באילו אזורים אתה מלמד?", a: "אשקלון, אשדוד, קריית גת, גן יבנה, קרית מלאכי, נתיבות, שדרות וכל אזור הדרום – עם איסוף מהבית בתיאום מראש." },
  { q: "כמה עולה שיעור נהיגה באשקלון?", a: "המחיר משתנה לפי דרגה (B / A / A1 / A2) ולפי חבילת שיעורים. דברו איתי בוואטסאפ ואשלח הצעת מחיר מותאמת אישית." },
  { q: "תוך כמה זמן אפשר לעבור טסט?", a: "רכב: בדרך כלל חודשיים עד 4 חודשים. אופנוע: גם בתוך שבוע בקורס מרוכז, בהתאם לזמינות וניסיון קודם." },
  { q: "האם יש איסוף מהבית?", a: "כן, ניתן לתאם איסוף מכל אזור באשקלון והסביבה ללא תוספת תשלום במרבית האזורים." },
];

export const Route = createFileRoute("/driving-instructor-ashkelon")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "מורה נהיגה אשקלון, מורה נהיגה רכב אשקלון, מורה נהיגה אופנוע אשקלון, חן כחלון, בית ספר לנהיגה אשקלון, מורה נהיגה אשדוד, מורה נהיגה קריית גת" },
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
        serviceName: "מורה נהיגה באשקלון – רכב ואופנוע",
        serviceDesc: DESC, url: URL,
      })) },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SeoLanding
      eyebrow="מורה נהיגה · אשקלון"
      h1Lead="מורה נהיגה באשקלון –"
      h1Highlight="חן כחלון"
      intro="בית ספר לנהיגה לרכב ולאופנוע באשקלון. גישה אישית, סבלנות אמיתית, כלים חדשים ושיטה שמביאה לטסט ראשון – בכל הדרום."
      ctaSubline="מוכנים להתחיל את הדרך לרישיון?"
      waMessage="היי חן, ראיתי באתר את הדף 'מורה נהיגה אשקלון' ואשמח לקבל פרטים"
      highlights={[
        { icon: "car", title: "רכב אוטומט (B)", body: "שיעורי נהיגה לרכב פרטי באשקלון על רכב חדש, נוח ובטוח – עם הכנה מלאה לטסט." },
        { icon: "bike", title: "אופנוע A / A1 / A2", body: "כל דרגות האופנוע: ידני ואוטומט, ממגרש אימונים ועד טסט – בליווי צמוד." },
        { icon: "shield", title: "בטיחות מעל הכל", body: "ציוד תקני, רכב מתוחזק וגישה שמלמדת אותך לנהוג נכון לכל החיים." },
        { icon: "grad", title: "98% טסט ראשון", body: "אחוזי הצלחה גבוהים בזכות שיטה ברורה והכנה ממוקדת לטסט באשקלון." },
        { icon: "trophy", title: "5 שנות ותק", body: "מאות תלמידים מאשקלון, אשדוד, קריית גת והסביבה כבר קיבלו רישיון." },
        { icon: "car", title: "איסוף מהבית", body: "בתיאום מראש – איסוף מכל אזור באשקלון והסביבה, ללא בזבוז זמן." },
      ]}
      reviews={[
        { name: "ליאור מ׳ – אשקלון", type: "רכב B", text: "המורה הכי סבלני שפגשתי. עברתי טסט ראשון על רכב אוטומט. ממליץ בחום." },
        { name: "נועה ש׳ – אשקלון", type: "רכב B", text: "הרגשתי בטוחה מהשיעור הראשון, חן מסביר עד שמבינים. טסט ראשון!" },
        { name: "יובל א׳ – אשדוד", type: "אופנוע A2", text: "ציוד חדש, הסבר מסודר ורישיון ביד מהפעם הראשונה." },
      ]}
      faqs={faqs}
      related={[
        { to: "/motorcycle-lessons-ashkelon", title: "שיעורי אופנוע באשקלון" },
        { to: "/car-lessons-ashkelon", title: "שיעורי רכב באשקלון" },
        { to: "/first-test-preparation-ashkelon", title: "הכנה לטסט באשקלון" },
        { to: "/a1-motorcycle-lessons", title: "אופנוע A1" },
        { to: "/a2-motorcycle-lessons", title: "אופנוע A2" },
      ]}
    />
  );
}