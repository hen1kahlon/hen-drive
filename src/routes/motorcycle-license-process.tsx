import { createFileRoute } from "@tanstack/react-router";
import { GuidePage, GuideSteps } from "@/components/GuidePage";
import { buildFaqJsonLd, type SeoFaq } from "@/components/SeoLanding";

const URL = "https://hendrive.co.il/motorcycle-license-process";
const TITLE = "איך מוציאים רישיון לאופנוע? כל השלבים מהטופס הירוק ועד הטסט | חן כחלון";
const DESC = "מדריך פשוט להוצאת רישיון אופנוע או רכב: טופס ירוק, בדיקת ראייה, אישור רופא, תיאוריה, שיעורים וטסט. מורה נהיגה באשקלון – חן כחלון.";

const faqs: SeoFaq[] = [
  { q: "מה זה טופס ירוק?", a: "זו הבקשה הרשמית להוצאת רישיון נהיגה. ממלאים אותה אונליין באתר משרד התחבורה, יחד עם הצהרת בריאות, ואחריה עושים בדיקת ראייה." },
  { q: "צריך ללכת לרופא בשביל הצהרת הבריאות?", a: "ברוב המקרים לא. הצהרת הבריאות היא חלק מהטופס המקוון וממלאים אותה בעצמכם. רק במקרים מסוימים משרד התחבורה מבקש מסמכים רפואיים נוספים." },
  { q: "אפשר להתחיל שיעורים לפני התיאוריה?", a: "אפשר להתחיל ללמוד, אבל לטסט ניגשים רק אחרי שעברתם תיאוריה או שאתם פטורים ממנה." },
  { q: "מי פטור ממבחן התיאוריה לאופנוע?", a: "בין היתר: בעלי רישיון רכב פרטי (B), בעלי רישיון אופנוע בדרגה אחרת, ומי שעבר תיאוריה בחמש השנים האחרונות." },
  { q: "כמה זמן לוקח כל התהליך?", a: "תלוי בקצב שלך ובזמינות התורים. לאופנוע זה יכול להיות מהיר – לפעמים כמה שבועות מהשיעור הראשון ועד הטסט." },
];

