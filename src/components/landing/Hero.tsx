import { ArrowLeft, Heart, Shield, GraduationCap, Users, Sparkles, MessageCircle, Phone, Trophy } from "lucide-react";
import { useSiteSettings, waUrl } from "@/lib/site-settings";
import heroImg from "@/assets/hero-driving.webp";
import heroImgMobile from "@/assets/hero-driving-mobile.webp";
import { scrollToLead } from "@/components/landing/Categories";

function Speedometer() {
  return (
    <svg viewBox="0 0 200 110" className="w-full h-full" aria-hidden>
      <defs>
        <linearGradient id="speedGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="oklch(0.62 0.20 255)" />
          <stop offset="0.6" stopColor="oklch(0.72 0.18 50)" />
          <stop offset="1" stopColor="oklch(0.65 0.25 30)" />
        </linearGradient>
      </defs>
      <path d="M10 100 A 90 90 0 0 1 190 100" fill="none" stroke="oklch(1 0 0 / 0.08)" strokeWidth="14" strokeLinecap="round" />
      <path d="M10 100 A 90 90 0 0 1 160 30" fill="none" stroke="url(#speedGrad)" strokeWidth="14" strokeLinecap="round" />
      {Array.from({ length: 9 }).map((_, i) => {
        const a = (Math.PI * i) / 8;
        const x1 = 100 - Math.cos(a) * 70;
        const y1 = 100 - Math.sin(a) * 70;
        const x2 = 100 - Math.cos(a) * 78;
        const y2 = 100 - Math.sin(a) * 78;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="oklch(1 0 0 / 0.4)" strokeWidth="2" />;
      })}
      <line x1="100" y1="100" x2="155" y2="42" stroke="oklch(0.72 0.18 50)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="100" cy="100" r="6" fill="oklch(0.72 0.18 50)" />
    </svg>
  );
}

export function Hero() {
  const s = useSiteSettings();
  const heroSrc = s.hero.hero_media_url || heroImgMobile;
  const heroSrcSet = s.hero.hero_media_url ? undefined : `${heroImgMobile} 768w, ${heroImg} 1920w`;
  return (
    <section id="top" className="stable-render-zone relative min-h-screen flex items-start lg:items-center pt-24 lg:pt-20 overflow-hidden">
      {/* premium background — matches site --background token for seamless flow */}
      <div className="absolute inset-0 -z-10 bg-background" />

      <div className="max-w-7xl mx-auto px-4 py-4 lg:py-16 grid lg:grid-cols-12 gap-6 lg:gap-12 items-center w-full">
        {/* image - mobile: top, desktop: right (visually first in RTL = right side) */}
        <div className="relative lg:col-span-7 order-1 lg:order-2">
          <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 bg-card">
            <img
              src={heroSrc}
              srcSet={heroSrcSet}
              sizes="(max-width: 768px) 100vw, 60vw"
              alt="חן כחלון – מורה נהיגה לאופנוע ורכב באשקלון בשיעור נהיגה"
              width={1920}
              height={1080}
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover"
            />
             <div className="absolute inset-0 bg-background/35" />
            {/* corner badge */}
             <div className="absolute top-4 right-4 bg-background border border-white/10 rounded-full px-3 py-1.5 text-xs font-bold flex items-center gap-1.5">
               <span className="w-2 h-2 rounded-full bg-green-400" />
              זמין השבוע
            </div>
            {/* speedometer accent */}
            <div className="absolute bottom-4 left-4 w-32 sm:w-44 opacity-90">
              <Speedometer />
            </div>
          </div>
          {/* floating stat card */}
          <div className="absolute -bottom-5 -right-2 sm:-right-5 bg-card rounded-2xl p-3 sm:p-4 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-blue grid place-items-center text-white">
              <Trophy size={20} />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-primary leading-none">{s.stats.floating}</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">{s.stats.floating_label}</div>
            </div>
          </div>
        </div>

        {/* text */}
        <div className="lg:col-span-5 order-2 lg:order-1 text-center lg:text-right">
          <div className="inline-flex items-center gap-2 rounded-full bg-card border border-white/10 px-4 py-1.5 mb-5 text-xs font-medium">
            <Sparkles size={13} className="text-accent" />
            <span>{s.hero.badge}</span>
          </div>
          <h1 className="text-display text-[2.5rem] sm:text-5xl lg:text-[3.75rem] mb-3">
            {s.hero.headline_line1}<br />
            <span className="text-primary">{s.hero.headline_highlight}</span>
          </h1>
          <p className="text-display text-2xl sm:text-3xl lg:text-4xl text-primary mb-5">
            {s.hero.tagline}
          </p>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 max-w-xl mx-auto lg:mx-0">
            {s.hero.description}
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
            <button type="button" onClick={scrollToLead} className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-bold text-primary-foreground">
              {s.hero.cta_primary}
              <ArrowLeft size={18} />
            </button>
            <a
              href={waUrl(s)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="וואטסאפ"
              className="relative z-10 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 font-bold text-white"
            >
              <MessageCircle size={18} aria-hidden="true" />
              <span className="text-white opacity-100">{s.buttons.whatsapp}</span>
            </a>
            <a href={`tel:${s.contact.phone}`} className="inline-flex items-center gap-2 rounded-full bg-card border border-white/10 px-5 py-3.5 font-bold">
              <Phone size={18} /> {s.buttons.call}
            </a>
          </div>

          {/* trust bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-xl mx-auto lg:mx-0">
            {[
              { icon: Heart, label: "יחס אישי" },
              { icon: Shield, label: "כלים חדשים" },
              { icon: GraduationCap, label: "ליווי עד טסט" },
              { icon: Users, label: "מאות תלמידים" },
            ].map((t) => (
              <div key={t.label} className="glass rounded-xl px-2 py-2.5 border border-white/5 flex items-center gap-2 text-[11px] sm:text-xs font-medium">
                <t.icon size={14} className="text-accent flex-shrink-0" />
                <span className="truncate">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
