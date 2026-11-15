import { createFileRoute } from "@tanstack/react-router";
import { GuidePage, GuideSteps } from "@/components/GuidePage";
import { buildFaqJsonLd, type SeoFaq } from "@/components/SeoLanding";

const URL = "https://hendrive.co.il/motorcycle-test-ashkelon";
const TITLE = "טסט לאופנוע באשקלון – מבחן שליטה, מבחן בכביש וטיפים | חן כחלון";
const DESC = "מה קורה בטסט לאופנוע: מבחן שליטה במגרש, מבחן בכביש, מה להביא ואיך להתכונן. טיפים ממורה נהיגה לאופנוע באשקלון – חן כחלון.";

const faqs: SeoFaq[] = [
  { q: "ממה בנוי הטסט לאופנוע?", a: "משני חלקים: מבחן שליטה במגרש סגור, ואחריו מבחן נהיגה בכביש עם בוחן של משרד התחבורה." },
  { q: "יש לי רישיון רכב – גם אני נבחן בכביש?", a: "בעלי רישיון רכב שניגשים לטסט על A2 נבחנים לעיתים רק במבחן השליטה במגרש, בהתאם לוותק. אני בודק את זה מראש עם כל תלמיד." },
  { q: "מתי יודעים אם עברתי?", a: "התוצאה מופיעה באתר משרד התחבורה, בדרך כלל כבר למחרת." },
  { q: "מה עושים אם לא עברתי?", a: "לא נורא – זה קורה. עושים כמה שיעורי חיזוק על מה שהבוחן ציין, וחוזרים לטסט מוכנים יותר." },
  { q: "אפשר לערער על תוצאת הטסט?", a: "כן. אם לדעתך נפלה טעות, אפשר להגיש ערעור דרך אתר gov.il. הקישור נמצא בעמוד הקישורים השימושיים." },
];

export const Route = createFileRoute("/motorcycle-test-ashkelon")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:locale", content: "he_IL" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(buildFaqJsonLd(faqs)) }],
  }),
  component: Page,
});

function Page() {
  return (
    <GuidePage
      eyebrow="טסט לאופנוע · אשקלון"
      title="טסט לאופנוע – מה מצפה לך"
      intro="הטסט מלחיץ פחות כשיודעים בדיוק מה יקרה. ככה הוא בנוי, וככה אני מכין את התלמידים שלי לעבור בפעם הראשונה."
      waMessage="היי חן, אני מתכונן/ת לטסט על אופנוע ואשמח לפרטים"
      related={[
        { to: "/motorcycle-license-process", title: "איך מוציאים רישיון – שלב אחר שלב" },
        { to: "/useful-links", title: "קישורים שימושיים – כל הטפסים במקום אחד" },
        { to: "/motorcycle-license-a2-ashkelon", title: "רישיון A2 – מגיל 16" },
        { to: "/motorcycle-license-a1-ashkelon", title: "רישיון A1 – מגיל 18" },
        { to: "/motorcycle-license-a-ashkelon", title: "רישיון A – ללא הגבלה" },
      ]}
    >
      <h2>איך בנוי הטסט</h2>
      <GuideSteps
        steps={[
          {
            title: "מבחן שליטה במגרש סגור",
            body: "תרגילים על האופנוע במתחם סגור: נסיעה איטית ומאוזנת, פניות, עצירה ובלימה. כאן הבוחן רואה שאתה שולט בכלי.",
          },
          {
            title: "מבחן בכביש",
            body: "נסיעה בתנועה רגילה, כשהבוחן עוקב אחריך. בודקים זכות קדימה, איתות, הסתכלות לצדדים ובמראות, מיקום בנתיב ושמירת מרחק.",
          },
          {
            title: "התוצאה",
            body: "התוצאה מופיעה באתר משרד התחבורה, בדרך כלל כבר למחרת.",
          },
        ]}
      />

      <h2>מה להביא ביום הטסט</h2>
      <ul>
        <li>תעודה מזהה – תעודת זהות או דרכון.</li>
        <li>אישור על תשלום אגרת המבחן – <a href="https://ecom.gov.il/voucherspa/input/427" target="_blank" rel="noopener noreferrer">לתשלום אונליין</a>.</li>
        <li>נעליים סגורות ובגדים ארוכים. קסדה וכפפות – אצלי.</li>
      </ul>

      <h2>טיפים שלי להצלחה בטסט</h2>
      <ul>
        <li><strong>לישון טוב ולהגיע מוקדם.</strong> מגיעים רגועים, עם זמן לחימום קצר על האופנוע.</li>
        <li><strong>להסתכל רחוק.</strong> המבט מוביל את האופנוע – בפניות ובנסיעה איטית מסתכלים לאן שרוצים להגיע.</li>
        <li><strong>להראות לבוחן שאתה מסתכל.</strong> הזזת ראש ברורה לפני כל שינוי נתיב ופנייה.</li>
        <li><strong>לאתת בזמן ולכבות את האיתות.</strong> טעות קטנה וחוזרת שבוחנים שמים לב אליה.</li>
        <li><strong>זכות קדימה – בלי ספק.</strong> אם לא בטוח, עוצרים ונותנים זכות קדימה.</li>
        <li><strong>לא להיבהל מטעות קטנה.</strong> ממשיכים לרכוב נכון. טעות אחת לא תמיד אומרת כישלון.</li>
      </ul>

      <h2>איך אני מכין אותך</h2>
      <p>
        מתרגלים במגרש את כל תרגילי השליטה עד שהם יושבים טוב, ורוכבים במסלולים שדומים לאלה של המבחן בכבישי אשקלון. אני
        קובע לך טסט רק כשאני בטוח שאתה מוכן, כי המטרה היא לעבור בפעם הראשונה.
      </p>

      <h2>שאלות נפוצות</h2>
      <div className="space-y-4">
        {faqs.map((f) => (
          <div key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </div>
    </GuidePage>
  );
}
