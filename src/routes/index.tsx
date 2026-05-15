import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import {
  Phone, MessageCircle, Instagram, Facebook, Mail, Star, Car, Bike,
  Users, Award, Clock, Shield, Sparkles, MapPin, ChevronDown, Check,
  ArrowLeft, Zap, Heart, GraduationCap, Send, Trophy, Calendar, UserCheck,
  Smile, Upload, Navigation, Play, Image as ImageIcon, Video as VideoIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteSettingsProvider, useSiteSettings, waUrl, DEFAULT_SETTINGS } from "@/lib/site-settings";
import heroImg from "@/assets/hero-driving.webp";
import heroImgMobile from "@/assets/hero-driving-mobile.webp";
import portraitImg from "@/assets/instructor-portrait.webp";
import portraitImgMobile from "@/assets/instructor-portrait-mobile.webp";
import vehSedan from "@/assets/vehicle-sedan.webp";
import vehBikeA2 from "@/assets/vehicle-bike-a2.webp";
import vehScooter from "@/assets/vehicle-scooter.webp";
import vehBikeA from "@/assets/vehicle-bike-a.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    links: [
      {
        rel: "preload",
        as: "image",
        href: heroImgMobile,
        imagesrcset: `${heroImgMobile} 768w, ${heroImg} 1920w`,
        imagesizes: "(max-width: 768px) 100vw, 60vw",
        fetchPriority: "high",
      } as any,
    ],
    meta: [
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
    ],
  }),
  component: LandingPage,
});

// Live runtime values mirroring CMS settings (see SiteSettingsRuntime below).
// They are mutated when site_settings load and re-render is forced.
let PHONE = DEFAULT_SETTINGS.contact.phone;
let PHONE_DISPLAY = DEFAULT_SETTINGS.contact.phone_display;
let PHONE_INTL = DEFAULT_SETTINGS.contact.phone_intl;
let WA_DEFAULT_MSG = DEFAULT_SETTINGS.contact.whatsapp_message;
let WA_URL = `https://wa.me/${PHONE_INTL}?text=${encodeURIComponent(WA_DEFAULT_MSG)}`;
let INSTAGRAM = DEFAULT_SETTINGS.social.instagram;
let FACEBOOK = DEFAULT_SETTINGS.social.facebook;
let TIKTOK = DEFAULT_SETTINGS.social.tiktok;
let EMAIL = DEFAULT_SETTINGS.contact.email;
let TRAINING_MAP_URL = DEFAULT_SETTINGS.contact.training_map_url;

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.41a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.34Z"/>
    </svg>
  );
}

function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const dim = size === "sm" ? "w-9 h-9 text-sm" : "w-11 h-11 text-base";
  return (
    <div className="flex items-center gap-2.5">
      <div className={`${dim} rounded-xl bg-gradient-orange grid place-items-center text-white font-black shadow-glow-orange`}>חכ</div>
      <div className="leading-tight">
        <div className="font-black text-base">חן כחלון</div>
        <div className="text-[10px] text-muted-foreground -mt-0.5">מורה נהיגה</div>
      </div>
    </div>
  );
}

function Nav() {
  const [openMenu, setOpenMenu] = useState(false);
  const links = [
    { href: "#categories", label: "דרגות" },
    { href: "#about", label: "עליי" },
    { href: "#why", label: "למה אני" },
    { href: "#reviews", label: "ביקורות" },
    { href: "#faq", label: "שאלות" },
    { href: "#lead", label: "צור קשר" },
  ];
  return (
    <header className="fixed top-0 inset-x-0 z-50 glass-strong border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href={`tel:${PHONE}`} className="hidden md:inline-flex items-center gap-2 rounded-full bg-gradient-orange px-4 py-2 text-sm font-bold text-white shadow-glow-orange hover:scale-105 transition">
          <Phone size={15} /> {PHONE_DISPLAY}
        </a>
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-foreground transition relative">
              {l.label}
            </a>
          ))}
        </nav>
        <a href="#top"><Logo /></a>
        {/* mobile */}
        <button onClick={() => setOpenMenu(!openMenu)} className="md:hidden w-10 h-10 grid place-items-center rounded-lg border border-white/10" aria-label="תפריט">
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-5 bg-foreground transition ${openMenu ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-foreground transition ${openMenu ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-foreground transition ${openMenu ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </div>
      {openMenu && (
        <div className="md:hidden glass-strong border-t border-white/5 px-4 py-4 space-y-1">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpenMenu(false)} className="block py-2 px-3 rounded-lg text-sm font-medium hover:bg-white/5">
              {l.label}
            </a>
          ))}
          <a href={`tel:${PHONE}`} className="mt-2 flex items-center justify-center gap-2 rounded-full bg-gradient-orange px-4 py-2.5 text-sm font-bold text-white">
            <Phone size={14} /> {PHONE_DISPLAY}
          </a>
          <a href="/admin" onClick={() => setOpenMenu(false)} className="mt-2 block text-center rounded-lg border border-white/10 bg-white/5 py-2 text-sm font-semibold text-foreground hover:bg-white/10" aria-label="כניסת מנהל">
            כניסת מנהל
          </a>
        </div>
      )}
    </header>
  );
}

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

