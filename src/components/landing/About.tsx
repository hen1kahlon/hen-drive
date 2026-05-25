import { Check } from "lucide-react";
import chenPortrait from "@/assets/chen-portrait.webp";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export function About() {
  const ref = useScrollReveal(0);
  const bullets = [
    "ותק של 5 שנים בתחום",
    "לימוד רכב + אופנועים",
    "כלים חדשים ומתקדמים",
    "יחס אישי לכל תלמיד",
    "אווירה צעירה וסבלנית",
    "הכנה אמיתית לטסט",
  ];
  return (
    <section id="about" ref={ref} className="py-7 sm:py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 grid-bg opacity-40" />
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-96 h-96 rounded-full bg-[oklch(0.62_0.20_255_/_0.12)] blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
        <div className="relative order-2 lg:order-1">
          <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-glow ring-glow-blue aspect-[3/4]">
            <img src={chenPortrait} alt="חן כחלון - מורה נהיגה עם רכב ואופנוע באשקלון" loading="lazy" width={1100} height={1100} className="absolute inset-0 w-full h-full object-cover object-center" />
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 bg-gradient-to-t from-black/85 via-black/55 to-transparent">
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="rounded-xl bg-white/10 border border-white/15 p-2 sm:p-3 text-center">
                  <div className="text-base sm:text-2xl font-bold gradient-text-blue leading-none">98%</div>
                  <div className="text-[10px] sm:text-xs text-white/80 mt-1">הצלחה</div>
                </div>
                <div className="rounded-xl bg-white/10 border border-white/15 p-2 sm:p-3 text-center">
                  <div className="text-base sm:text-2xl font-bold gradient-text-blue leading-none">5</div>
                  <div className="text-[10px] sm:text-xs text-white/80 mt-1">שנות ותק</div>
                </div>
                <div className="rounded-xl bg-white/10 border border-white/15 p-2 sm:p-3 text-center">
                  <div className="text-base sm:text-2xl font-bold gradient-text-blue leading-none">350+</div>
                  <div className="text-[10px] sm:text-xs text-white/80 mt-1">תלמידים</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="gradient-text-blue font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">קצת עליי</p>
          <h2 className="text-display text-4xl sm:text-5xl mb-6">
            נעים מאוד,<br />
            <span className="gradient-text-blue">חן כחלון</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
            מורה נהיגה בעל ותק של 5 שנים בתחום הרכב והאופנועים. אני מאמין בלימוד נהיגה בגישה אישית, רגועה ומקצועית, עם התאמה מלאה לקצב של כל תלמיד. השיעורים מתבצעים על כלים חדשים, נוחים ובטיחותיים, באווירה צעירה ומכבדת — עד שמגיעים מוכנים ובטוחים לטסט.
          </p>
          <ul className="grid sm:grid-cols-2 gap-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-center gap-3 text-sm">
                <span className="w-7 h-7 rounded-lg bg-gradient-blue grid place-items-center text-white flex-shrink-0 shadow-glow">
                  <Check size={14} strokeWidth={3} />
                </span>
                <span className="font-medium">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
