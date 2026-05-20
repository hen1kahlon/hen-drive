import { createFileRoute } from "@tanstack/react-router";
import SeoLanding, { buildFaqJsonLd, buildLocalBusinessJsonLd, type SeoFaq } from "@/components/SeoLanding";

const URL = "https://hendrive.co.il/car-lessons-ashkelon";
const TITLE = "שיעורי נהיגה ברכב באשקלון | רכב אוטומט – חן כחלון";
const DESC = "שיעורי נהיגה לרכב פרטי (דרגה B) באשקלון על רכב אוטומט חדש. יחס אישי, סבלנות, איסוף מהבית והכנה ממוקדת לטסט. שירות גם באשדוד וקריית גת.";

const faqs: SeoFaq[] = [
  { q: "כמה שיעורי רכב צריך עד טסט באשקלון?", a: "המינימום הוא 28 שיעורים, אך לרוב מספיק 28–40 כדי להגיע מוכן לטסט – תלוי בקצב התלמיד." },
  { q: "אילו רכבים בשיעור?", a: "רכב אוטומט חדש, נוח, ממוזג ובעל כל אמצעי הבטיחות הנדרשים – כך שתלמדו בנוחות מלאה." },
  { q: "האם יש איסוף מהבית באשקלון?", a: "כן, איסוף מכל אזור באשקלון והסביבה בתיאום מראש – ללא בזבוז זמן." },
  { q: "מתי מתחילים בשיעורים בכבישים?", a: "כבר משיעור 1–2 לרוב יוצאים לכבישים שקטים באשקלון, ולאחר מכן עוברים לצירים סואנים ולנהיגה עירונית." },
  { q: "האם אפשר ללמוד גם בערב?", a: "כן – יש זמינות גם בשעות אחר הצהריים והערב, וגם בימי שישי בבוקר." },
];

export const Route = createFileRoute("/car-lessons-ashkelon")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "שיעורי נהיגה אשקלון, מורה נהיגה רכב אשקלון, רכב אוטומט אשקלון, רישיון רכב אשקלון, נהיגה דרגה B אשקלון, חן כחלון" },
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
        serviceName: "שיעורי נהיגה לרכב באשקלון (דרגה B)",
        serviceDesc: DESC, url: URL,
      })) },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SeoLanding
      eyebrow="רכב פרטי · אשקלון"
      h1Lead="שיעורי נהיגה ברכב באשקלון –"
      h1Highlight="אוטומט חדש"
      intro="לימוד נהיגה לרכב פרטי (דרגה B) על רכב אוטומט חדש ונוח. גישה אישית, סבלנות וליווי עד הטסט – באשקלון, אשדוד וקריית גת."
      ctaSubline="מתחילים ללמוד נהיגה ברכב?"
      waMessage="היי חן, אני מעוניין/ת בשיעורי רכב באשקלון, אשמח לפרטים"
      highlights={[
        { icon: "car", title: "רכב חדש ונוח", body: "אוטומט מודרני, ממוזג ומאובזר באמצעי בטיחות מתקדמים." },
        { icon: "shield", title: "בטיחות לכל החיים", body: "לא רק לעבור טסט – ללמוד לנהוג נכון ולשמור על עצמך בכביש." },
        { icon: "grad", title: "התקדמות בקצב שלך", body: "אין שיעורים מיותרים. מתקדמים בדיוק לפי הקצב והביטחון שלך." },
        { icon: "trophy", title: "98% טסט ראשון", body: "תלמידי רכב מאשקלון עוברים ברובם בטסט הראשון בזכות הכנה ממוקדת." },
        { icon: "car", title: "איסוף מהבית", body: "באשקלון והסביבה – חוסכים זמן, מתחילים את השיעור בלי לחץ." },
        { icon: "car", title: "זמינות גמישה", body: "שיעורים בבוקר, אחר הצהריים, ערב ויום שישי." },
      ]}
      reviews={[
        { name: "ליאור מ׳ – אשקלון", type: "רכב B", text: "המורה הכי סבלני. עברתי טסט ראשון על רכב אוטומט באשקלון." },
        { name: "נועה ש׳ – אשקלון", type: "רכב B", text: "הרגשתי בטוחה מהשיעור הראשון. עברתי טסט בפעם הראשונה." },
        { name: "דניאל מ׳ – אשקלון", type: "רכב B", text: "התחלתי בלי שום ידע. שלב-שלב, בלי לחץ – ועברתי בקלות." },
      ]}
      faqs={faqs}
      related={[
        { to: "/driving-instructor-ashkelon", title: "מורה נהיגה באשקלון" },
        { to: "/first-test-preparation-ashkelon", title: "הכנה לטסט באשקלון" },
        { to: "/motorcycle-lessons-ashkelon", title: "שיעורי אופנוע באשקלון" },
        { to: "/a1-motorcycle-lessons", title: "אופנוע A1" },
        { to: "/a2-motorcycle-lessons", title: "אופנוע A2" },
      ]}
    />
  );
}