function Hero() {
  const s = useSiteSettings();
  const heroSrc = s.hero.hero_media_url || heroImgMobile;
  const heroSrcSet = s.hero.hero_media_url ? undefined : `${heroImgMobile} 768w, ${heroImg} 1920w`;
  return (
    <section id="top" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* glow background */}
      <div className="absolute inset-0 -z-10 grid-bg">
        <div className="absolute -top-32 -right-32 w-[40rem] h-[40rem] rounded-full bg-[oklch(0.62_0.20_255_/_0.25)] blur-[120px] animate-float-slow" />
        <div className="absolute -bottom-40 -left-32 w-[40rem] h-[40rem] rounded-full bg-[oklch(0.72_0.18_50_/_0.28)] blur-[120px] animate-float-slow" style={{ animationDelay: "3s" }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 lg:py-16 grid lg:grid-cols-12 gap-6 lg:gap-12 items-center w-full">
        {/* image - mobile: top, desktop: right (visually first in RTL = right side) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative lg:col-span-7 order-1 lg:order-2"
        >
          <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-white/10 shadow-glow">
            <img
              src={heroSrc}
              srcSet={heroSrcSet}
              sizes="(max-width: 768px) 100vw, 60vw"
              alt="חן כחלון בשיעור נהיגה עם תלמידה"
              width={1920}
              height={1080}
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/30" />
            {/* corner badge */}
            <div className="absolute top-4 right-4 glass-strong rounded-full px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              זמין השבוע
            </div>
            {/* speedometer accent */}
            <div className="absolute bottom-4 left-4 w-32 sm:w-44 opacity-90">
              <Speedometer />
            </div>
          </div>
          {/* floating stat card */}
          <div className="absolute -bottom-5 -right-2 sm:-right-5 glass-strong rounded-2xl p-3 sm:p-4 border border-white/10 shadow-card flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-blue grid place-items-center text-white">
              <Trophy size={20} />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black gradient-text-orange leading-none">{s.stats.floating}</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">{s.stats.floating_label}</div>
            </div>
          </div>
        </motion.div>

        {/* text */}
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="lg:col-span-5 order-2 lg:order-1 text-center lg:text-right">
          <div className="inline-flex items-center gap-2 rounded-full glass-strong border border-white/10 px-4 py-1.5 mb-5 text-xs font-medium">
            <Sparkles size={13} className="text-accent" />
            <span>{s.hero.badge}</span>
          </div>
          <h1 className="text-display text-[2.5rem] sm:text-5xl lg:text-[3.75rem] mb-3">
            {s.hero.headline_line1}<br />
            <span className="gradient-text-blue">{s.hero.headline_highlight}</span>
          </h1>
          <p className="text-display text-2xl sm:text-3xl lg:text-4xl gradient-text-orange mb-5">
            {s.hero.tagline}
          </p>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 max-w-xl mx-auto lg:mx-0">
            {s.hero.description}
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
            <button type="button" onClick={scrollToLead} className="group inline-flex items-center gap-2 rounded-full bg-gradient-orange px-6 py-3.5 font-bold text-white shadow-glow-orange hover:scale-105 transition">
              {s.hero.cta_primary}
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition" />
            </button>
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="וואטסאפ"
              className="relative z-10 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 font-bold text-white hover:scale-105 transition shadow-card"
            >
              <MessageCircle size={18} aria-hidden="true" />
              <span className="text-white opacity-100">{s.buttons.whatsapp}</span>
            </a>
            <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 rounded-full glass-strong border border-white/10 px-5 py-3.5 font-bold hover:bg-white/5 transition">
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
        </motion.div>
      </div>
    </section>
  );
}

const categories = [
  { id: "B", title: "רכב אוטומט", subtitle: "דרגה B", desc: "רכב פרטי אוטומט — הדרגה הפופולרית והמבוקשת ביותר.", img: vehSedan, icon: Car, color: "blue" as const, interest: "רכב אוטומט דרגה B" },
  { id: "A2", title: "אופנוע מתחילים", subtitle: "דרגה A2", desc: "עד 14.7 כ״ס (125 סמ״ק) — רישיון אופנוע למתחילים, הדרך המושלמת להתחיל.", img: vehScooter, icon: Zap, color: "blue" as const, interest: "אופנוע A2" },
  { id: "A1", title: "אופנוע בינוני", subtitle: "דרגה A1", desc: "עד 47 כ״ס — רישיון אופנוע בדרגת ביניים, יותר כוח ויותר חופש.", img: vehBikeA2, icon: Bike, color: "orange" as const, interest: "אופנוע A1" },
  { id: "A", title: "אופנוע ללא הגבלה", subtitle: "דרגה A", desc: "ללא הגבלת כ״ס — רישיון אופנוע מלא לכל סוגי האופנועים בכביש.", img: vehBikeA, icon: Bike, color: "orange" as const, interest: "אופנוע A" },
];

