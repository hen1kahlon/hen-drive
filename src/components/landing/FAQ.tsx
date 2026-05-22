import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const faqs = [
  {
    q: "כמה זמן לוקח להוציא רישיון?",
    a: "לרכב (דרגה B) משך הלימוד משתנה בהתאם לקצב ההתקדמות האישי של כל תלמיד, ובדרך כלל נע בין חודשיים ל-4 חודשים.\n\nלאופנוע (A / A1 / A2) התהליך יכול להיות מהיר יותר, ולעיתים ניתן לסיים גם בתוך שבוע — בהתאם לזמינות, ניסיון קודם וקצב ההתקדמות.",
  },
  {
    q: "באיזה אזורים מתקיימים השיעורים?",
    a: "לרכב (דרגה B) השיעורים מתקיימים באשקלון והסביבה, עם אפשרות לאיסוף מבית התלמיד בתיאום מראש ובמידת האפשר.\n\nלאופנוע (A / A1 / A2) הלימוד מתבצע במגרש ייעודי בתיאום מראש, כאשר התלמיד מגיע למגרש לצורך השיעורים והתרגול.",
  },
  { q: "האם אפשר ללמוד גם רכב וגם אופנוע?", a: "בהחלט! אני מלמד את שני התחומים ואפשר לשלב." },
  { q: "איך קובעים שיעור ראשון?", a: "פשוט שולחים הודעת וואטסאפ או מתקשרים — ונמצא יחד את הזמן הכי נוח לכם." },
  {
    q: "איזה דרגות אופנוע אפשר ללמוד?",
    a: "ניתן ללמוד את כל דרגות האופנוע:\n\nA – מגיל 21, עם שנה ותק על רישיון A1 ו-8 שיעורים מינימום.\n\nA1 ידני / אוטומט – מגיל 18, 15 שיעורים מינימום.\nלבעלי ותק של שנה על רישיון A2 נדרשים 8 שיעורים מינימום.\n\nA2 ידני / אוטומט – מגיל 16, 15 שיעורים מינימום.\nלבעלי רישיון דרגה B עם ותק של 3 שנים אין מינימום שיעורים ונדרש מבחן שליטה בלבד ללא מסלול.\n\nכל העלאת דרגה מחויבת במינימום 8 שיעורים.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const ref = useScrollReveal(0);
  return (
    <section id="faq" ref={ref as React.RefObject<HTMLElement>} className="py-7 sm:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="gradient-text-blue font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">שאלות נפוצות</p>
          <h2 className="text-display text-4xl sm:text-5xl">
            כל מה ש<span className="gradient-text-blue">חשוב לדעת</span>
          </h2>
        </div>
        <div className="grid gap-3 lg:grid-cols-2 lg:items-start">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl border border-white/5 overflow-hidden"
            >
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-right font-bold hover:bg-white/5 transition">
                <span>{f.q}</span>
                <ChevronDown size={20} className={`flex-shrink-0 transition-transform ${open === i ? "rotate-180 text-accent" : ""}`} />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-muted-foreground leading-relaxed whitespace-pre-line">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
