import { createFileRoute } from "@tanstack/react-router";
import SeoLanding, { buildFaqJsonLd, buildLocalBusinessJsonLd, type SeoFaq } from "@/components/SeoLanding";

const URL = "https://hendrive.co.il/a-motorcycle-license";
const TITLE = "רישיון אופנוע A באשקלון | אופנוע גדול ללא הגבלת נפח – חן כחלון";
const DESC = "רישיון אופנוע דרגה A באשקלון – ללא הגבלת נפח, מגיל 21. אופנוע חדש, מגרש אימונים מסודר באשקלון, הכנה ממוקדת לטסט וליווי אישי עד הקריאה ״עברת״.";

const faqs: SeoFaq[] = [
  { q: "מה זה רישיון אופנוע A?", a: "רישיון A מתיר נהיגה על אופנוע ללא הגבלת נפח והספק. הדרגה הגבוהה ביותר באופנוע, מותר מגיל 21." },
  { q: "מאיזה גיל אפשר להוציא A?", a: "מגיל 21. אם יש לך A1 או A2 לפחות שנתיים, אפשר לעלות דרגה בקלות יחסית." },
  { q: "כמה שיעורים צריך לרישיון A?", a: "לרוב 16–24 שיעורים, תלוי בניסיון הקודם שלך באופנוע. אצלי השיעורים ממוקדים ומותאמים אישית." },
  { q: "איפה מתקיימים השיעורים?", a: "במגרש אימונים מסודר באשקלון לתרגול, ובהמשך בכבישי אשקלון והסביבה להכנה מלאה לטסט." },
  { q: "האם הציוד כלול?", a: "כן – אופנוע חדש ומתוחזק, קסדה וכפפות. צריך להגיע עם נעליים סגורות ובגדים ארוכים." },
];

export const Route = createFileRoute("/a-motorcycle-license")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "רישיון A אשקלון, אופנוע A אשקלון, רישיון אופנוע גדול אשקלון, מורה אופנוע A אשקלון, חן כחלון" },
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
        serviceName: "רישיון אופנוע A באשקלון",
        serviceDesc: DESC, url: URL,
      })) },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SeoLanding
      eyebrow="אופנוע A · אשקלון"
      h1Lead="רישיון אופנוע A –"
      h1Highlight="ללא הגבלת נפח"
      intro="הדרגה הגבוהה ביותר באופנוע – מגיל 21, ללא הגבלת נפח. שיעורים על אופנוע מתאים במגרש האימונים באשקלון ובכבישי הסביבה."
      ctaSubline="רוצה רישיון A?"
      waMessage="היי חן, אני מעוניין/ת ברישיון אופנוע A באשקלון, אשמח לפרטים"
      highlights={[
        { icon: "bike", title: "ללא הגבלת נפח", body: "כל אופנוע, בכל גודל – חופש מלא בכביש." },
        { icon: "shield", title: "ציוד ובטיחות", body: "אופנוע חדש ומתוחזק, קסדה וכפפות. בטיחות מההתחלה ועד הטסט." },
        { icon: "grad", title: "מגרש + כבישים", body: "תרגול במגרש מוסדר באשקלון ובכבישי העיר עד שמרגישים בנוח." },
        { icon: "trophy", title: "טסט ראשון", body: "98% מתלמידי האופנוע באשקלון עוברים בטסט הראשון." },
        { icon: "bike", title: "קצב גמיש", body: "בונים יחד לוח שיעורים שעובד עם הזמן שלך." },
        { icon: "car", title: "שירות מקומי", body: "אשקלון והסביבה – תיאום מהיר ושיעורים על מסלולי הטסט." },
      ]}
      reviews={[
        { name: "אדיר ל׳ – אשקלון", type: "אופנוע A", text: "באתי לחן אחרי שני מורים. תוך חודש סיימתי A ועברתי טסט ראשון." },
        { name: "רון ש׳ – אשקלון", type: "אופנוע A", text: "מורה שמכיר את הכבישים בעיר טוב מכולם. הכנה אמיתית לטסט." },
        { name: "אלון ב׳ – אשקלון", type: "אופנוע A", text: "אופנוע חדש, יחס אישי וביטחון מלא לפני הטסט." },
      ]}
      faqs={faqs}
      related={[
        { to: "/a1-motorcycle-lessons", title: "אופנוע A1" },
        { to: "/a2-motorcycle-lessons", title: "אופנוע A2" },
        { to: "/motorcycle-lessons-ashkelon", title: "כל דרגות האופנוע" },
        { to: "/car-lessons-ashkelon", title: "שיעורי רכב באשקלון" },
      ]}
    />
  );
}