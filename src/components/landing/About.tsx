import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import chenPortrait from "@/assets/chen-portrait.webp";
import { useSiteSettings } from "@/lib/site-settings";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const INTERVAL = 3000;

function AboutSlider() {
  const s = useSiteSettings();
  const slides = s.sections.about_slides.length > 0
    ? s.sections.about_slides.map((src, i) => ({ src, alt: `שיעור נהיגה עם חן כחלון ${i + 1}` }))
    : [{ src: chenPortrait, alt: "חן כחלון - מורה נהיגה לאופנוע ורכב באשקלון" }];

  const [current, setCurrent] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    setCurrent(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      if (!paused.current) setCurrent(i => (i + 1) % slides.length);
    }, INTERVAL);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <div
      className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-glow ring-glow-blue aspect-[3/4]"
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
    >
      {slides.map(({ src, alt }, i) => (
        <img
          key={src}
          src={src}
          alt={alt}
          loading={i === 0 ? "eager" : "lazy"}
          className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
        />
      ))}

      {/* bottom overlay */}
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 bg-gradient-to-t from-black/85 via-black/55 to-transparent">
        {/* dot indicators */}
        {slides.length > 1 && <div className="flex justify-center gap-1.5 mb-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`תמונה ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? 20 : 6,
                height: 6,
                background: i === current ? "#60a5fa" : "rgba(255,255,255,0.35)",
              }}
            />
          ))}
        </div>}
        {/* stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="rounded-xl bg-white/10 border border-white/15 p-2 sm:p-3 text-center">
            <div className="text-base sm:text-2xl font-bold gradient-text-blue leading-none">95%</div>
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
  );
}

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
        <div className="relative order-2 lg:order-1 flex justify-center">
          <div className="w-full lg:max-w-[75%]">
            <AboutSlider />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="gradient-text-blue font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">קצת עליי</p>
          <h2 className="text-display text-4xl sm:text-5xl mb-6">
            נעים מאוד —<br />
            <span className="gradient-text-blue">אני חן</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
            מורה נהיגה עם 5 שנות ניסיון ברכב ואופנועים באשקלון. אני מאמין שכל תלמיד צריך קצב משלו — לכן אני מתאים את השיעורים אליך, לא להיפך. האווירה תמיד צעירה, נעימה ובלי לחץ.
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