function scrollToLead() {
  const el = document.getElementById("lead");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function selectInterestAndScroll(interest: string) {
  window.dispatchEvent(new CustomEvent("lead:set-interest", { detail: interest }));
  // small delay so the form state updates before scrolling
  setTimeout(scrollToLead, 30);
}

function Categories() {
  return (
    <section id="categories" className="py-7 sm:py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-5 sm:mb-14">
          <p className="gradient-text-orange font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">בחרו את הדרגה</p>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl">
            על מה <span className="gradient-text-orange">תרצו ללמוד</span>?
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {categories.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative bg-card rounded-3xl p-5 border border-white/5 hover:border-white/15 transition-all hover:-translate-y-1 overflow-hidden"
            >
              {/* glow on hover */}
              <div className={`absolute -top-20 ${c.color === "orange" ? "right-1/2 bg-[oklch(0.72_0.18_50_/_0.4)]" : "left-1/2 bg-[oklch(0.62_0.20_255_/_0.4)]"} w-40 h-40 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity`} />

              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-black leading-tight">{c.title}</h3>
                    <p className={`text-sm font-bold ${c.color === "orange" ? "gradient-text-orange" : "gradient-text-blue"}`}>{c.subtitle}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl ${c.color === "orange" ? "bg-[oklch(0.72_0.18_50_/_0.15)] text-[oklch(0.78_0.18_55)]" : "bg-[oklch(0.62_0.20_255_/_0.15)] text-[oklch(0.7_0.18_255)]"} grid place-items-center border ${c.color === "orange" ? "border-[oklch(0.72_0.18_50_/_0.3)]" : "border-[oklch(0.62_0.20_255_/_0.3)]"}`}>
                    <c.icon size={18} />
                  </div>
                </div>

                <div className="aspect-[4/3] grid place-items-center my-3 group-hover:scale-105 transition-transform duration-500">
                  <img src={c.img} alt={`${c.title} ${c.subtitle}`} loading="lazy" width={400} height={300} className="w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]" />
                </div>

                <p className="text-sm text-muted-foreground mb-4 leading-relaxed min-h-[40px]">{c.desc}</p>

                <button type="button" onClick={() => selectInterestAndScroll(c.interest)} className="block w-full text-center rounded-xl border border-white/10 py-2.5 text-sm font-bold hover:bg-gradient-orange hover:border-transparent hover:text-white transition-all">
                  אני מעוניין/ת בפרטים
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  const bullets = [
    "ותק של 5 שנים בתחום",
    "לימוד רכב + אופנועים",
    "כלים חדשים ומתקדמים",
    "יחס אישי לכל תלמיד",
    "אווירה צעירה וסבלנית",
    "הכנה אמיתית לטסט",
  ];
  return (
    <section id="about" className="py-7 sm:py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 grid-bg opacity-40" />
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-96 h-96 rounded-full bg-[oklch(0.72_0.18_50_/_0.12)] blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <motion.div {...fadeUp} className="relative order-2 lg:order-1">
          <div className="aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 shadow-glow ring-glow-blue">
            <img src={portraitImgMobile} srcSet={`${portraitImgMobile} 600w, ${portraitImg} 1200w`} sizes="(max-width: 768px) 100vw, 50vw" alt="חן כחלון - מורה נהיגה" loading="lazy" width={800} height={1000} className="w-full h-full object-cover" />
          </div>
          {/* stats overlay */}
          <div className="absolute -bottom-6 inset-x-4 sm:left-auto sm:right-4 sm:max-w-[20rem] glass-strong rounded-2xl p-4 border border-white/10 shadow-card">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-2xl font-black gradient-text-orange">350+</div>
                <div className="text-[10px] text-muted-foreground">תלמידים</div>
              </div>
              <div className="border-x border-white/10">
                <div className="text-2xl font-black gradient-text-blue">5</div>
                <div className="text-[10px] text-muted-foreground">שנות ותק</div>
              </div>
              <div>
                <div className="text-2xl font-black gradient-text-orange">98%</div>
                <div className="text-[10px] text-muted-foreground">הצלחה</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="order-1 lg:order-2">
          <p className="gradient-text-blue font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">קצת עליי</p>
          <h2 className="text-display text-4xl sm:text-5xl mb-6">
            נעים מאוד,<br />
            <span className="gradient-text-orange">חן כחלון</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
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
        </motion.div>
      </div>
    </section>
  );
}

const reasons = [
  { icon: Heart, title: "יחס אישי וסבלני", desc: "כל תלמיד מקבל התייחסות מלאה.", color: "orange" },
  { icon: Smile, title: "אווירה צעירה", desc: "שיעור שמרגיש כמו זמן עם חבר טוב.", color: "blue" },
  { icon: Shield, title: "כלים חדשים", desc: "רכבים ואופנועים מהדור החדש.", color: "orange" },
  { icon: GraduationCap, title: "ליווי מקצועי", desc: "מהשיעור הראשון ועד ההצלחה.", color: "blue" },
  { icon: Calendar, title: "זמינות גמישה", desc: "קביעת שיעורים לפי הזמן שלך.", color: "orange" },
  { icon: Trophy, title: "אחוזי הצלחה", desc: "תוצאות אמיתיות שמדברות בעד עצמן.", color: "blue" },
];

function WhyMe() {
  return (
    <section id="why" className="py-7 sm:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-5 sm:mb-14">
          <p className="gradient-text-orange font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">היתרונות שלי</p>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl">
            למה לבחור <span className="gradient-text-blue">בחן</span>?
          </h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group bg-card rounded-3xl p-6 border border-white/5 hover:border-white/15 transition-all hover:-translate-y-1 relative overflow-hidden"
            >
              <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${r.color === "orange" ? "bg-[oklch(0.72_0.18_50_/_0.3)]" : "bg-[oklch(0.62_0.20_255_/_0.3)]"} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative">
                <div className={`w-12 h-12 rounded-2xl border ${r.color === "orange" ? "border-[oklch(0.72_0.18_50_/_0.3)] bg-[oklch(0.72_0.18_50_/_0.1)] text-[oklch(0.78_0.18_55)]" : "border-[oklch(0.62_0.20_255_/_0.3)] bg-[oklch(0.62_0.20_255_/_0.1)] text-[oklch(0.7_0.18_255)]"} grid place-items-center mb-4`}>
                  <r.icon size={22} />
                </div>
                <h3 className="text-lg font-black mb-1.5">{r.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const fallbackReviews = [
  { id: "f1", full_name: "ליאור מ׳", content: "חן הכי סבלני בעולם, עברתי טסט ראשון! ממליץ בחום על המקצועיות והאווירה.", rating: 5, license_type: "B", image_url: null },
  { id: "f2", full_name: "נועה ש׳", content: "אווירה כיפית ומקצועית, הרגשתי בטוחה כל הדרך. מורה מדהים ומסור.", rating: 5, license_type: "B", image_url: null },
  { id: "f3", full_name: "יובל א׳", content: "למדתי אופנוע אצל חן — חוויה מטורפת. רישיון ביד מהפעם הראשונה!", rating: 5, license_type: "A2", image_url: null },
  { id: "f4", full_name: "דניאל מ׳", content: "מורה צעיר, מקצועי וסבלני. ממליץ בחום לכל מי שמחפש מורה רציני.", rating: 5, license_type: "B", image_url: null },
];

type PublicReview = { id: string; full_name: string; content: string; rating: number; license_type: string; image_url: string | null };

function Reviews() {
  const [reviews, setReviews] = useState<PublicReview[]>(fallbackReviews);
  useEffect(() => {
    supabase
      .from("reviews")
      .select("id, full_name, content, rating, license_type, image_url")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(12)
      .then(({ data }) => {
        if (data && data.length > 0) setReviews(data as PublicReview[]);
      });
  }, []);
  return (
    <section id="reviews" className="py-7 sm:py-24 px-4 relative">
      <div className="absolute inset-0 -z-10 grid-bg opacity-30" />
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-5 sm:mb-14">
          <p className="gradient-text-orange font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">המלצות תלמידים</p>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl">
            מה <span className="gradient-text-orange">אומרים עליי</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card rounded-3xl p-5 border border-white/5 hover:border-white/15 transition"
            >
              <div className="flex gap-0.5 mb-3">
                {[...Array(r.rating)].map((_, j) => <Star key={j} size={15} className="fill-[oklch(0.78_0.18_55)] text-[oklch(0.78_0.18_55)]" />)}
              </div>
              {r.image_url && <img src={r.image_url} alt="" className="rounded-xl mb-3 w-full h-32 object-cover" />}
              <p className="text-sm text-foreground/90 leading-relaxed mb-5 min-h-[80px]">"{r.content}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-blue grid place-items-center text-white font-black text-sm">
                  {r.full_name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm">{r.full_name}</p>
                  <p className="text-[11px] text-muted-foreground">דרגה {r.license_type}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <SubmitReview />
      </div>
    </section>
  );
}

function SubmitReview() {
  const [form, setForm] = useState({ full_name: "", rating: 5, license_type: "B", content: "" });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.full_name.trim().length < 1 || form.content.trim().length < 1) {
      toast.error("נא למלא שם וטקסט ביקורת");
      return;
    }
    setSubmitting(true);
    try {
      let image_url: string | null = null;
      if (file) {
        if (file.size > 5 * 1024 * 1024) throw new Error("התמונה גדולה מדי (מקס׳ 5MB)");
        const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const path = `submissions/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("review-images").upload(path, file, { contentType: file.type });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("review-images").getPublicUrl(path);
        image_url = data.publicUrl;
      }
      const { error } = await supabase.from("reviews").insert({
        full_name: form.full_name.trim(),
        rating: form.rating,
        license_type: form.license_type,
        content: form.content.trim(),
        image_url,
      });
      if (error) throw error;
      setDone(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "שגיאה בשליחה");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div {...fadeUp} className="mt-6 sm:mt-16 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <p className="gradient-text-orange font-bold text-xs tracking-[0.2em] uppercase mb-2">שתפו את החוויה</p>
        <h3 className="text-display text-3xl sm:text-4xl">השאירו ביקורת</h3>
      </div>

      {done ? (
        <div className="bg-card border border-green-500/20 rounded-3xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-green-500/20 grid place-items-center mx-auto mb-4">
            <Check className="text-green-300" size={28} />
          </div>
          <p className="text-lg font-bold mb-2">תודה!</p>
          <p className="text-sm text-muted-foreground">הביקורת נשלחה ותפורסם לאחר אישור.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="bg-card border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
          <div>
            <label className="text-xs font-semibold mb-1.5 block">שם מלא</label>
            <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} maxLength={100}
              className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/30 outline-none" />
          </div>

          <div>
            <label className="text-xs font-semibold mb-2 block">דירוג</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map((n) => (
                <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })}
                  className="p-1 hover:scale-110 transition" aria-label={`${n} כוכבים`}>
                  <Star size={28} className={n <= form.rating ? "fill-[oklch(0.78_0.18_55)] text-[oklch(0.78_0.18_55)]" : "text-white/20"} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold mb-1.5 block">סוג לימוד</label>
            <select value={form.license_type} onChange={(e) => setForm({ ...form, license_type: e.target.value })}
              className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/30 outline-none">
              <option value="B">רכב B</option>
              <option value="A2">אופנוע A2</option>
              <option value="A1">אופנוע A1</option>
              <option value="A">אופנוע A</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold mb-1.5 block">טקסט הביקורת</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} maxLength={2000} rows={5}
              className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/30 outline-none resize-none" />
          </div>

          <div>
            <label className="text-xs font-semibold mb-1.5 block">תמונה (אופציונלי)</label>
            <label className="flex items-center gap-3 bg-background border border-white/10 border-dashed rounded-xl px-4 py-3 text-sm cursor-pointer hover:border-white/30">
              <Upload size={16} className="text-muted-foreground" />
              <span className="text-muted-foreground truncate">{file ? file.name : "בחר תמונה (עד 5MB)"}</span>
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="hidden" />
            </label>
          </div>

          <button type="submit" disabled={submitting}
            className="w-full bg-gradient-orange text-white font-bold rounded-xl py-3.5 shadow-glow-orange disabled:opacity-50 flex items-center justify-center gap-2">
            <Send size={16} />
            {submitting ? "שולח..." : "שלח ביקורת"}
          </button>
          <p className="text-[11px] text-muted-foreground text-center">הביקורת תפורסם לאחר אישור</p>
        </form>
      )}
    </motion.div>
  );
}

function LeadForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", interest: "רכב אוטומט דרגה B", area: "אשקלון", notes: "" });

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (typeof detail === "string") {
        setForm((prev) => ({ ...prev, interest: detail }));
      }
    };
    window.addEventListener("lead:set-interest", handler as EventListener);
    return () => window.removeEventListener("lead:set-interest", handler as EventListener);
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("נא למלא שם וטלפון");
      return;
    }
    const lines = [
      `שם: ${form.name}`,
      `טלפון: ${form.phone}`,
      `מסלול מבוקש: ${form.interest}`,
      `אזור מגורים: ${form.area}`,
      `הערות: ${form.notes || "—"}`,
      ``,
      `נשלח מהאתר של חן כחלון`,
    ];
    const subject = encodeURIComponent("ליד חדש מהאתר - " + form.name);
    const body = encodeURIComponent(lines.join("\n"));

    // 1) Open WhatsApp with prefilled lead details to Hen
    const waText = encodeURIComponent(
      [
        `היי חן! 👋`,
        `מילאתי טופס באתר ואשמח שתחזור אליי:`,
        ``,
        `🙋 שם: ${form.name}`,
        `📱 טלפון: ${form.phone}`,
        `🚗 מסלול: ${form.interest}`,
        `📍 אזור: ${form.area}`,
        form.notes ? `📝 הערות: ${form.notes}` : ``,
      ].filter(Boolean).join("\n")
    );
    window.open(`https://wa.me/${PHONE_INTL}?text=${waText}`, "_blank");

    // 2) Also fire mailto so Hen receives an email copy
    setTimeout(() => {
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    }, 400);
    setSubmitted(true);
    toast.success("תודה! הפרטים התקבלו, חן יחזור אליך בהקדם.");
  };

  const promises = [
    { icon: Zap, title: "חזרה מהירה", desc: "תוך שעות בודדות" },
    { icon: Shield, title: "ללא התחייבות", desc: "השארת פרטים ללא עלות" },
    { icon: UserCheck, title: "התאמה אישית", desc: "נמצא ביחד את המסלול" },
  ];

  return (
    <section id="lead" className="py-7 sm:py-24 px-4 relative overflow-hidden">
      <div className="absolute -top-40 left-0 w-[30rem] h-[30rem] rounded-full bg-[oklch(0.62_0.20_255_/_0.18)] blur-[120px] -z-10" />
      <div className="absolute -bottom-40 right-0 w-[30rem] h-[30rem] rounded-full bg-[oklch(0.72_0.18_50_/_0.18)] blur-[120px] -z-10" />

      <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
        {/* left: areas + promises */}
        <motion.div {...fadeUp} className="lg:col-span-2">
          <div className="inline-flex items-center gap-2 rounded-full glass border border-white/10 px-4 py-1.5 mb-4">
            <MapPin size={14} className="text-accent" />
            <span className="text-xs font-medium">אזורי לימוד</span>
          </div>
          <h2 className="text-display text-4xl sm:text-5xl mb-3">
            <span className="gradient-text-blue">אשקלון</span><br />והסביבה
          </h2>
          <p className="text-muted-foreground mb-6">שיעורים בכל אזור אשקלון והסביבה בהתאמה מלאה לזמן ולמיקום שלך.</p>

          <div className="space-y-3">
            {promises.map((p) => (
              <div key={p.title} className="flex items-center gap-4 p-3 rounded-2xl glass border border-white/10">
                <div className="w-11 h-11 rounded-xl bg-gradient-orange grid place-items-center text-white flex-shrink-0">
                  <p.icon size={20} />
                </div>
                <div>
                  <div className="font-bold text-sm">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* right: form */}
        <motion.div {...fadeUp} className="lg:col-span-3 glass-strong rounded-[2rem] p-6 sm:p-8 border border-white/10 shadow-card relative">
          <div className="mb-6">
            <p className="gradient-text-orange font-bold text-xs tracking-[0.2em] uppercase mb-2">השאירו פרטים</p>
            <h3 className="text-2xl sm:text-3xl font-black">חן יחזור אליך <span className="gradient-text-orange">בהקדם</span></h3>
          </div>

          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-orange grid place-items-center text-white shadow-glow-orange">
                <Check size={32} strokeWidth={3} />
              </div>
              <h3 className="text-2xl font-black mb-2">תודה!</h3>
              <p className="text-muted-foreground mb-6">הפרטים התקבלו, חן יחזור אליך בהקדם.</p>
              <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-bold text-white hover:scale-105 transition">
                <MessageCircle size={18} /> שלחו גם בוואטסאפ
              </a>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="שם מלא *">
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={60}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent transition" placeholder="ישראל ישראלי" />
                </Field>
                <Field label="טלפון *">
                  <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={20}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent transition" placeholder="050-0000000" />
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="מעוניין/ת ללמוד">
                  <select value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent transition">
                    <option>רכב אוטומט דרגה B</option>
                    <option>אופנוע A2</option>
                    <option>אופנוע A1</option>
                    <option>אופנוע A</option>
                  </select>
                </Field>
                <Field label="אזור מגורים">
                  <input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} maxLength={60}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent transition" placeholder="אשקלון" />
                </Field>
              </div>
              <Field label="הערות נוספות">
                <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} maxLength={500}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent transition resize-none" placeholder="כל מה שחשוב שנדע..." />
              </Field>
              <button type="submit" className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-orange px-6 py-4 font-bold text-white shadow-glow-orange hover:scale-[1.01] transition">
                <Send size={18} /> שלח/י פרטים
              </button>
              <p className="text-[11px] text-center text-muted-foreground">בלחיצה על שליחה את/ה מאשר/ת שנחזור אליך בקרוב</p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold mb-2 text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

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

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-7 sm:py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12">
          <p className="gradient-text-blue font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">שאלות נפוצות</p>
          <h2 className="text-display text-4xl sm:text-5xl">
            כל מה ש<span className="gradient-text-orange">חשוב לדעת</span>
          </h2>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-card rounded-2xl border border-white/5 overflow-hidden"
            >
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-right font-bold hover:bg-white/5 transition">
                <span>{f.q}</span>
                <ChevronDown size={20} className={`flex-shrink-0 transition-transform ${open === i ? "rotate-180 text-accent" : ""}`} />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-muted-foreground leading-relaxed whitespace-pre-line">{f.a}</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-7 sm:py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[oklch(0.62_0.20_255_/_0.3)] blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[oklch(0.72_0.18_50_/_0.3)] blur-3xl animate-float-slow" style={{ animationDelay: "2s" }} />
      </div>
      <motion.div {...fadeUp} className="max-w-4xl mx-auto text-center glass-strong rounded-[2.5rem] border border-white/10 p-8 sm:p-14 shadow-card">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-orange px-4 py-1.5 mb-6 text-xs font-bold text-white">
          <Sparkles size={14} /> בואו נתחיל
        </div>
        <h2 className="text-display text-4xl sm:text-6xl mb-4">
          מתחילים את הדרך<br />
          <span className="gradient-text-orange">לרישיון</span>?
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">דבר אחד מפריד בינך לבין הרישיון — ההחלטה שלך</p>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-4 font-bold text-white hover:scale-105 transition shadow-card">
            <MessageCircle size={20} /> שלחו הודעה בוואטסאפ
          </a>
          <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 rounded-full bg-gradient-orange px-7 py-4 font-bold text-white hover:scale-105 transition shadow-glow-orange">
            <Phone size={20} /> התקשרו עכשיו
          </a>
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 sm:py-12 px-4 pb-28 md:pb-12 relative">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 sm:gap-8 text-sm">
        <div>
          <Logo />
          <p className="text-muted-foreground mt-4 max-w-xs">מורה נהיגה לרכב ואופנועים — אשקלון והסביבה. מלווה אותך עד הקריאה ״עברת״.</p>
        </div>
        <div>
          <h4 className="font-black mb-4 text-base">צור קשר</h4>
          <ul className="space-y-3 text-muted-foreground">
            <li><a href={`tel:${PHONE}`} className="hover:text-foreground inline-flex items-center gap-2"><Phone size={14} className="text-accent" /> {PHONE_DISPLAY}</a></li>
            <li><a href={`mailto:${EMAIL}`} className="hover:text-foreground inline-flex items-center gap-2"><Mail size={14} className="text-accent" /> {EMAIL}</a></li>
            <li className="inline-flex items-center gap-2"><MapPin size={14} className="text-accent" /> אשקלון והסביבה</li>
          </ul>
        </div>
        <div>
          <h4 className="font-black mb-4 text-base">עקבו אחריי</h4>
          <div className="flex gap-3">
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-11 h-11 rounded-full glass-strong border border-white/10 grid place-items-center hover:bg-gradient-orange hover:border-transparent hover:text-white transition">
              <Instagram size={18} />
            </a>
            <a href={FACEBOOK} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-11 h-11 rounded-full glass-strong border border-white/10 grid place-items-center hover:bg-gradient-blue hover:border-transparent hover:text-white transition">
              <Facebook size={18} />
            </a>
            <a href={TIKTOK} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-11 h-11 rounded-full glass-strong border border-white/10 grid place-items-center hover:bg-foreground hover:text-background hover:border-transparent transition">
              <TikTokIcon className="w-[18px] h-[18px]" />
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-5 border-t border-white/5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} חן כחלון - מורה נהיגה. כל הזכויות שמורות.
      </div>
    </footer>
  );
}

