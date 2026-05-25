import { Heart, Smile, Shield, GraduationCap, Calendar, Trophy } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const reasons = [
  { icon: Heart, title: "יחס אישי וסבלני", desc: "כל תלמיד מקבל התייחסות מלאה.", color: "blue" },
  { icon: Smile, title: "אווירה צעירה", desc: "שיעור שמרגיש כמו זמן עם חבר טוב.", color: "blue" },
  { icon: Shield, title: "כלים חדשים", desc: "רכבים ואופנועים מהדור החדש.", color: "blue" },
  { icon: GraduationCap, title: "ליווי מקצועי", desc: "מהשיעור הראשון ועד ההצלחה.", color: "blue" },
  { icon: Calendar, title: "זמינות גמישה", desc: "קביעת שיעורים לפי הזמן שלך.", color: "blue" },
  { icon: Trophy, title: "אחוזי הצלחה", desc: "תוצאות אמיתיות שמדברות בעד עצמן.", color: "blue" },
];

export function WhyMe() {
  const ref = useScrollReveal(0);
  return (
    <section id="why" ref={ref} className="py-7 sm:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-5 sm:mb-14">
          <p className="gradient-text-blue font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">היתרונות שלי</p>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl">
            למה לבחור <span className="gradient-text-blue">בחן</span>?
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="bg-card p-6 border border-white/5 hover:border-white/15 transition-all duration-200 relative overflow-hidden hover:-translate-y-1"
              style={{ borderRadius: "16px" }}
            >
              <div className="relative">
                <div className={`w-12 h-12 rounded-2xl border ${r.color === "blue" ? "border-[oklch(0.62_0.20_255_/_0.3)] bg-[oklch(0.62_0.20_255_/_0.1)] text-[oklch(0.7_0.18_255)]" : "border-[oklch(0.62_0.20_255_/_0.3)] bg-[oklch(0.62_0.20_255_/_0.1)] text-[oklch(0.7_0.18_255)]"} grid place-items-center mb-4`}>
                  <r.icon size={22} />
                </div>
                <h3 className="text-lg font-black mb-1.5">{r.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
