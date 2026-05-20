import { createFileRoute } from "@tanstack/react-router";
import SeoLanding, { buildFaqJsonLd, buildLocalBusinessJsonLd, type SeoFaq } from "@/components/SeoLanding";

const URL = "https://hendrive.co.il/first-test-preparation-ashkelon";
const TITLE = "הכנה לטסט ראשון באשקלון | רכב ואופנוע – חן כחלון";
const DESC = "הכנה לטסט ראשון באשקלון – רכב ואופנוע. שיעורי רענון, מסלולי טסט אמיתיים, טיפים פסיכולוגיים ושיטה שמביאה ל-98% הצלחה. גם לתלמידים ממורה אחר.";

const faqs: SeoFaq[] = [
  { q: "האם תקבל אותי להכנה לטסט גם אם למדתי אצל מורה אחר?", a: "בהחלט. הרבה תלמידים מגיעים אליי לכמה שיעורי רענון ממוקדים לפני הטסט – ועוברים בפעם הראשונה." },
  { q: "כמה שיעורי הכנה צריך?", a: "לרוב 2–5 שיעורים מספיקים, תלוי ברמה. אבנה איתך תוכנית אישית אחרי שיעור הערכה ראשון." },
  { q: "מה כוללת ההכנה לטסט באשקלון?", a: "תרגול מסלולי טסט אמיתיים בעיר, חניות, חצייה בכניסות ובצמתים, וטיפים להתמודדות עם הלחץ של הבוחן." },
  { q: "האם זה תקף גם לטסט אופנוע?", a: "כן – יש הכנה ייעודית לטסט אופנוע במגרש האימונים באשקלון ובכבישים." },
  { q: "באיזה אזורים אתם לוקחים טסט?", a: "טסטים נלקחים באשקלון ובסביבה – כל מסלולי הטסט מתורגלים מראש בשיעורי ההכנה." },
];

export const Route = createFileRoute("/first-test-preparation-ashkelon")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "הכנה לטסט אשקלון, טסט ראשון אשקלון, שיעורי רענון אשקלון, מסלולי טסט אשקלון, הכנה לטסט אופנוע אשקלון, חן כחלון" },
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
        serviceName: "הכנה לטסט ראשון באשקלון – רכב ואופנוע",
        serviceDesc: DESC, url: URL,
      })) },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SeoLanding
      eyebrow="הכנה לטסט · אשקלון"
      h1Lead="הכנה לטסט ראשון באשקלון –"
      h1Highlight="עוברים בפעם הראשונה"
      intro="שיעורי רענון ממוקדים על מסלולי הטסט האמיתיים באשקלון – רכב ואופנוע. גם לתלמידים שלמדו אצל מורה אחר. 98% הצלחה בטסט ראשון."
      ctaSubline="טסט ראשון? בואו נכין אותך כמו שצריך."
      waMessage="היי חן, אני מעוניין/ת בהכנה לטסט באשקלון, אשמח לפרטים"
      highlights={[
        { icon: "trophy", title: "98% טסט ראשון", body: "שיטה מוכחת שעובדת – מאות תלמידים מאשקלון כבר עברו בפעם הראשונה." },
        { icon: "grad", title: "מסלולי טסט אמיתיים", body: "מתרגלים את הצמתים, החניות והמעגלים שבאמת מופיעים בטסט באשקלון." },
        { icon: "shield", title: "טיפים נגד לחץ", body: "הכנה מנטלית – איך מתנהגים עם בוחן, איך לא מתבלבלים ושומרים על קור רוח." },
        { icon: "car", title: "גם לרכב וגם לאופנוע", body: "הכנה ייעודית לכל דרגה – B, A, A1, A2." },
        { icon: "car", title: "פתוח גם למי שלמד במקום אחר", body: "מגיעים לכמה שיעורי רענון בלבד ומסיימים בהצלחה." },
        { icon: "bike", title: "גמישות מקסימלית", body: "תיאום מהיר של שיעור הכנה גם יום-יומיים לפני הטסט." },
      ]}
      reviews={[
        { name: "אדיר ל׳ – אשקלון", type: "טסט A ראשון", text: "באתי לחן אחרי שני מורים אחרים. תוך חודש – טסט ראשון על A." },
        { name: "מאי ג׳ – אשקלון", type: "טסט B ראשון", text: "כמה שיעורי רענון לפני הטסט עשו את כל ההבדל. עברתי 🚗" },
        { name: "שיר ב׳ – גן יבנה", type: "טסט B ראשון", text: "המורה הכי טוב שיכולתי לבקש. עברתי טסט ראשון בלי לחץ." },
      ]}
      faqs={faqs}
      related={[
        { to: "/driving-instructor-ashkelon", title: "מורה נהיגה באשקלון" },
        { to: "/car-lessons-ashkelon", title: "שיעורי רכב באשקלון" },
        { to: "/motorcycle-lessons-ashkelon", title: "שיעורי אופנוע באשקלון" },
        { to: "/a1-motorcycle-lessons", title: "אופנוע A1" },
        { to: "/a2-motorcycle-lessons", title: "אופנוע A2" },
      ]}
    />
  );
}