function MobileBar() {
  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-30 glass-strong border-t border-white/10"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="grid grid-cols-4 gap-1 p-2 max-w-screen-sm mx-auto">
        <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 py-2 rounded-xl bg-[#25D366] text-white shadow-[0_8px_20px_-8px_rgba(37,211,102,0.8)]">
          <MessageCircle size={18} />
          <span className="text-[10px] font-bold">וואטסאפ</span>
        </a>
        <a href={`tel:${PHONE}`} className="flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-white/5 transition">
          <Phone size={18} className="text-[oklch(0.7_0.18_255)]" />
          <span className="text-[10px] font-bold">שיחה</span>
        </a>
        <button type="button" onClick={scrollToLead} className="flex flex-col items-center gap-1 py-2 rounded-xl bg-gradient-orange text-white">
          <Sparkles size={18} />
          <span className="text-[10px] font-bold">פרטים</span>
        </button>
        <a href={TRAINING_MAP_URL} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-white/5 transition">
          <Navigation size={18} className="text-accent" />
          <span className="text-[10px] font-bold">ניווט</span>
        </a>
      </div>
    </div>
  );
}

// ===================== License Matcher =====================
function LicenseMatcher() {
  const [age, setAge] = useState<number | "">("");
  const [hasLicense, setHasLicense] = useState<"yes" | "no" | "">("");
  const [vehicle, setVehicle] = useState<"car" | "moto" | "">("");

  const recommendation = (() => {
    if (!age || !hasLicense || !vehicle) return null;
    const a = Number(age);
    if (vehicle === "car") {
      if (a < 16.5) return { code: "B", title: "רכב אוטומט (B)", note: "צריך להמתין לגיל 16.5 כדי להתחיל ללמוד.", interest: "רכב אוטומט דרגה B" };
      return { code: "B", title: "רכב אוטומט (B)", note: "מתאים לך! נתחיל את התהליך לרישיון רכב פרטי.", interest: "רכב אוטומט דרגה B" };
    }
    // moto
    if (a >= 21 && hasLicense === "yes") return { code: "A", title: "אופנוע ללא הגבלה (A)", note: "ניתן ללמוד דרגה A — בכפוף לוותק על A1.", interest: "אופנוע A" };
    if (a >= 18) return { code: "A1", title: "אופנוע בינוני (A1)", note: "מתאים לך — עד 47 כ״ס.", interest: "אופנוע A1" };
    if (a >= 16) return { code: "A2", title: "אופנוע מתחילים (A2)", note: "התחלה מצוינת — עד 14.7 כ״ס.", interest: "אופנוע A2" };
    return { code: "A2", title: "אופנוע מתחילים (A2)", note: "צריך להמתין לגיל 16 כדי להתחיל.", interest: "אופנוע A2" };
  })();

  const waMatcherUrl = (() => {
    if (!recommendation) return "#";
    const vehicleWord = vehicle === "car" ? "רכב" : "אופנוע";
    const titleHasVehicle = recommendation.title.includes(vehicleWord);
    const lines = [
      "היי חן, הגעתי דרך האתר 👋",
      "",
      "בדקתי איזה רישיון מתאים לי:",
      "",
      `גיל: ${age}`,
      `יש לי רישיון קודם: ${hasLicense === "yes" ? "כן" : "לא"}`,
    ];
    if (!titleHasVehicle) {
      lines.push(`תחום לימוד: ${vehicleWord}`);
    }
    lines.push(`ההמלצה שקיבלתי: ${recommendation.title}`);
    lines.push("", "אשמח לקבל פרטים ולהתחיל ללמוד 🙌");
    const msg = lines.join("\n");
    return `https://wa.me/${PHONE_INTL}?text=${encodeURIComponent(msg)}`;
  })();

  return (
    <section id="match" className="py-7 sm:py-24 px-4 relative">
      <div className="absolute inset-0 -z-10 grid-bg opacity-30" />
      <div className="max-w-5xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-5 sm:mb-14">
          <p className="gradient-text-blue font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">כלי חכם</p>
          <h2 className="text-display text-4xl sm:text-5xl">
            איזה <span className="gradient-text-orange">רישיון מתאים לי</span>?
          </h2>
          <p className="text-muted-foreground mt-2 sm:mt-4 max-w-xl mx-auto">ענה על 3 שאלות ונמצא לך את הדרגה המתאימה ביותר.</p>
        </motion.div>

        <motion.div {...fadeUp} className="glass-strong rounded-[2rem] border border-white/10 p-4 sm:p-8 grid lg:grid-cols-2 gap-4 sm:gap-8 shadow-card">
          <div className="space-y-3 sm:space-y-5">
            <div>
              <label className="text-xs font-bold mb-2 block text-muted-foreground">גיל</label>
              <input type="number" min={14} max={99} value={age} onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-base outline-none focus:border-accent transition" placeholder="לדוגמה: 18" />
            </div>
            <div>
              <label className="text-xs font-bold mb-2 block text-muted-foreground">יש לך רישיון קיים?</label>
              <div className="grid grid-cols-2 gap-2">
                {[{ v: "yes", l: "כן" }, { v: "no", l: "לא" }].map((o) => (
                  <button key={o.v} type="button" onClick={() => setHasLicense(o.v as "yes" | "no")}
                    className={`rounded-xl py-3 font-bold text-sm border transition ${hasLicense === o.v ? "bg-gradient-blue text-white border-transparent shadow-glow" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
                    {o.l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold mb-2 block text-muted-foreground">רכב או אופנוע?</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setVehicle("car")}
                  className={`rounded-xl py-3 font-bold text-sm border transition flex items-center justify-center gap-2 ${vehicle === "car" ? "bg-gradient-blue text-white border-transparent shadow-glow" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
                  <Car size={16} /> רכב
                </button>
                <button type="button" onClick={() => setVehicle("moto")}
                  className={`rounded-xl py-3 font-bold text-sm border transition flex items-center justify-center gap-2 ${vehicle === "moto" ? "bg-gradient-orange text-white border-transparent shadow-glow-orange" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
                  <Bike size={16} /> אופנוע
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-background/40 p-4 sm:p-6 flex flex-col justify-center min-h-[140px] sm:min-h-[220px]">
            {recommendation ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <p className="text-xs font-bold tracking-[0.2em] uppercase gradient-text-orange mb-2">ההמלצה שלנו</p>
                <h3 className="text-display text-3xl sm:text-4xl mb-2">{recommendation.title}</h3>
                <p className="text-muted-foreground mb-5">{recommendation.note}</p>
                <a
                  href={waMatcherUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-bold text-white shadow-[0_10px_30px_-10px_rgba(37,211,102,0.8)] hover:scale-105 transition"
                >
                  <MessageCircle size={16} /> שלח לי פרטים בוואטסאפ
                </a>
              </motion.div>
            ) : (
              <div className="text-center text-muted-foreground">
                <Sparkles size={28} className="mx-auto mb-3 text-accent" />
                <p className="text-sm">מלא/י את 3 השאלות מימין ונמליץ לך על הדרגה המתאימה.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ===================== Success Gallery =====================
const galleryItems = [
  { tag: "טסט", title: "עברתי טסט!", grad: "from-[oklch(0.62_0.20_255)] to-[oklch(0.45_0.18_265)]" },
  { tag: "אופנוע", title: "שיעור A2", grad: "from-[oklch(0.78_0.20_55)] to-[oklch(0.55_0.22_30)]" },
  { tag: "רכב", title: "שיעור B", grad: "from-[oklch(0.7_0.18_250)] to-[oklch(0.5_0.20_270)]" },
  { tag: "הצלחה", title: "רישיון ביד", grad: "from-[oklch(0.75_0.18_40)] to-[oklch(0.5_0.22_25)]" },
  { tag: "אופנוע", title: "תרגול במגרש", grad: "from-[oklch(0.6_0.20_260)] to-[oklch(0.4_0.18_280)]" },
  { tag: "טסט", title: "פעם ראשונה!", grad: "from-[oklch(0.78_0.18_55)] to-[oklch(0.6_0.20_255)]" },
  { tag: "רכב", title: "מוכן לטסט", grad: "from-[oklch(0.5_0.18_265)] to-[oklch(0.3_0.15_270)]" },
  { tag: "הצלחה", title: "תלמידה מאושרת", grad: "from-[oklch(0.72_0.18_50)] to-[oklch(0.55_0.22_35)]" },
];
function SuccessGallery() {
  return (
    <section id="gallery" className="py-7 sm:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-5 sm:mb-14">
          <p className="gradient-text-orange font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">גלריית הצלחות</p>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl">
            תלמידים <span className="gradient-text-orange">שעשו את זה</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">רגעי הצלחה מתוך השיעורים והטסטים — אווירה צעירה, מקצועית ומלאה במוטיבציה.</p>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {galleryItems.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`group relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br ${g.grad} cursor-pointer`}
            >
              <div className="absolute inset-0 grid-bg opacity-20" />
              <div className="absolute inset-0 grid place-items-center">
                <ImageIcon size={40} className="text-white/30 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-2 right-2 glass-strong rounded-full px-2.5 py-1 text-[10px] font-bold border border-white/10">{g.tag}</div>
              <div className="absolute bottom-3 right-3 left-3 text-white font-black text-sm sm:text-base translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition">
                {g.title}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===================== Video Intro =====================
function VideoIntro() {
  const [playing, setPlaying] = useState(false);
  return (
    <section id="video" className="py-7 sm:py-24 px-4 relative">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] rounded-full bg-[oklch(0.62_0.20_255_/_0.12)] blur-[120px] -z-10" />
      <div className="max-w-5xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-5 sm:mb-14">
          <p className="gradient-text-blue font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">וידאו</p>
          <h2 className="text-display text-4xl sm:text-5xl">
            תכירו את <span className="gradient-text-orange">חן כחלון</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">סרטון היכרות קצר — הגישה, האווירה והדרך שלי ללמד נהיגה.</p>
        </motion.div>

        <motion.div {...fadeUp} className="relative aspect-video rounded-[2rem] overflow-hidden border border-white/10 shadow-glow group">
          {/* placeholder backdrop */}
          <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.18_0.04_265)] via-[oklch(0.10_0.02_260)] to-[oklch(0.20_0.06_50)]" />
          <div className="absolute inset-0 grid-bg opacity-30" />
          <img src={portraitImgMobile} srcSet={`${portraitImgMobile} 600w, ${portraitImg} 1200w`} sizes="100vw" alt="חן כחלון - מורה נהיגה אשקלון" loading="lazy" width={1280} height={720} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 transition" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

          {!playing ? (
            <button type="button" onClick={() => setPlaying(true)} aria-label="נגן וידאו" className="absolute inset-0 grid place-items-center">
              <span className="relative grid place-items-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-orange text-white shadow-glow-orange group-hover:scale-110 transition-transform">
                <Play size={36} className="ml-1" fill="currentColor" />
                <span className="absolute inset-0 rounded-full bg-[oklch(0.72_0.18_50)] -z-10 animate-pulse-ring" />
              </span>
            </button>
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-black/80 text-center text-white p-6">
              <div>
                <VideoIcon size={36} className="mx-auto mb-3 text-accent" />
                <p className="font-bold mb-2">הסרטון יעלה בקרוב</p>
                <p className="text-sm text-white/70">בינתיים — אפשר ליצור קשר ולשמוע על השיעורים</p>
              </div>
            </div>
          )}

          <div className="absolute bottom-4 right-4 left-4 flex flex-wrap items-center justify-between gap-3">
            <div className="glass-strong rounded-full px-3 py-1.5 text-xs font-bold border border-white/10">סרטון היכרות · 2:15</div>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-bold text-white shadow-card">
              <MessageCircle size={14} /> שאל אותי שאלה
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ===================== Social Feed =====================
const socialPosts = [
  { platform: "instagram" as const, caption: "תלמידה עברה טסט מהפעם הראשונה 🎉", likes: "248", grad: "from-[oklch(0.72_0.18_50)] to-[oklch(0.55_0.22_330)]" },
  { platform: "tiktok" as const, caption: "טיפ חשוב לפני טסט אופנוע 🏍️", likes: "1.2K", grad: "from-[oklch(0.20_0.02_260)] to-[oklch(0.10_0.02_260)]" },
  { platform: "instagram" as const, caption: "שיעור ראשון על הכלי החדש 🚗", likes: "189", grad: "from-[oklch(0.62_0.20_255)] to-[oklch(0.4_0.18_280)]" },
  { platform: "tiktok" as const, caption: "מה לבדוק לפני יציאה לכביש?", likes: "892", grad: "from-[oklch(0.78_0.20_55)] to-[oklch(0.5_0.22_30)]" },
];
function SocialFeed() {
  return (
    <section id="social" className="py-7 sm:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-5 sm:mb-14">
          <p className="gradient-text-orange font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">עקבו אחריי</p>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl">
            הסיפורים שלי <span className="gradient-text-blue">ברשתות</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">תכנים חדשים, טיפים, ורגעים מתוך השיעורים — מוזמנים להצטרף.</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {socialPosts.map((p, i) => {
            const href = p.platform === "tiktok" ? TIKTOK : INSTAGRAM;
            return (
              <motion.a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative aspect-[9/16] rounded-3xl overflow-hidden border border-white/10 block"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${p.grad}`} />
                <div className="absolute inset-0 grid-bg opacity-20" />
                <div className="absolute inset-0 grid place-items-center">
                  <Play size={48} className="text-white/40 group-hover:scale-110 group-hover:text-white/70 transition" fill="currentColor" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* platform badge */}
                <div className="absolute top-3 right-3 glass-strong rounded-full px-2.5 py-1 flex items-center gap-1.5 border border-white/10">
                  {p.platform === "instagram" ? <Instagram size={12} /> : <TikTokIcon className="w-3 h-3" />}
                  <span className="text-[10px] font-bold capitalize">{p.platform}</span>
                </div>

                {/* caption */}
                <div className="absolute bottom-3 right-3 left-3 text-white">
                  <p className="text-xs sm:text-sm font-bold leading-snug mb-2 line-clamp-3">{p.caption}</p>
                  <div className="flex items-center gap-3 text-[11px] text-white/80">
                    <span className="inline-flex items-center gap-1"><Heart size={11} /> {p.likes}</span>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>

        <div className="text-center mt-10 flex flex-wrap justify-center gap-3">
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-orange px-5 py-3 text-sm font-bold text-white shadow-glow-orange hover:scale-105 transition">
            <Instagram size={16} /> עקבו באינסטגרם
          </a>
          <a href={TIKTOK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full glass-strong border border-white/10 px-5 py-3 text-sm font-bold hover:bg-white/5 transition">
            <TikTokIcon className="w-4 h-4" /> בטיקטוק
          </a>
        </div>
      </div>
    </section>
  );
}

function LandingPage() {
  return (
    <SiteSettingsProvider>
      <SiteSettingsRuntime />
      <LandingPageInner />
    </SiteSettingsProvider>
  );
}

// Mirrors CMS settings into the module-level constants used throughout this
// file, then forces a re-render so children pick up the new values.
function SiteSettingsRuntime() {
  const s = useSiteSettings();
  useEffect(() => {
    PHONE = s.contact.phone;
    PHONE_DISPLAY = s.contact.phone_display;
    PHONE_INTL = s.contact.phone_intl;
    WA_DEFAULT_MSG = s.contact.whatsapp_message;
    WA_URL = waUrl(s);
    INSTAGRAM = s.social.instagram;
    FACEBOOK = s.social.facebook;
    TIKTOK = s.social.tiktok;
    EMAIL = s.contact.email;
    TRAINING_MAP_URL = s.contact.training_map_url;
    // bump a window event so memoized children may also refresh if needed
    window.dispatchEvent(new Event("site-settings:updated"));
  }, [s]);
  return null;
}

function LandingPageInner() {
  // Subscribe to settings so this tree re-renders when CMS values change.
  useSiteSettings();
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Toaster position="top-center" theme="dark" richColors />
      <Nav />
      <main className="pb-24 md:pb-0">
        <Hero />
        <Categories />
        <LicenseMatcher />
        <About />
        <WhyMe />
        <SuccessGallery />
        <VideoIntro />
        <SocialFeed />
        <Reviews />
        <LeadForm />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <MobileBar />
    </div>
  );
}
