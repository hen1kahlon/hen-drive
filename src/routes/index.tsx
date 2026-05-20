import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import {
  Phone, MessageCircle, Instagram, Facebook, Mail, Star, Car, Bike,
  Users, Award, Clock, Shield, Sparkles, MapPin, ChevronDown, Check,
  ArrowLeft, Zap, Heart, GraduationCap, Send, Trophy, Calendar, UserCheck,
  Smile, Upload, Navigation, Play, Image as ImageIcon, Video as VideoIcon,
  Accessibility, Plus, Minus, Contrast, RotateCcw, X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  SiteSettingsProvider,
  useSiteSettings,
  waUrl,
  DEFAULT_SETTINGS,
  mergeSettings,
  type SiteSettings,
} from "@/lib/site-settings";
import { getSafeImageMimeType } from "@/lib/image-upload";
import heroImg from "@/assets/hero-driving.webp";
import heroImgMobile from "@/assets/hero-driving-mobile.webp";
import portraitImg from "@/assets/instructor-portrait.webp";
import portraitImgMobile from "@/assets/instructor-portrait-mobile.webp";
import chenPortrait from "@/assets/chen-portrait.webp";
import vehSedan from "@/assets/vehicle-sedan.webp";
import vehBikeA2Manual from "@/assets/vehicle-bike-a2-manual.webp";
import vehBikeA1Manual from "@/assets/vehicle-bike-a1-manual.webp";
import vehScooterA1Auto from "@/assets/vehicle-scooter-a1-auto.webp";
import vehScooter from "@/assets/vehicle-scooter.webp";
import vehBikeA from "@/assets/vehicle-bike-a.webp";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      const { data } = await supabase
        .from("site_settings")
        .select("data")
        .eq("id", "main")
        .maybeSingle();
      return { initialSettings: data?.data ? mergeSettings(data.data) : DEFAULT_SETTINGS };
    } catch {
      return { initialSettings: DEFAULT_SETTINGS };
    }
  },
  head: () => ({
    links: [
      {
        rel: "preload",
        as: "image",
        href: heroImgMobile,
        imageSrcSet: `${heroImgMobile} 768w, ${heroImg} 1920w`,
        imageSizes: "(max-width: 768px) 100vw, 60vw",
        fetchPriority: "high",
      } as any,
      { rel: "canonical", href: "https://hendrive.co.il/" },
    ],
    meta: [
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { property: "og:url", content: "https://hendrive.co.il/" },
      { property: "og:image", content: `https://hendrive.co.il${heroImg}` },
      { property: "og:image:width", content: "1920" },
      { property: "og:image:height", content: "1080" },
      { property: "og:image:alt", content: "חן כחלון – מורה נהיגה לאופנוע ורכב באשקלון" },
      { name: "twitter:image", content: `https://hendrive.co.il${heroImg}` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "כמה זמן לוקח להוציא רישיון?", acceptedAnswer: { "@type": "Answer", text: "לרכב (דרגה B) משך הלימוד נע בדרך כלל בין חודשיים ל-4 חודשים. לאופנוע (A / A1 / A2) התהליך מהיר יותר וניתן לסיים גם בתוך שבוע, בהתאם לזמינות וניסיון קודם." } },
            { "@type": "Question", name: "באיזה אזורים מתקיימים השיעורים?", acceptedAnswer: { "@type": "Answer", text: "לרכב באשקלון והסביבה עם אפשרות איסוף מבית התלמיד בתיאום מראש. לאופנוע במגרש ייעודי בתיאום מראש." } },
            { "@type": "Question", name: "האם אפשר ללמוד גם רכב וגם אופנוע?", acceptedAnswer: { "@type": "Answer", text: "בהחלט! אני מלמד את שני התחומים ואפשר לשלב." } },
            { "@type": "Question", name: "איך קובעים שיעור ראשון?", acceptedAnswer: { "@type": "Answer", text: "פשוט שולחים הודעת וואטסאפ או מתקשרים — ונמצא יחד את הזמן הכי נוח לכם." } },
            { "@type": "Question", name: "איזה דרגות אופנוע אפשר ללמוד?", acceptedAnswer: { "@type": "Answer", text: "ניתן ללמוד את כל דרגות האופנוע: A מגיל 21, A1 ידני/אוטומט מגיל 18, ו-A2 ידני/אוטומט מגיל 16." } },
          ],
        }),
      },
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
      <div className={`${dim} rounded-xl bg-gradient-blue grid place-items-center text-white font-black shadow-glow`}>חכ</div>
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
        <a href={`tel:${PHONE}`} className="hidden md:inline-flex items-center gap-2 rounded-full bg-gradient-blue px-4 py-2 text-sm font-bold text-white shadow-glow hover:scale-105 transition">
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
          <a href={`tel:${PHONE}`} className="mt-2 flex items-center justify-center gap-2 rounded-full bg-gradient-blue px-4 py-2.5 text-sm font-bold text-white">
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
    <section id="top" className="relative min-h-screen flex items-start lg:items-center pt-24 lg:pt-20 overflow-hidden">
      {/* premium background — matches site --background token for seamless flow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,oklch(0.11_0.014_250)_0%,oklch(0.08_0.013_250)_50%,oklch(0.06_0.012_250)_100%)]">
        <div className="absolute -top-32 -right-32 w-[40rem] h-[40rem] rounded-full bg-[oklch(0.20_0.015_250_/_0.4)] blur-[140px] animate-float-slow" />
        <div className="absolute -bottom-40 -left-32 w-[40rem] h-[40rem] rounded-full bg-[oklch(0.20_0.015_250_/_0.4)] blur-[140px] animate-float-slow" style={{ animationDelay: "3s" }} />
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
              alt="חן כחלון – מורה נהיגה לאופנוע ורכב באשקלון בשיעור נהיגה"
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
              <div className="text-xl sm:text-2xl font-black gradient-text-blue leading-none">{s.stats.floating}</div>
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
          <p className="text-display text-2xl sm:text-3xl lg:text-4xl gradient-text-blue mb-5">
            {s.hero.tagline}
          </p>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 max-w-xl mx-auto lg:mx-0">
            {s.hero.description}
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
            <button type="button" onClick={scrollToLead} className="group inline-flex items-center gap-2 rounded-full bg-gradient-blue px-6 py-3.5 font-bold text-white shadow-glow hover:scale-105 transition">
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

type Category = {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  img?: string;
  imgs?: { src: string; label: string }[];
  icon: typeof Car;
  color: "blue" | "blue";
  interest: string;
};

const categories: Category[] = [
  { id: "B", title: "רכב אוטומט", subtitle: "דרגה B", desc: "רכב פרטי אוטומט — הדרגה הפופולרית והמבוקשת ביותר.", img: vehSedan, icon: Car, color: "blue", interest: "רכב אוטומט דרגה B" },
  { id: "A2", title: "אופנוע/קטנוע A2", subtitle: "דרגה A2 · ידני / אוטומט", desc: "עד 14.7 כ״ס (125 סמ״ק) — אפשר ללמוד גם בהילוכים (ידני) וגם באוטומט.", imgs: [{ src: vehBikeA2Manual, label: "ידני" }, { src: vehScooter, label: "אוטומט" }], icon: Zap, color: "blue", interest: "אופנוע A2 (ידני / אוטומט)" },
  { id: "A1", title: "אופנוע/קטנוע A1", subtitle: "דרגה A1 · ידני / אוטומט", desc: "עד 47 כ״ס — אפשר ללמוד גם בהילוכים (ידני) וגם באוטומט.", imgs: [{ src: vehBikeA1Manual, label: "ידני" }, { src: vehScooterA1Auto, label: "אוטומט" }], icon: Bike, color: "blue", interest: "אופנוע A1 (ידני / אוטומט)" },
  { id: "A", title: "אופנוע ללא הגבלה", subtitle: "דרגה A", desc: "ללא הגבלת כ״ס — רישיון אופנוע מלא לכל סוגי האופנועים בכביש.", img: vehBikeA, icon: Bike, color: "blue", interest: "אופנוע A" },
];

function getLeadScrollOffset() {
  const header = document.querySelector("header");
  const headerHeight = header?.getBoundingClientRect().height ?? 64;
  return Math.ceil(headerHeight + 14);
}

function getLeadScrollTop(target: HTMLElement) {
  return Math.max(0, Math.round(target.getBoundingClientRect().top + window.scrollY - getLeadScrollOffset()));
}

function alignLeadAfterScroll(target: HTMLElement) {
  let done = false;
  let settleTimer = 0;
  let safetyTimer = 0;

  const finish = () => {
    if (done) return;
    done = true;
    window.clearTimeout(settleTimer);
    window.clearTimeout(safetyTimer);
    window.removeEventListener("scroll", onScroll);
    const delta = target.getBoundingClientRect().top - getLeadScrollOffset();
    if (Math.abs(delta) > 4) window.scrollBy({ top: delta, behavior: "smooth" });
  };

  const scheduleFinish = () => {
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(finish, 160);
  };

  const onScroll = () => scheduleFinish();
  window.addEventListener("scroll", onScroll, { passive: true });
  scheduleFinish();
  safetyTimer = window.setTimeout(finish, 1800);
}

function scrollToLead() {
  const target = (document.getElementById("lead-form") || document.getElementById("lead")) as HTMLElement | null;
  if (!target) return;
  requestAnimationFrame(() => {
    window.scrollTo({ top: getLeadScrollTop(target), behavior: "smooth" });
    alignLeadAfterScroll(target);
  });
}

function selectInterestAndScroll(interest: string) {
  window.dispatchEvent(new CustomEvent("lead:set-interest", { detail: interest }));
  // wait a frame so the form state updates before scrolling
  requestAnimationFrame(() => requestAnimationFrame(scrollToLead));
}

function Categories() {
  return (
    <section id="categories" className="py-7 sm:py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-5 sm:mb-14">
          <p className="gradient-text-blue font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">בחרו את הדרגה</p>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl">
            על מה <span className="gradient-text-blue">תרצו ללמוד</span>?
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
              <div className={`absolute -top-20 ${c.color === "blue" ? "right-1/2 bg-[oklch(0.62_0.20_255_/_0.4)]" : "left-1/2 bg-[oklch(0.62_0.20_255_/_0.4)]"} w-40 h-40 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity`} />

              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-black leading-tight">{c.title}</h3>
                    <p className={`text-sm font-bold ${c.color === "blue" ? "gradient-text-blue" : "gradient-text-blue"}`}>{c.subtitle}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl ${c.color === "blue" ? "bg-[oklch(0.62_0.20_255_/_0.15)] text-[oklch(0.7_0.18_255)]" : "bg-[oklch(0.62_0.20_255_/_0.15)] text-[oklch(0.7_0.18_255)]"} grid place-items-center border ${c.color === "blue" ? "border-[oklch(0.62_0.20_255_/_0.3)]" : "border-[oklch(0.62_0.20_255_/_0.3)]"}`}>
                    <c.icon size={18} />
                  </div>
                </div>

                {c.imgs ? (
                  <div className="aspect-[4/3] my-3 grid grid-cols-2 gap-2">
                    {c.imgs.map((v) => (
                      <div key={v.label} className="relative rounded-2xl bg-white/[0.03] border border-white/5 grid place-items-center p-2 group-hover:scale-[1.03] transition-transform duration-500">
                        <img src={v.src} alt={`${c.title} — ${v.label}`} loading="lazy" width={300} height={220} className="w-full h-full object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.5)]" />
                        <span className={`absolute bottom-1.5 right-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${c.color === "blue" ? "bg-[oklch(0.62_0.20_255_/_0.18)] text-[oklch(0.82_0.12_255)] border border-[oklch(0.62_0.20_255_/_0.35)]" : "bg-[oklch(0.62_0.20_255_/_0.18)] text-[oklch(0.82_0.12_255)] border border-[oklch(0.62_0.20_255_/_0.35)]"}`}>{v.label}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="aspect-[4/3] grid place-items-center my-3 group-hover:scale-105 transition-transform duration-500">
                    <img src={c.img} alt={`${c.title} ${c.subtitle}`} loading="lazy" width={400} height={300} className="w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]" />
                  </div>
                )}

                <p className="text-sm text-muted-foreground mb-4 leading-relaxed min-h-[40px]">{c.desc}</p>

                <button type="button" onClick={() => selectInterestAndScroll(c.interest)} className="block w-full text-center rounded-xl border border-white/10 py-2.5 text-sm font-bold hover:bg-gradient-blue hover:border-transparent hover:text-white transition-all">
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
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-96 h-96 rounded-full bg-[oklch(0.62_0.20_255_/_0.12)] blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-5 sm:gap-8 lg:gap-16 items-center">
        <motion.div {...fadeUp} className="relative order-2 lg:order-1">
          <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-glow ring-glow-blue aspect-square">
            <img src={chenPortrait} alt="חן כחלון - מורה נהיגה עם רכב ואופנוע באשקלון" loading="lazy" width={1100} height={1100} className="absolute inset-0 w-full h-full object-cover object-center" />
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 bg-gradient-to-t from-black/85 via-black/55 to-transparent">
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/15 p-2 sm:p-3 text-center">
                  <div className="text-base sm:text-2xl font-bold gradient-text-blue leading-none">98%</div>
                  <div className="text-[10px] sm:text-xs text-white/80 mt-1">הצלחה</div>
                </div>
                <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/15 p-2 sm:p-3 text-center">
                  <div className="text-base sm:text-2xl font-bold gradient-text-blue leading-none">5</div>
                  <div className="text-[10px] sm:text-xs text-white/80 mt-1">שנות ותק</div>
                </div>
                <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/15 p-2 sm:p-3 text-center">
                  <div className="text-base sm:text-2xl font-bold gradient-text-blue leading-none">350+</div>
                  <div className="text-[10px] sm:text-xs text-white/80 mt-1">תלמידים</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="order-1 lg:order-2">
          <p className="gradient-text-blue font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">קצת עליי</p>
          <h2 className="text-display text-4xl sm:text-5xl mb-6">
            נעים מאוד,<br />
            <span className="gradient-text-blue">חן כחלון</span>
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
  { icon: Heart, title: "יחס אישי וסבלני", desc: "כל תלמיד מקבל התייחסות מלאה.", color: "blue" },
  { icon: Smile, title: "אווירה צעירה", desc: "שיעור שמרגיש כמו זמן עם חבר טוב.", color: "blue" },
  { icon: Shield, title: "כלים חדשים", desc: "רכבים ואופנועים מהדור החדש.", color: "blue" },
  { icon: GraduationCap, title: "ליווי מקצועי", desc: "מהשיעור הראשון ועד ההצלחה.", color: "blue" },
  { icon: Calendar, title: "זמינות גמישה", desc: "קביעת שיעורים לפי הזמן שלך.", color: "blue" },
  { icon: Trophy, title: "אחוזי הצלחה", desc: "תוצאות אמיתיות שמדברות בעד עצמן.", color: "blue" },
];

function WhyMe() {
  return (
    <section id="why" className="py-7 sm:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-5 sm:mb-14">
          <p className="gradient-text-blue font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">היתרונות שלי</p>
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
              <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${r.color === "blue" ? "bg-[oklch(0.62_0.20_255_/_0.3)]" : "bg-[oklch(0.62_0.20_255_/_0.3)]"} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative">
                <div className={`w-12 h-12 rounded-2xl border ${r.color === "blue" ? "border-[oklch(0.62_0.20_255_/_0.3)] bg-[oklch(0.62_0.20_255_/_0.1)] text-[oklch(0.7_0.18_255)]" : "border-[oklch(0.62_0.20_255_/_0.3)] bg-[oklch(0.62_0.20_255_/_0.1)] text-[oklch(0.7_0.18_255)]"} grid place-items-center mb-4`}>
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
          <p className="gradient-text-blue font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">המלצות תלמידים</p>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl">
            מה <span className="gradient-text-blue">אומרים עליי</span>
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
              className="bg-card rounded-3xl p-5 border border-white/5 hover:border-white/15 transition flex flex-col"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-blue grid place-items-center text-white font-black text-sm shrink-0">
                  {r.full_name.charAt(0)}
                </div>
                <p className="font-black text-base leading-tight">{r.full_name}</p>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[...Array(r.rating)].map((_, j) => <Star key={j} size={14} className="fill-[oklch(0.7_0.18_255)] text-[oklch(0.7_0.18_255)]" />)}
              </div>
              {r.image_url && <img src={r.image_url} alt={`תלמיד/ה ${r.full_name} – ביקורת על שיעורי נהיגה אצל חן כחלון`} loading="lazy" className="rounded-xl mb-3 w-full h-32 object-cover" />}
              <p className="text-sm text-foreground/85 leading-relaxed mb-4 min-h-[80px] font-normal">"{r.content}"</p>
              <div className="mt-auto pt-3 border-t border-white/5">
                <p className="text-[11px] text-muted-foreground">דרגה {r.license_type}</p>
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
        const mimeType = getSafeImageMimeType(file);
        const ext = mimeType === "image/jpeg" ? "jpg" : mimeType === "image/png" ? "png" : "webp";
        const path = `submissions/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("review-images").upload(path, file, { contentType: mimeType });
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
        status: "pending",
        is_featured: false,
      });
      if (error) throw error;
      toast.success("הביקורת נשלחה וממתינה לאישור");
      setDone(true);
    } catch (err) {
      toast.error(err instanceof Error ? `שגיאה בשליחת ביקורת: ${err.message}` : "שגיאה בשליחת ביקורת");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div {...fadeUp} className="mt-6 sm:mt-16 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <p className="gradient-text-blue font-bold text-xs tracking-[0.2em] uppercase mb-2">שתפו את החוויה</p>
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
                  <Star size={28} className={n <= form.rating ? "fill-[oklch(0.7_0.18_255)] text-[oklch(0.7_0.18_255)]" : "text-white/20"} />
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
            className="w-full bg-gradient-blue text-white font-bold rounded-xl py-3.5 shadow-glow disabled:opacity-50 flex items-center justify-center gap-2">
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
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", interest: "רכב אוטומט דרגה B", area: "אשקלון", notes: "" });
  // honeypot — bots fill all inputs; humans never see this one
  const [website, setWebsite] = useState("");
  // page-mount timestamp — instant-submit bots fail this
  const mountedAt = useRef<number>(Date.now());

  useEffect(() => { setMounted(true); }, []);

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    // honeypot — silently drop bot submissions
    if (website.trim().length > 0) {
      setSubmitted(true);
      return;
    }
    // too-fast submit (under 1.5s = bot)
    if (Date.now() - mountedAt.current < 1500) {
      toast.error("נא למלא את הטופס לפני שליחה");
      return;
    }

    const name = form.name.trim();
    const phoneRaw = form.phone.trim();
    const phoneDigits = phoneRaw.replace(/[\s\-().]/g, "");

    if (name.length < 2) {
      toast.error("נא להזין שם מלא (לפחות 2 תווים)");
      return;
    }
    if (name.length > 60) {
      toast.error("השם ארוך מדי");
      return;
    }
    // Israeli phone: 9–10 digits, optional +972 / 00972 prefix
    const phoneOk = /^(\+?972|0)?5\d{8}$|^(\+?972|0)?[2-489]\d{7,8}$/.test(phoneDigits);
    if (!phoneOk) {
      toast.error("מספר טלפון לא תקין — נסו בפורמט 05X-XXXXXXX");
      return;
    }

    // local cooldown — 60s between submissions per device
    try {
      const last = Number(localStorage.getItem("lead:last") ?? "0");
      if (Date.now() - last < 60_000) {
        toast.error("כבר שלחת פנייה לאחרונה — חן יחזור אליך בקרוב 🙏");
        return;
      }
    } catch { /* localStorage may be blocked */ }

    // duplicate-submit guard — same phone in last 24h on this device
    try {
      const prev = localStorage.getItem("lead:phone");
      if (prev && prev === phoneDigits) {
        toast.error("כבר שלחנו את הפרטים האלה — חן יחזור אליך 👌");
        setSubmitted(true);
        return;
      }
    } catch { /* ignore */ }

    setSubmitting(true);
    // Map interest text to license_type when possible
    const it = form.interest;
    const license_type = /A2/i.test(it) ? "A2" : /A1/i.test(it) ? "A1" : /\bA\b/i.test(it) ? "A" : /B/i.test(it) ? "B" : null;
    try {
      const response = await fetch("/api/public/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: name.slice(0, 100),
          phone: phoneDigits.slice(0, 30),
          license_type,
          interest: it.slice(0, 200),
          area: form.area.slice(0, 200),
          notes: form.notes.slice(0, 2000) || null,
          source: "lead-form",
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.error || "שמירת הפרטים נכשלה");
      if (result?.notificationQueued === false) {
        console.warn("Lead saved but notification email was not queued", result);
      }
      try {
        localStorage.setItem("lead:last", String(Date.now()));
        localStorage.setItem("lead:phone", phoneDigits);
      } catch { /* ignore */ }
    } catch (err) {
      toast.error(err instanceof Error ? `שגיאה בשמירה: ${err.message}` : "שגיאה בשמירת הפרטים");
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    setSubmitted(true);
    toast.success("תודה! הפרטים התקבלו, חן יחזור אליך בהקדם.");
    // GA4 conversion event — fires only if GA4 is wired up
    if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "generate_lead", {
        event_category: "engagement",
        license_type: license_type || "unknown",
        value: 1,
        currency: "ILS",
        transport_type: "beacon",
      });
      (window as any).gtag("event", "form_submit", {
        event_category: "engagement",
        form_id: "lead-form",
        license_type: license_type || "unknown",
        transport_type: "beacon",
      });
    }
  };

  const promises = [
    { icon: Zap, title: "חזרה מהירה", desc: "תוך שעות בודדות" },
    { icon: Shield, title: "ללא התחייבות", desc: "השארת פרטים ללא עלות" },
    { icon: UserCheck, title: "התאמה אישית", desc: "נמצא ביחד את המסלול" },
  ];

  return (
    <section id="lead" className="py-7 sm:py-24 px-4 relative overflow-hidden scroll-mt-20">
      <div className="absolute -top-40 left-0 w-[30rem] h-[30rem] rounded-full bg-[oklch(0.62_0.20_255_/_0.18)] blur-[120px] -z-10" />
      <div className="absolute -bottom-40 right-0 w-[30rem] h-[30rem] rounded-full bg-[oklch(0.62_0.20_255_/_0.18)] blur-[120px] -z-10" />

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
                <div className="w-11 h-11 rounded-xl bg-gradient-blue grid place-items-center text-white flex-shrink-0">
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
        <motion.div id="lead-form" {...fadeUp} className="lg:col-span-3 glass-strong rounded-[2rem] p-6 sm:p-8 border border-white/10 shadow-card relative scroll-mt-24">
          <div className="mb-6">
            <p className="gradient-text-blue font-bold text-xs tracking-[0.2em] uppercase mb-2">השאירו פרטים</p>
            <h3 className="text-2xl sm:text-3xl font-black">חן יחזור אליך <span className="gradient-text-blue">בהקדם</span></h3>
          </div>

          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-blue grid place-items-center text-white shadow-glow">
                <Check size={32} strokeWidth={3} />
              </div>
              <h3 className="text-2xl font-black mb-2">תודה!</h3>
              <p className="text-muted-foreground">הפרטים התקבלו, חן יחזור אליך בהקדם.</p>
            </div>
          ) : !mounted ? (
            <div className="grid gap-4" aria-hidden="true">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="h-[68px] rounded-xl bg-white/5 border border-white/10" />
                <div className="h-[68px] rounded-xl bg-white/5 border border-white/10" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="h-[68px] rounded-xl bg-white/5 border border-white/10" />
                <div className="h-[68px] rounded-xl bg-white/5 border border-white/10" />
              </div>
              <div className="h-[92px] rounded-xl bg-white/5 border border-white/10" />
              <div className="h-[56px] rounded-xl bg-gradient-blue opacity-70" />
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-4">
              {/* honeypot — invisible to humans, irresistible to bots */}
              <div aria-hidden="true" className="absolute opacity-0 pointer-events-none -z-10" style={{ left: "-9999px", height: 0, overflow: "hidden" }}>
                <label>אתר אינטרנט<input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="שם מלא *">
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={60}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent transition" placeholder="ישראל ישראלי" />
                </Field>
                <Field label="טלפון *">
                  <input required type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={20}
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
              <button type="submit" disabled={submitting} className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-blue px-6 py-4 font-bold text-white shadow-glow hover:scale-[1.01] transition disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100">
                <Send size={18} /> {submitting ? "שולח..." : "שלח/י פרטים"}
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
      <div className="max-w-5xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12">
          <p className="gradient-text-blue font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">שאלות נפוצות</p>
          <h2 className="text-display text-4xl sm:text-5xl">
            כל מה ש<span className="gradient-text-blue">חשוב לדעת</span>
          </h2>
        </motion.div>
        <div className="grid gap-3 lg:grid-cols-2 lg:items-start">
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
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[oklch(0.62_0.20_255_/_0.3)] blur-3xl animate-float-slow" style={{ animationDelay: "2s" }} />
      </div>
      <motion.div {...fadeUp} className="max-w-4xl mx-auto text-center glass-strong rounded-[2.5rem] border border-white/10 p-8 sm:p-14 shadow-card">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-blue px-4 py-1.5 mb-6 text-xs font-bold text-white">
          <Sparkles size={14} /> בואו נתחיל
        </div>
        <h2 className="text-display text-4xl sm:text-6xl mb-4">
          מתחילים את הדרך<br />
          <span className="gradient-text-blue">לרישיון</span>?
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">דבר אחד מפריד בינך לבין הרישיון — ההחלטה שלך</p>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-4 font-bold text-white hover:scale-105 transition shadow-card">
            <MessageCircle size={20} /> שלחו הודעה בוואטסאפ
          </a>
          <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 rounded-full bg-gradient-blue px-7 py-4 font-bold text-white hover:scale-105 transition shadow-glow">
            <Phone size={20} /> התקשרו עכשיו
          </a>
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  const s = useSiteSettings();
  const instagram = s.social.instagram || INSTAGRAM;
  const facebook = s.social.facebook || FACEBOOK;
  const tiktok = s.social.tiktok || TIKTOK;
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
            <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-11 h-11 rounded-full glass-strong border border-white/10 grid place-items-center hover:bg-gradient-blue hover:border-transparent hover:text-white transition">
              <Instagram size={18} />
            </a>
            <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-11 h-11 rounded-full glass-strong border border-white/10 grid place-items-center hover:bg-gradient-blue hover:border-transparent hover:text-white transition">
              <Facebook size={18} />
            </a>
            <a href={tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-11 h-11 rounded-full glass-strong border border-white/10 grid place-items-center hover:bg-foreground hover:text-background hover:border-transparent transition">
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
        <button type="button" onClick={scrollToLead} className="flex flex-col items-center gap-1 py-2 rounded-xl bg-gradient-blue text-white">
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
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  type Rec = { code: string; title: string; note: string; interest: string };
  const recommendations: Rec[] | null = (() => {
    if (!age || !hasLicense || !vehicle) return null;
    const a = Number(age);
    if (vehicle === "car") {
      if (a < 16.5) return [{ code: "B", title: "רכב אוטומט (B)", note: "צריך להמתין לגיל 16.5 כדי להתחיל ללמוד.", interest: "רכב אוטומט דרגה B" }];
      return [{ code: "B", title: "רכב אוטומט (B)", note: "מתאים לך! נתחיל את התהליך לרישיון רכב פרטי.", interest: "רכב אוטומט דרגה B" }];
    }
    // moto
    if (a < 16) {
      return [{ code: "A2", title: "אופנוע/קטנוע A2", note: "צריך להמתין לגיל 16 כדי להתחיל ללמוד A2.", interest: "אופנוע A2" }];
    }
    if (a === 16) {
      return [{ code: "A2", title: "אופנוע/קטנוע A2", note: "בגיל 16 ניתן ללמוד A2 בלבד — בכפוף לאישור הורים.", interest: "אופנוע A2 (גיל 16 — דורש אישור הורים)" }];
    }
    if (a === 17) {
      return [{ code: "A2", title: "אופנוע/קטנוע A2", note: "בגיל 17 ניתן ללמוד A2 — ללא צורך באישור הורים.", interest: "אופנוע A2" }];
    }
    // age >= 18
    const recs: Rec[] = [];
    if (hasLicense === "no") {
      recs.push({ code: "A2", title: "אופנוע/קטנוע A2", note: "מתאים לך — עד 14.7 כ״ס (125 סמ״ק).", interest: "אופנוע A2" });
      recs.push({ code: "A1", title: "אופנוע/קטנוע A1", note: "מתאים לך — עד 47 כ״ס.", interest: "אופנוע A1" });
    } else {
      recs.push({ code: "A1", title: "אופנוע/קטנוע A1", note: "מתאים לך — עד 47 כ״ס.", interest: "אופנוע A1" });
      if (a >= 21) {
        recs.push({ code: "A", title: "אופנוע ללא הגבלה (A)", note: "מתאים לך — בכפוף לרישיון A1 עם ותק של שנה לפחות.", interest: "אופנוע A" });
      }
    }
    return recs;
  })();


  const hasMultiple = !!recommendations && recommendations.length > 1;
  const activeRec = recommendations
    ? recommendations.find((r) => r.code === selectedCode) ?? (hasMultiple ? null : recommendations[0])
    : null;

  const waMatcherUrl = (() => {
    if (!activeRec) return "#";
    const vehicleWord = vehicle === "car" ? "רכב" : "אופנוע";
    const lines = [
      "היי חן, הגעתי דרך האתר 👋",
      "",
      "בדקתי איזה רישיון מתאים לי:",
      "",
      `גיל: ${age}`,
      `יש לי רישיון קודם: ${hasLicense === "yes" ? "כן" : "לא"}`,
    ];
    lines.push(`תחום לימוד: ${vehicleWord}`);
    lines.push(`הדרגה שאני מעוניין/ת בה: ${activeRec.title}`);
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
            איזה <span className="gradient-text-blue">רישיון</span> <span className="text-white">מתאים</span> <span className="gradient-text-blue">לי</span>?
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
                  className={`rounded-xl py-3 font-bold text-sm border transition flex items-center justify-center gap-2 ${vehicle === "moto" ? "bg-gradient-blue text-white border-transparent shadow-glow" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
                  <Bike size={16} /> אופנוע
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-background/40 p-4 sm:p-6 flex flex-col justify-center min-h-[140px] sm:min-h-[220px]">
            {recommendations && recommendations.length > 0 ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <p className="text-xs font-bold tracking-[0.2em] uppercase gradient-text-blue mb-2">
                  {hasMultiple ? "בחר/י את הדרגה שמעניינת אותך" : "ההמלצה שלנו"}
                </p>
                <div className="space-y-3 mb-5">
                  {recommendations.map((r) => {
                    const selected = activeRec?.code === r.code;
                    const Tag = hasMultiple ? "button" : "div";
                    return (
                      <Tag
                        key={r.code}
                        {...(hasMultiple ? { type: "button" as const, onClick: () => setSelectedCode(r.code) } : {})}
                        className={`w-full text-right rounded-xl border p-3 sm:p-4 transition ${
                          hasMultiple
                            ? selected
                              ? "border-primary bg-primary/10 shadow-glow"
                              : "border-white/10 bg-white/5 hover:bg-white/10"
                            : "border-white/10 bg-white/5"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h3 className="text-display text-2xl sm:text-3xl mb-1">{r.title}</h3>
                            <p className="text-muted-foreground text-sm">{r.note}</p>
                          </div>
                          {hasMultiple && (
                            <span className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? "border-accent bg-accent" : "border-white/30"}`}>
                              {selected && <span className="w-2 h-2 rounded-full bg-white" />}
                            </span>
                          )}
                        </div>
                      </Tag>
                    );
                  })}
                </div>
                {activeRec ? (
                  <a
                    href={waMatcherUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-bold text-white shadow-[0_10px_30px_-10px_rgba(37,211,102,0.8)] hover:scale-105 transition"
                  >
                    <MessageCircle size={16} /> שלח לי פרטים בוואטסאפ
                  </a>
                ) : (
                  <p className="text-xs text-muted-foreground">בחר/י דרגה אחת כדי לשלוח לחן בוואטסאפ.</p>
                )}
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

// ===================== Student Success =====================
const SUCCESS_CAPTIONS = [
  "טסט ראשון 🎉",
  "עבר/ה בהצלחה 🚗",
  "עוד הצלחה בדרך לרישיון",
  "גם אתם יכולים",
  "בדרך לעצמאות על הכביש",
  "עוד תלמיד/ה עם רישיון",
  "רישיון ביד ✨",
  "מוכן/ה לכביש",
];

type StudentItem = {
  id: string;
  image_url: string;
  title: string | null;
  caption: string;
  isFirstTry: boolean;
  media_type: "image" | "video";
};

function SuccessGallery() {
  const s = useSiteSettings();
  const [items, setItems] = useState<StudentItem[]>([]);

  useEffect(() => {
    supabase
      .from("gallery_items")
      .select("id,image_url,title,sort_order,media_type")
      .eq("category", "success")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (!data) return;
        setItems(
          data.map((row, i) => ({
            id: row.id as string,
            image_url: row.image_url as string,
            title: (row.title as string | null) ?? null,
            caption:
              ((row.title as string | null) ?? "").trim() ||
              SUCCESS_CAPTIONS[i % SUCCESS_CAPTIONS.length],
            // mark roughly every 3rd card as a "first-try" highlight
            isFirstTry: i % 3 === 0,
            media_type: ((row as { media_type?: string }).media_type === "video"
              ? "video"
              : "image") as "image" | "video",
          })),
        );
      });
  }, []);

  if (items.length === 0) return null;

  const stats = [
    { value: `+${s.stats.students.replace(/\D/g, "") || "350"}`, label: "תלמידים" },
    { value: s.stats.success, label: "הצלחה" },
    { value: s.stats.years, label: "שנות ניסיון" },
  ];

  return (
    <section id="gallery" className="py-7 sm:py-24 px-4 relative overflow-hidden">
      <div className="absolute -top-32 right-1/3 w-[28rem] h-[28rem] rounded-full bg-[oklch(0.62_0.20_255_/_0.10)] blur-[120px] -z-10" />
      <div className="absolute -bottom-40 left-1/4 w-[28rem] h-[28rem] rounded-full bg-[oklch(0.62_0.20_255_/_0.10)] blur-[120px] -z-10" />

      <div className="max-w-[1400px] mx-auto">
        <motion.div {...fadeUp} className="text-center mb-4 sm:mb-10">
          <p className="gradient-text-blue font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">הצלחות אמיתיות</p>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl">
            תלמידים <span className="gradient-text-blue">שעשו את זה</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm sm:text-base">
            רגעי הצלחה אמיתיים — מהשיעור הראשון ועד הקריאה ״עברת!״
          </p>
        </motion.div>

        {/* Counters */}
        <motion.div
          {...fadeUp}
          className="grid grid-cols-3 gap-2 sm:gap-4 max-w-3xl mx-auto mb-6 sm:mb-12"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-strong rounded-2xl border border-white/10 px-2 py-3 sm:px-5 sm:py-5 text-center hover:border-[oklch(0.62_0.20_255_/_0.5)] transition"
            >
              <div className="text-2xl sm:text-4xl font-black gradient-text-blue leading-none mb-1">
                {stat.value}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Mobile: swipe carousel */}
        <div className="sm:hidden -mx-4 px-4 overflow-x-auto snap-x snap-mandatory flex gap-3 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item, i) => (
            <StudentCard key={item.id} item={item} index={i} mobile />
          ))}
        </div>

        {/* Desktop: masonry-like grid */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-[180px] lg:auto-rows-[200px]">
          {items.map((item, i) => (
            <StudentCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StudentCard({
  item,
  index,
  mobile = false,
}: {
  item: StudentItem;
  index: number;
  mobile?: boolean;
}) {
  // Masonry rhythm on desktop: every 3rd card spans 2 rows
  const tall = !mobile && index % 3 === 0;
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4) }}
      className={[
        "group relative overflow-hidden rounded-2xl border border-white/10 glass shadow-card",
        "hover:border-[oklch(0.62_0.20_255_/_0.5)] hover:-translate-y-1 hover:shadow-glow",
        "transition-all duration-500",
        mobile ? "snap-start shrink-0 w-[78%] aspect-[3/4]" : tall ? "row-span-2" : "row-span-1",
      ].join(" ")}
    >
      {/* blurred backdrop = no cropping, no empty bars */}
      <img
        src={item.image_url}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-40"
      />
      <div className="absolute inset-0 bg-black/30" />

      {/* main media — full face, no crop */}
      {item.media_type === "video" ? (
        <video
          src={item.image_url}
          controls
          playsInline
          preload="metadata"
          className="relative z-[1] w-full h-full object-contain bg-black"
        />
      ) : (
        <img
          src={item.image_url}
          alt={item.title ?? "תלמיד שעבר טסט בהצלחה"}
          loading={index < 2 ? "eager" : "lazy"}
          fetchPriority={index < 2 ? "high" : "low"}
          decoding="async"
          sizes={mobile ? "78vw" : "(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"}
          className="relative z-[1] w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-700"
        />
      )}

      {/* readability gradient on top of main image */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none" />

      {/* top badges */}
      <div className="absolute z-[3] top-2.5 right-2.5 left-2.5 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-primary text-white px-2.5 py-1 text-[10px] font-black shadow-glow">
          <Check size={11} strokeWidth={3} />
          עבר/ה טסט
        </span>
        {item.isFirstTry && (
          <span className="rounded-full glass-strong border border-white/15 px-2 py-0.5 text-[10px] font-bold text-white">
            טסט ראשון
          </span>
        )}
      </div>

      {/* caption */}
      <div className="absolute z-[3] bottom-0 inset-x-0 p-3 sm:p-3.5 text-white">
        <div className="font-black text-sm sm:text-base leading-tight">{item.caption}</div>
      </div>
    </motion.article>
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
            תכירו את <span className="gradient-text-blue">חן כחלון</span>
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
              <span className="relative grid place-items-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-blue text-white shadow-glow group-hover:scale-110 transition-transform">
                <Play size={36} className="ml-1" fill="currentColor" />
                <span className="absolute inset-0 rounded-full bg-[oklch(0.62_0.20_255)] -z-10 animate-pulse-ring" />
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
  { platform: "instagram" as const, caption: "תלמידה עברה טסט מהפעם הראשונה 🎉", likes: "248", grad: "from-[oklch(0.62_0.20_255)] to-[oklch(0.55_0.22_330)]" },
  { platform: "tiktok" as const, caption: "טיפ חשוב לפני טסט אופנוע 🏍️", likes: "1.2K", grad: "from-[oklch(0.20_0.02_260)] to-[oklch(0.10_0.02_260)]" },
  { platform: "instagram" as const, caption: "שיעור ראשון על הכלי החדש 🚗", likes: "189", grad: "from-[oklch(0.62_0.20_255)] to-[oklch(0.4_0.18_280)]" },
  { platform: "tiktok" as const, caption: "מה לבדוק לפני יציאה לכביש?", likes: "892", grad: "from-[oklch(0.78_0.20_55)] to-[oklch(0.5_0.22_30)]" },
];
function SocialFeed() {
  const s = useSiteSettings();
  const instagram = s.social.instagram || INSTAGRAM;
  const tiktok = s.social.tiktok || TIKTOK;
  return (
    <section id="social" className="py-7 sm:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-5 sm:mb-14">
          <p className="gradient-text-blue font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">עקבו אחריי</p>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl">
            הסיפורים שלי <span className="gradient-text-blue">ברשתות</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">תכנים חדשים, טיפים, ורגעים מתוך השיעורים — מוזמנים להצטרף.</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {socialPosts.map((p, i) => {
            const href = p.platform === "tiktok" ? tiktok : instagram;
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
          <a href={instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-blue px-5 py-3 text-sm font-bold text-white shadow-glow hover:scale-105 transition">
            <Instagram size={16} /> עקבו באינסטגרם
          </a>
          <a href={tiktok} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full glass-strong border border-white/10 px-5 py-3 text-sm font-bold hover:bg-white/5 transition">
            <TikTokIcon className="w-4 h-4" /> בטיקטוק
          </a>
        </div>
      </div>
    </section>
  );
}

function LandingPage() {
  const { initialSettings } = Route.useLoaderData() as { initialSettings: SiteSettings };
  return (
    <SiteSettingsProvider initialSettings={initialSettings}>
      <SiteSettingsRuntime />
      <LandingPageInner />
    </SiteSettingsProvider>
  );
}

function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [underline, setUnderline] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale * 100}%`;
  }, [fontScale]);

  useEffect(() => {
    document.documentElement.classList.toggle("a11y-contrast", highContrast);
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.classList.toggle("a11y-underline", underline);
  }, [underline]);

  const reset = () => {
    setFontScale(1);
    setHighContrast(false);
    setUnderline(false);
  };

  return (
    <>
      <style>{`
        html.a11y-contrast { filter: contrast(1.35) saturate(1.2); }
        html.a11y-underline a { text-decoration: underline !important; }
      `}</style>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="פתיחת תפריט נגישות"
        aria-expanded={open}
        className="fixed bottom-20 md:bottom-6 right-4 z-[60] h-11 w-11 md:h-14 md:w-14 rounded-full bg-[oklch(0.55_0.22_255)] hover:bg-[oklch(0.62_0.22_255)] text-white shadow-glow flex items-center justify-center border-2 border-white/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40 transition-colors"
      >
        <Accessibility className="!size-5 md:!size-7" />
      </button>

      {open && (
        <div
          dir="rtl"
          role="dialog"
          aria-label="תפריט נגישות"
          className="fixed bottom-32 md:bottom-24 right-4 z-[60] w-72 max-w-[calc(100vw-2rem)] glass-strong border border-white/10 rounded-2xl p-4 shadow-card text-foreground"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Accessibility className="size-5 text-[oklch(0.7_0.18_255)]" />
              תפריט נגישות
            </h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="סגירה"
              className="h-8 w-8 rounded-md hover:bg-white/10 flex items-center justify-center"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 bg-white/5 rounded-lg p-2">
              <span className="text-sm">גודל טקסט</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setFontScale((s) => Math.max(0.85, +(s - 0.1).toFixed(2)))}
                  aria-label="הקטנת טקסט"
                  className="h-8 w-8 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center"
                >
                  <Minus className="size-4" />
                </button>
                <span className="text-xs w-10 text-center tabular-nums">{Math.round(fontScale * 100)}%</span>
                <button
                  type="button"
                  onClick={() => setFontScale((s) => Math.min(1.5, +(s + 0.1).toFixed(2)))}
                  aria-label="הגדלת טקסט"
                  className="h-8 w-8 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setHighContrast((v) => !v)}
              aria-pressed={highContrast}
              className={`w-full flex items-center justify-between gap-2 rounded-lg p-2 text-sm transition-colors ${highContrast ? "bg-[oklch(0.55_0.22_255)] text-white" : "bg-white/5 hover:bg-white/10"}`}
            >
              <span className="flex items-center gap-2"><Contrast className="size-4" /> ניגודיות גבוהה</span>
              <span className="text-xs opacity-80">{highContrast ? "פעיל" : "כבוי"}</span>
            </button>

            <button
              type="button"
              onClick={() => setUnderline((v) => !v)}
              aria-pressed={underline}
              className={`w-full flex items-center justify-between gap-2 rounded-lg p-2 text-sm transition-colors ${underline ? "bg-[oklch(0.55_0.22_255)] text-white" : "bg-white/5 hover:bg-white/10"}`}
            >
              <span>הדגשת קישורים</span>
              <span className="text-xs opacity-80">{underline ? "פעיל" : "כבוי"}</span>
            </button>

            <button
              type="button"
              onClick={reset}
              className="w-full flex items-center justify-center gap-2 rounded-lg p-2 text-sm bg-white/5 hover:bg-white/10"
            >
              <RotateCcw className="size-4" /> איפוס
            </button>
          </div>

          <p className="mt-3 text-[11px] text-muted-foreground leading-relaxed">
            האתר פועל לעמידה בתקן הנגישות הישראלי (ת"י 5568) ברמת AA.
          </p>
        </div>
      )}
    </>
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
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {hydrated && <Toaster position="top-center" theme="dark" richColors />}
      <Nav />
      <main className="pb-24 md:pb-0">
        <Hero />
        <Categories />
        <LicenseMatcher />
        <About />
        <WhyMe />
        <LeadForm />
        <FinalCTA />
        <SuccessGallery />
        <VideoIntro />
        <SocialFeed />
        <Reviews />
        <FAQ />
      </main>
      <Footer />
      <MobileBar />
      <AccessibilityWidget />
      {hydrated && <ExitIntent />}
    </div>
  );
}
