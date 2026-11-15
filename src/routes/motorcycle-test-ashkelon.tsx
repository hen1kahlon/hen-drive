import { createFileRoute } from "@tanstack/react-router";
import { GuidePage, GuideSteps } from "@/components/GuidePage";
import { buildFaqJsonLd, type SeoFaq } from "@/components/SeoLanding";
import { TikTokRow } from "@/components/TikTokEmbed";

const URL = "https://hendrive.co.il/motorcycle-test-ashkelon";
const TITLE = "טסט לאופנוע באשקלון – מבחן שליטה, מבחן בכביש וטיפים | חן כחלון";
const DESC = "מה קורה בטסט לאופנוע: מבחן שליטה במגרש, מבחן בכביש, מה להביא ואיך להתכונן. טיפים ממורה נהיגה לאופנוע באשקלון – חן כחלון.";

const faqs: SeoFaq[] = [
  { q: "ממה בנוי הטסט לאופנוע?", a: "משני חלקים: מבחן שליטה במגרש סגור עם 5 משימות – נסיעה איטית בקו ישר, סלאלום, שערים, האצה ועצירת מטרה, ושמיניות – ואחריו מבחן נהיגה בכביש עם בוחן של משרד התחבורה." },
  { q: "יש לי רישיון רכב – גם אני נבחן בכביש?", a: "מי שמחזיק רישיון רכב 3 שנים ומעלה וניגש ל-A2 נבחן רק במבחן השליטה במגרש, ואין לו מינימום שיעורים. בשאר המקרים הטסט כולל גם מבחן בכביש." },
  { q: "מתי יודעים אם עברתי?", a: "התוצאה מתקבלת עד 3 שעות אחרי המבחן." },
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

function MissionMeta({ gear, aGear = "הילוך ראשון", speed }: { gear: string; aGear?: string; speed?: string }) {
  return (
    <span className="mt-2 flex flex-wrap gap-2">
      <span className="rounded-full bg-primary/15 text-primary px-3 py-1 text-xs font-bold">A1 ידני: {gear}</span>
      <span className="rounded-full bg-accent/15 text-accent px-3 py-1 text-xs font-bold">A: {aGear}</span>
      {speed && <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">{speed}</span>}
    </span>
  );
}

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
            body: "חמש משימות על האופנוע במתחם סגור – מפורטות כאן למטה. כאן הבוחן רואה שאתה שולט בכלי.",
          },
          {
            title: "מבחן בכביש",
            body: "נסיעה בתנועה רגילה, כשהבוחן עוקב אחריך. בודקים זכות קדימה, איתות, הסתכלות לצדדים ובמראות, מיקום בנתיב ושמירת מרחק.",
          },
          {
            title: "התוצאה",
            body: "התוצאה מתקבלת עד 3 שעות אחרי המבחן.",
          },
        ]}
      />

      <h2>מבחן השליטה – 5 המשימות</h2>
      <p>
        המשימות מתבצעות לפי הסדר, ברצף. ליד כל משימה מופיעים ההילוך לכל דרגה והמהירות.{" "}
        <strong>ב-A1 ידני</strong> – משימה 1 בהילוך ראשון, ממשימה 2 עוברים לשני, ובמשימה 4 מורידים שוב לראשון ועוצרים עצירת מטרה.{" "}
        <strong>ב-A</strong> – כל המשימות בהילוך ראשון, חוץ ממשימה 4: מעלים הילוך, מורידים בחזרה לראשון ועוצרים עצירת מטרה.
      </p>
      <GuideSteps
        steps={[
          {
            title: "נסיעה בקו ישר ובנסיעה איטית",
            body: (
              <>
                נסיעה איטית ויציבה בקו ישר, עם מבט קדימה ולא לרצפה.
                <MissionMeta gear="הילוך ראשון" speed="7 קמ״ש" />
              </>
            ),
          },
          {
            title: "סלאלום",
            body: (
              <>
                נסיעה בין חמש הנקודות בקצב מהיר יותר, בתנועה רציפה מצד לצד.
                <MissionMeta gear="הילוך שני" speed="12–14 קמ״ש" />
              </>
            ),
          },
          {
            title: "שערים",
            body: (
              <>
                מעבר בין ארבעה שערים – רק הגלגל הקדמי נכנס בין השערים.
                <MissionMeta gear="הילוך שני" speed="12–14 קמ״ש" />
              </>
            ),
          },
          {
            title: "האצה, הורדת הילוך ועצירת מטרה",
            body: (
              <>
                מאיצים, מורידים הילוך לראשון ועוצרים עצירת מטרה. ב-A מעלים הילוך תוך כדי ההאצה, מורידים לראשון ועוצרים עצירת מטרה.
                <MissionMeta gear="משני לראשון" aGear="העלאת הילוך, הורדה לראשון" speed="18–20 קמ״ש" />
              </>
            ),
          },
          {
            title: "שמיניות",
            body: (
              <>
                נסיעה בצורת הספרה 8, בשליטה ובמבט לכיוון הפנייה. <strong>הכי חשוב כאן: לעבוד עם המצמד (הקלאץ׳)</strong> כדי לשמור על מהירות נמוכה ויציבה בפניות.
                <MissionMeta gear="הילוך שני" />
              </>
            ),
          },
        ]}
      />

      <h2>צפו במשימות מהמגרש</h2>
      <p>סרטונים שלי מהמגרש ומהטסט – ככה זה נראה באמת.</p>
      <div className="not-prose my-6">
        <TikTokRow
          videos={[
            { id: "7703058468957179157", title: "מה מחכה לכם במגרש המשימות" },
            { id: "7701800344614964500", title: "משימה 3 – השערים" },
            { id: "7692003053506940180", title: "משימה 5 – השמיניות" },
            { id: "7704374003556715797", title: "לפני טסט החוץ – כדאי לדעת" },
          ]}
        />
      </div>

      <h2>מה להביא ביום הטסט</h2>
      <ul>
        <li>תעודה מזהה – תעודת זהות או דרכון.</li>
        <li>אישור על תשלום אגרת המבחן – <a href="https://ecom.gov.il/voucherspa/input/427" target="_blank" rel="noopener noreferrer">לתשלום אונליין</a>.</li>
        <li>כפפות, נעליים סגורות ובגדים ארוכים. אופנוע וקסדה – אצלי.</li>
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
