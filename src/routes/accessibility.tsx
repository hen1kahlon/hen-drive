import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LEGAL_UPDATED } from "@/components/LegalPage";

const URL = "https://hendrive.co.il/accessibility";
const TITLE = "הצהרת נגישות | חן כחלון – מורה נהיגה";
const DESC = "הצהרת הנגישות של אתר hendrive.co.il – התאמות הנגישות באתר ופרטי הקשר של רכז הנגישות.";

export const Route = createFileRoute("/accessibility")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: TITLE },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: AccessibilityPage,
});

function AccessibilityPage() {
  return (
    <LegalPage title="הצהרת נגישות">
      <p>
        אני, חן כחלון, רואה חשיבות רבה בכך שכל אדם, כולל אנשים עם מוגבלות, יוכל להשתמש באתר בנוחות ולקבל את כל
        המידע על שיעורי הנהיגה. האתר נבנה מתוך שאיפה לעמוד בהנחיות תקן ישראלי 5568 ברמה AA, המבוסס על הנחיות
        WCAG 2.0 הבינלאומיות, בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), תשע״ג-2013.
      </p>

      <h2>התאמות הנגישות באתר</h2>
      <ul>
        <li>תפריט נגישות (הכפתור הצף בפינת המסך) המאפשר הגדלה והקטנה של הטקסט, מצב ניגודיות גבוהה והדגשת קישורים.</li>
        <li>האתר מותאם לתצוגה בטלפון, בטאבלט ובמחשב.</li>
        <li>לתמונות יש טקסט חלופי המתאר את תוכנן.</li>
        <li>ניתן לנווט באתר באמצעות המקלדת, ולכפתורים יש תוויות המוקראות על ידי קוראי מסך.</li>
        <li>מבנה כותרות היררכי ושפה ברורה ופשוטה.</li>
        <li>האתר מוגדר בשפה העברית ובכיוון כתיבה מימין לשמאל.</li>
      </ul>

      <h2>הסדרי נגישות בשיעורים</h2>
      <p>
        השיעורים מתקיימים ברכב או על אופנוע, עם איסוף בתיאום מראש מאשקלון והסביבה, ולא במשרד קבלת קהל. אם יש לך
        צורך מיוחד, אשמח לשמוע ולבדוק יחד איך להתאים את השיעור עבורך, בכפוף לדרישות משרד התחבורה לכל דרגת רישיון.
      </p>

      <h2>אם נתקלת בבעיה</h2>
      <p>
        למרות המאמץ, ייתכן שחלקים מסוימים באתר עדיין אינם נגישים במלואם. אם נתקלת בבעיה או שיש לך הצעה לשיפור,
        אשמח שתפנה/י אליי ואטפל בפנייה בהקדם האפשרי.
      </p>

      <h2>רכז הנגישות</h2>
      <ul>
        <li>שם: חן כחלון</li>
        <li>טלפון: <a href="tel:0503250150">050-3250150</a></li>
        <li>דוא״ל: <a href="mailto:hen1kahlon@gmail.com">hen1kahlon@gmail.com</a></li>
      </ul>

      <p className="text-xs text-muted-foreground">הצהרה זו עודכנה בתאריך {LEGAL_UPDATED}.</p>
    </LegalPage>
  );
}
