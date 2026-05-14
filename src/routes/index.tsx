import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import {
  Phone, MessageCircle, Instagram, Facebook, Mail, Star, Car, Bike,
  Users, Award, Clock, Shield, Sparkles, MapPin, ChevronDown, Check,
  ArrowLeft, Zap, Heart, GraduationCap, Send, Trophy, Calendar, UserCheck,
  Smile,
} from "lucide-react";
import heroImg from "@/assets/hero-driving.jpg";
import portraitImg from "@/assets/instructor-portrait.jpg";
import vehSedan from "@/assets/vehicle-sedan.png";
import vehBikeA2 from "@/assets/vehicle-bike-a2.png";
import vehScooter from "@/assets/vehicle-scooter.png";
import vehBikeA from "@/assets/vehicle-bike-a.png";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

const PHONE = "0503250150";
const PHONE_DISPLAY = "050-3250150";
const PHONE_INTL = "972503250150";
const WA_DEFAULT_MSG = "היי חן, הגעתי דרך האתר ואני מעוניין לקבל פרטים על שיעורי נהיגה";
const WA_URL = `https://wa.me/${PHONE_INTL}?text=${encodeURIComponent(WA_DEFAULT_MSG)}`;
const INSTAGRAM = "https://instagram.com";
const FACEBOOK = "https://facebook.com";
const TIKTOK = "https://tiktok.com";
const EMAIL = "hen1kahlon@gmail.com";

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
  return (
    <section id="top" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* glow background */}
      <div className="absolute inset-0 -z-10 grid-bg">
        <div className="absolute -top-32 -right-32 w-[40rem] h-[40rem] rounded-full bg-[oklch(0.62_0.20_255_/_0.25)] blur-[120px] animate-float-slow" />
        <div className="absolute -bottom-40 -left-32 w-[40rem] h-[40rem] rounded-full bg-[oklch(0.72_0.18_50_/_0.28)] blur-[120px] animate-float-slow" style={{ animationDelay: "3s" }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
        {/* image - mobile: top, desktop: right (visually first in RTL = right side) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative lg:col-span-7 order-1 lg:order-2"
        >
          <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-white/10 shadow-glow">
            <img src={heroImg} alt="חן כחלון בשיעור נהיגה עם תלמידה" width={1920} height={1080} className="w-full h-full object-cover" />
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
              <div className="text-xl sm:text-2xl font-black gradient-text-orange leading-none">98%</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">הצלחה בטסט</div>
            </div>
          </div>
        </motion.div>

        {/* text */}
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="lg:col-span-5 order-2 lg:order-1 text-center lg:text-right">
          <div className="inline-flex items-center gap-2 rounded-full glass-strong border border-white/10 px-4 py-1.5 mb-5 text-xs font-medium">
            <Sparkles size={13} className="text-accent" />
            <span>5 שנות ותק · רכב ואופנועים · אשקלון</span>
          </div>
          <h1 className="text-display text-[2.5rem] sm:text-5xl lg:text-[3.75rem] mb-3">
            מוציאים רישיון<br />
            <span className="gradient-text-blue">בביטחון</span>
          </h1>
          <p className="text-display text-2xl sm:text-3xl lg:text-4xl gradient-text-orange mb-5">
            עד ההצלחה!
          </p>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
            שיעורי נהיגה לרכב אוטומט ואופנועים באווירה צעירה, מקצועית וסבלנית — עם מורה שמלווה אותך עד הקריאה ״עברת!״
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
            <button type="button" onClick={scrollToLead} className="group inline-flex items-center gap-2 rounded-full bg-gradient-orange px-6 py-3.5 font-bold text-white shadow-glow-orange hover:scale-105 transition">
              התחל ללמוד עכשיו
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition" />
            </button>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 font-bold text-white hover:scale-105 transition shadow-card animate-pulse-ring relative">
              <MessageCircle size={18} /> וואטסאפ
            </a>
            <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 rounded-full glass-strong border border-white/10 px-5 py-3.5 font-bold hover:bg-white/5 transition">
              <Phone size={18} /> התקשר
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
    <section id="categories" className="py-20 sm:py-28 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12 sm:mb-16">
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
    <section id="about" className="py-20 sm:py-28 px-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 grid-bg opacity-40" />
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-96 h-96 rounded-full bg-[oklch(0.72_0.18_50_/_0.12)] blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div {...fadeUp} className="relative order-2 lg:order-1">
          <div className="aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 shadow-glow ring-glow-blue">
            <img src={portraitImg} alt="חן כחלון - מורה נהיגה" loading="lazy" width={800} height={1000} className="w-full h-full object-cover" />
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
    <section id="why" className="py-20 sm:py-28 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12 sm:mb-16">
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

const reviews = [
  { name: "ליאור מ׳", text: "חן הכי סבלני בעולם, עברתי טסט ראשון! ממליץ בחום על המקצועיות והאווירה.", rating: 5 },
  { name: "נועה ש׳", text: "אווירה כיפית ומקצועית, הרגשתי בטוחה כל הדרך. מורה מדהים ומסור.", rating: 5 },
  { name: "יובל א׳", text: "למדתי אופנוע אצל חן — חוויה מטורפת. רישיון ביד מהפעם הראשונה!", rating: 5 },
  { name: "דניאל מ׳", text: "מורה צעיר, מקצועי וסבלני. ממליץ בחום לכל מי שמחפש מורה רציני.", rating: 5 },
];

function Reviews() {
  return (
    <section id="reviews" className="py-20 sm:py-28 px-4 relative">
      <div className="absolute inset-0 -z-10 grid-bg opacity-30" />
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12 sm:mb-16">
          <p className="gradient-text-orange font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">המלצות תלמידים</p>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl">
            מה <span className="gradient-text-orange">אומרים עליי</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card rounded-3xl p-5 border border-white/5 hover:border-white/15 transition"
            >
              <div className="flex gap-0.5 mb-3">
                {[...Array(r.rating)].map((_, j) => <Star key={j} size={15} className="fill-[oklch(0.78_0.18_55)] text-[oklch(0.78_0.18_55)]" />)}
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed mb-5 min-h-[80px]">"{r.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-blue grid place-items-center text-white font-black text-sm">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm">{r.name}</p>
                  <p className="text-[11px] text-muted-foreground">תלמיד/ה</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LeadForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", interest: "רכב אוטומט דרגה B", area: "אשקלון", notes: "" });

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
    <section id="lead" className="py-20 sm:py-28 px-4 relative overflow-hidden">
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
          <p className="text-muted-foreground mb-8">שיעורים בכל אזור אשקלון והסביבה בהתאמה מלאה לזמן ולמיקום שלך.</p>

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
  { q: "כמה זמן לוקח להוציא רישיון?", a: "תלוי בקצב התלמיד, בדרך כלל בין 2-4 חודשים מהשיעור הראשון ועד הטסט." },
  { q: "באיזה אזורים מתקיימים השיעורים?", a: "אשקלון והסביבה — כולל איסוף מהבית במידת האפשר." },
  { q: "האם אפשר ללמוד גם רכב וגם אופנוע?", a: "בהחלט! אני מלמד את שני התחומים ואפשר לשלב." },
  { q: "איך קובעים שיעור ראשון?", a: "פשוט שולחים הודעת וואטסאפ או מתקשרים — ונמצא יחד את הזמן הכי נוח לכם." },
  { q: "איזה דרגות אופנוע אפשר ללמוד?", a: "כל הדרגות: A1, A2 ו-A מלא." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-20 sm:py-28 px-4">
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
                <div className="px-5 pb-5 text-muted-foreground leading-relaxed">{f.a}</div>
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
    <section className="py-20 sm:py-28 px-4 relative overflow-hidden">
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
    <footer className="border-t border-white/5 py-12 px-4 pb-28 md:pb-12 relative">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 text-sm">
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
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} חן כחלון - מורה נהיגה. כל הזכויות שמורות.
      </div>
    </footer>
  );
}

function FloatingWA() {
  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="פתח וואטסאפ"
      className="fixed bottom-24 md:bottom-6 left-4 md:left-6 z-50 inline-flex items-center gap-2 h-14 md:h-16 px-4 md:px-5 rounded-full bg-[#25D366] text-white font-bold shadow-[0_10px_40px_-10px_rgba(37,211,102,0.8)] hover:scale-105 transition animate-bounce-slow"
    >
      <span className="relative grid place-items-center w-9 h-9 rounded-full bg-white/15">
        <MessageCircle size={22} />
        <span className="absolute inset-0 rounded-full bg-[#25D366] -z-10 animate-pulse-ring" />
      </span>
      <span className="hidden sm:inline text-sm whitespace-nowrap">דברו איתי בוואטסאפ</span>
    </a>
  );
}

function MobileBar() {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 glass-strong border-t border-white/10">
      <div className="grid grid-cols-3 gap-1 p-2">
        <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 py-2 rounded-xl bg-[#25D366] text-white shadow-[0_8px_20px_-8px_rgba(37,211,102,0.8)]">
          <MessageCircle size={20} />
          <span className="text-[11px] font-bold">וואטסאפ</span>
        </a>
        <a href={`tel:${PHONE}`} className="flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-white/5 transition">
          <Phone size={20} className="text-[oklch(0.7_0.18_255)]" />
          <span className="text-[11px] font-bold">שיחה</span>
        </a>
        <a href="#lead" className="flex flex-col items-center gap-1 py-2 rounded-xl bg-gradient-orange text-white">
          <Sparkles size={20} />
          <span className="text-[11px] font-bold">השאר פרטים</span>
        </a>
      </div>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-center" theme="dark" richColors />
      <Nav />
      <main>
        <Hero />
        <Categories />
        <About />
        <WhyMe />
        <Reviews />
        <LeadForm />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingWA />
      <MobileBar />
    </div>
  );
}