export const Route = createFileRoute("/motorcycle-license-process")({
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
      eyebrow="המדריך · שלב אחר שלב"
      title="איך מוציאים רישיון?"
      intro="מהטופס הירוק ועד הרישיון ביד – כל השלבים, בשפה פשוטה. אותו תהליך לאופנוע ולרכב, עם כמה הבדלים קטנים שמפורטים כאן."
      waMessage="היי חן, קראתי את המדריך באתר ואשמח לעזרה בהוצאת רישיון"
      related={[
        { to: "/useful-links", title: "קישורים שימושיים – כל הטפסים במקום אחד" },
        { to: "/motorcycle-test-ashkelon", title: "טסט לאופנוע – מה מצפה לך" },
        { to: "/motorcycle-license-a2-ashkelon", title: "רישיון A2 – מגיל 16" },
        { to: "/motorcycle-license-a1-ashkelon", title: "רישיון A1 – מגיל 18" },
        { to: "/car-lessons-ashkelon", title: "שיעורי רכב באשקלון" },
      ]}
    >
      <a href="https://govforms.gov.il/mw/forms/RishumTheory@mot.gov.il" target="_blank" rel="noopener noreferrer"
         className="!no-underline flex items-center justify-between gap-4 rounded-2xl border border-primary/40 bg-primary/10 p-5 hover:bg-primary/15">
        <span>
          <span className="block text-lg font-black text-foreground">טופס ירוק והצהרת בריאות</span>
          <span className="block text-sm text-foreground/75">השלב הראשון בדרך לרישיון – ממלאים אונליין באתר משרד התחבורה</span>
        </span>
        <span className="shrink-0 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-bold">למילוי הטופס ←</span>
      </a>

      <h2>השלבים בקצרה</h2>
      <GuideSteps
        steps={[
          {
            title: "ממלאים טופס ירוק והצהרת בריאות",
            body: (
              <>
                זו הבקשה להוצאת רישיון, וכוללת גם הצהרת בריאות שממלאים בעצמכם. הכול אונליין, באתר{" "}
                <a href="https://www.gov.il/he/service/apply_for_new_driver_drivers_license" target="_blank" rel="noopener noreferrer">
                  משרד התחבורה
                </a>
                . מי שכבר יש לו רישיון ורוצה להוסיף דרגה (למשל אופנוע לבעלי רישיון רכב) עובר את אותו תהליך.
              </>
            ),
          },
          {
            title: "בדיקת ראייה",
            body: (
              <>
                אצל אופטומטריסט שמורשה מטעם משרד התחבורה. התוצאות נכנסות ישירות לטופס המקוון.{" "}
                <a href="https://www.gov.il/he/Departments/DynamicCollectors/photo_driving_license_stock?skip=0&limit=10" target="_blank" rel="noopener noreferrer">
                  רשימת התחנות לצילום ובדיקת עיניים
                </a>
              </>
            ),
          },
          {
            title: "מסמכים רפואיים – רק אם מבקשים",
            body: "ברוב המקרים הצהרת הבריאות המקוונת מספיקה ואין צורך להגיע לרופא. אם משרד התחבורה מבקש מסמכים נוספים, מגישים אותם לפי ההנחיות.",
          },
          {
            title: "מבחן תיאוריה – או פטור",
            body: (
              <>
                מבחן ממוחשב על חוקי התנועה. בעלי רישיון רכב או רישיון אופנוע אחר פטורים. לדרגות A2, A1 ו-B אפשר לגשת לתיאוריה מגיל 15 וחצי.{" "}
                <a href="https://www.gov.il/he/Departments/DynamicCollectors/theoryexamhe_data?skip=0&limit=10" target="_blank" rel="noopener noreferrer">
                  מאגר שאלות התיאוריה
                </a>
              </>
            ),
          },
          {
            title: "שיעורי נהיגה",
            body: "שיעורים עם מורה מוסמך: קודם במגרש אימונים, אחר כך בכבישי העיר. יש מספר מינימלי של שיעורים לכל דרגה, ומתקדמים בקצב שלך.",
          },
          {
            title: "טסט",
            body: (
              <>
                כשאתה מוכן, אני קובע לך טסט. באופנוע הטסט כולל מבחן שליטה במגרש ומבחן בכביש. ביום המבחן אתה נבחן על האופנוע שלמדת עליו.{" "}
                <a href="https://ecom.gov.il/voucherspa/input/427" target="_blank" rel="noopener noreferrer">
                  תשלום אגרת המבחן
                </a>
              </>
            ),
          },
          {
            title: "רישיון ביד",
            body: "התוצאה מתקבלת עד 3 שעות אחרי המבחן. אחרי שעוברים – מקבלים רישיון נהג חדש.",
          },
        ]}
      />

      <h2>גיל ומספר שיעורים לפי דרגת אופנוע</h2>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.04]">
            <tr>
              <th className="p-3 text-right">דרגה</th>
              <th className="p-3 text-right">מה מותר</th>
              <th className="p-3 text-right">גיל לטסט</th>
              <th className="p-3 text-right">מינימום שיעורים</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr><td className="p-3 font-bold">A2</td><td className="p-3">קטנוע / אופנוע עד 11 קילוואט</td><td className="p-3">16 (עד 17 באישור הורים)</td><td className="p-3">15 (בעלי רישיון רכב 3 שנים ומעלה – ללא מינימום, מבחן שליטה בלבד)</td></tr>
            <tr><td className="p-3 font-bold">A1</td><td className="p-3">אופנוע עד 35 קילוואט (47.46 כ״ס)</td><td className="p-3">18</td><td className="p-3">15 (8 לבעלי A2 עם שנת ותק)</td></tr>
            <tr><td className="p-3 font-bold">A</td><td className="p-3">כל אופנוע, ללא הגבלה</td><td className="p-3">21, עם שנת ותק ב-A1</td><td className="p-3">8</td></tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        הנתונים לפי כללי משרד התחבורה ועשויים להשתנות. לפני שמתחילים אני עובר איתך על מה שחל עליך.
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
