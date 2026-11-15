import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { GuidePage } from "@/components/GuidePage";

const URL = "https://hendrive.co.il/useful-links";
const TITLE = "קישורים שימושיים להוצאת רישיון נהיגה – הצהרת בריאות, תיאוריה, אגרת מבחן | חן כחלון";
const DESC = "כל הקישורים הרשמיים במקום אחד: הצהרת בריאות, תחנות צילום ובדיקת עיניים, מאגר שאלות תיאוריה, תשלום אגרת מבחן, ערעור ועוד.";

type UsefulLink = { title: string; desc: string; href: string };

const groups: { title: string; links: UsefulLink[] }[] = [
  {
    title: "בדרך לרישיון",
    links: [
      { title: "הצהרת בריאות – תחילת התהליך", desc: "השלב הראשון: טופס הרישום והצהרת הבריאות באתר משרד התחבורה", href: "https://govforms.gov.il/mw/forms/RishumTheory@mot.gov.il" },
      { title: "תחנות לצילום ובדיקת עיניים", desc: "רשימת התחנות המורשות לצילום לרישיון ולבדיקת ראייה", href: "https://www.gov.il/he/Departments/DynamicCollectors/photo_driving_license_stock?skip=0&limit=10" },
      { title: "מאגר שאלות תיאוריה", desc: "כל שאלות מבחן התיאוריה, ב-6 שפות", href: "https://www.gov.il/he/Departments/DynamicCollectors/theoryexamhe_data?skip=0&limit=10" },
      { title: "לוח התמרורים המלא", desc: "כל התמרורים במקום אחד – מעולה לחזרה לפני התיאוריה", href: "https://www.gov.il/he/departments/policies/tamrurim_7924_01_18" },
      { title: "אזור אישי לתלמידים (ברוש)", desc: "מעקב אחרי השיעורים והסטטוס שלך במשרד התחבורה", href: "https://driverstudent.mot.gov.il" },
      { title: "תשלום אגרת מבחן", desc: "תשלום אגרת הטסט אונליין", href: "https://ecom.gov.il/voucherspa/input/427" },
      { title: "זימון תור למשרד הרישוי", desc: "קביעת תור מראש בלשכת הרישוי", href: "https://www.gov.il/he/departments/general/myvisit" },
    ],
  },
  {
    title: "אחרי הטסט",
    links: [
      { title: "ערעור על תוצאת מבחן נהיגה", desc: "הגשת ערעור אם לא עברת וחושב שנפלה טעות", href: "https://www.gov.il/he/service/appeal_the_result_of_a_driving_test" },
      { title: "הצהרת סיום תקופת מלווה", desc: "שליחת ההצהרה בסוף תקופת הליווי של נהג חדש", href: "https://www.gov.il/he/service/new_driver_accompaniment_period_statement" },
      { title: "הוצאת רישיון או היתר נהיגה חדש (כפל)", desc: "תשלום להנפקת רישיון חדש או כפל רישיון", href: "https://ecom.gov.il/voucherspa/input/209" },
    ],
  },
];

export const Route = createFileRoute("/useful-links")({
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
  }),
  component: Page,
});

function Page() {
  return (
    <GuidePage
      eyebrow="כל מה שצריך · במקום אחד"
      title="קישורים שימושיים"
      intro="הקישורים הרשמיים שתלמידים צריכים בדרך לרישיון – מהצהרת הבריאות ועד תשלום אגרת הטסט. שמרו את העמוד, הוא יחסוך לכם חיפושים."
      waMessage="היי חן, אני בתהליך הוצאת רישיון ויש לי שאלה"
      related={[
        { to: "/motorcycle-license-process", title: "איך מוציאים רישיון – שלב אחר שלב" },
        { to: "/motorcycle-test-ashkelon", title: "טסט לאופנוע – מה מצפה לך" },
      ]}
    >
      {groups.map((g) => (
        <section key={g.title}>
          <h2>{g.title}</h2>
          <ul className="!list-none !p-0 grid gap-3 sm:grid-cols-2">
            {g.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer"
                   className="!no-underline flex h-full items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06]">
                  <span>
                    <span className="block font-bold text-foreground">{l.title}</span>
                    <span className="block text-xs text-foreground/70 mt-1">{l.desc}</span>
                  </span>
                  <ExternalLink size={16} className="shrink-0 mt-1 text-primary" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="text-xs text-muted-foreground">
        הקישורים מובילים לאתרים חיצוניים, בעיקר של משרד התחבורה. אם קישור הפסיק לעבוד – ספרו לי ואעדכן.
      </p>
    </GuidePage>
  );
}
