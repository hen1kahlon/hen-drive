import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import {
  Phone, MessageCircle, Instagram, Facebook, Mail, Star, Car, Bike,
  Users, Award, Clock, Shield, Sparkles, MapPin, ChevronDown, Check,
  ArrowLeft, Zap, Heart, GraduationCap,
} from "lucide-react";
import heroImg from "@/assets/hero-driving.jpg";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

const PHONE = "0503250150";
const PHONE_INTL = "972503250150";
const WA_URL = `https://wa.me/${PHONE_INTL}?text=${encodeURIComponent("היי חן, אשמח לפרטים על שיעורי נהיגה")}`;
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

function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 font-extrabold text-lg">
          <span className="w-9 h-9 rounded-xl bg-gradient-accent grid place-items-center text-primary-foreground">חכ</span>
          <span className="hidden sm:inline">חן כחלון</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#about" className="hover:text-foreground transition">אודות</a>
          <a href="#categories" className="hover:text-foreground transition">דרגות</a>
          <a href="#why" className="hover:text-foreground transition">למה אני</a>
          <a href="#reviews" className="hover:text-foreground transition">המלצות</a>
          <a href="#faq" className="hover:text-foreground transition">שאלות</a>
        </nav>
        <a href={`tel:${PHONE}`} className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-accent px-4 py-2 text-sm font-bold text-primary-foreground shadow-glow hover:scale-105 transition">
          <Phone size={16} /> {PHONE}
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img src={heroImg} alt="שיעור נהיגה עם חן כחלון" width={1920} height={1080} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-background via-background/85 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[oklch(0.62_0.20_255_/_0.25)] blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 -left-32 w-96 h-96 rounded-full bg-[oklch(0.72_0.18_50_/_0.25)] blur-3xl animate-float-slow" style={{ animationDelay: "3s" }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-2 gap-12 items-center w-full">
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-border glass px-4 py-1.5 mb-6 text-xs font-medium">
            <Sparkles size={14} className="text-accent" />
            <span>5 שנות ותק · רכב ואופנועים · אשקלון</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-6">
            מוציאים רישיון <span className="gradient-text">בביטחון</span>
            <br />עם מורה שמלווה אותך עד ההצלחה
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl">
            שיעורי נהיגה לרכב אוטומט ואופנועים באווירה צעירה, מקצועית וסבלנית.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#lead" className="group inline-flex items-center gap-2 rounded-full bg-gradient-accent px-6 py-3.5 font-bold text-primary-foreground shadow-glow hover:scale-105 transition">
              אני רוצה להתחיל ללמוד
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition" />
            </a>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 font-bold text-white hover:scale-105 transition shadow-card">
              <MessageCircle size={18} /> שלחו וואטסאפ
            </a>
            <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 rounded-full border border-border glass px-6 py-3.5 font-bold hover:bg-secondary transition">
              <Phone size={18} /> התקשרו עכשיו
            </a>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Award size={18} className="text-accent" /> אחוזי הצלחה גבוהים</div>
            <div className="flex items-center gap-2"><Shield size={18} className="text-primary" /> כלים חדשים</div>
          </div>
        </motion.div>
      </div>

      <a href="#categories" aria-label="גלול למטה" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground animate-bounce">
        <ChevronDown size={28} />
      </a>
    </section>
  );
}

const categories = [
  { id: "B", title: "רכב אוטומט דרגה B", desc: "רכב פרטי אוטומט – הדרגה הפופולרית והמבוקשת ביותר.", icon: Car },
  { id: "A2", title: "אופנוע דרגה A2", desc: "אופנועים בינוניים עד 35kW – חופש ושליטה.", icon: Bike },
  { id: "A1", title: "אופנוע דרגה A1", desc: "אופנועים קלים עד 125 סמ״ק – מצוין להתחלה.", icon: Zap },
  { id: "A", title: "אופנוע דרגה A", desc: "כל סוגי האופנועים – ללא הגבלת הספק.", icon: Bike },
];

function Categories() {
  return (
    <section id="categories" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-accent font-bold text-sm tracking-wider uppercase mb-3">בחר את הדרגה שלך</p>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">מה <span className="gradient-text">תרצה ללמוד</span>?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">בחרו את סוג הרישיון שמתאים לכם – ונתחיל יחד את הדרך</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative bg-card rounded-3xl p-6 border border-border shadow-card hover:shadow-glow hover:-translate-y-1 transition-all"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-accent opacity-0 group-hover:opacity-10 transition" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-accent grid place-items-center mb-5 text-primary-foreground shadow-glow">
                  <c.icon size={26} />
                </div>
                <h3 className="text-xl font-bold mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{c.desc}</p>
                <a href={`${WA_URL.split("?")[0]}?text=${encodeURIComponent(`היי חן, אשמח לפרטים על ${c.title}`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:gap-3 transition-all">
                  אני מעוניין בפרטים <ArrowLeft size={16} />
                </a>
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
    "ותק של 5 שנים",
    "לימוד על רכב ואופנועים",
    "כלים חדשים ומתקדמים",
    "יחס אישי לכל תלמיד",
    "אווירה צעירה וסבלנית",
    "הכנה אמיתית לטסט",
    "אחוזי הצלחה גבוהים",
  ];
  return (
    <section id="about" className="py-24 px-4 bg-secondary/30">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div {...fadeUp}>
          <p className="text-accent font-bold text-sm tracking-wider uppercase mb-3">קצת עליי</p>
          <h2 className="text-4xl sm:text-5xl font-black mb-6">נעים מאוד, <span className="gradient-text">חן כחלון</span></h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            מורה נהיגה בעל ותק של 5 שנים בתחום הרכב והאופנועים. אני מאמין בלימוד נהיגה בגישה אישית, רגועה ומקצועית, עם התאמה מלאה לקצב של כל תלמיד. השיעורים מתבצעים על כלים חדשים, נוחים ובטיחותיים, באווירה צעירה, סבלנית ומכבדת — עד שמגיעים מוכנים ובטוחים לטסט.
          </p>
          <ul className="grid sm:grid-cols-2 gap-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-center gap-3 text-sm">
                <span className="w-6 h-6 rounded-full bg-gradient-accent grid place-items-center text-primary-foreground flex-shrink-0">
                  <Check size={14} strokeWidth={3} />
                </span>
                <span className="font-medium">{b}</span>
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div {...fadeUp} className="relative">
          <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-glow border border-border">
            <img src={heroImg} alt="חן כחלון בשיעור נהיגה" loading="lazy" width={800} height={1000} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-card border border-border rounded-2xl p-5 shadow-card max-w-[200px]">
            <div className="flex items-center gap-2 mb-1">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-accent text-accent" />)}
            </div>
            <p className="text-sm font-bold">5 שנות ותק</p>
            <p className="text-xs text-muted-foreground">מאות תלמידים מרוצים</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const reasons = [
  { icon: Heart, title: "יחס אישי וסבלני", desc: "כל תלמיד מקבל התייחסות מלאה והתאמה לקצב שלו." },
  { icon: Sparkles, title: "אווירה צעירה ונעימה", desc: "שיעור שמרגיש כמו זמן עם חבר טוב." },
  { icon: Shield, title: "כלים חדשים ובטיחותיים", desc: "רכבים ואופנועים מהדור החדש." },
  { icon: GraduationCap, title: "ליווי מקצועי עד הטסט", desc: "מהשיעור הראשון ועד הקריאה ׳עברת!׳." },
  { icon: Clock, title: "זמינות ונוחות", desc: "קביעת שיעורים גמישה לפי הזמן שלך." },
  { icon: Award, title: "אחוזי הצלחה גבוהים", desc: "תוצאות אמיתיות שמדברות בעד עצמן." },
];

function WhyMe() {
  return (
    <section id="why" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-accent font-bold text-sm tracking-wider uppercase mb-3">היתרונות שלי</p>
          <h2 className="text-4xl sm:text-5xl font-black">למה לבחור <span className="gradient-text">בחן</span>?</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="bg-card rounded-3xl p-7 border border-border shadow-card hover:shadow-glow hover:-translate-y-1 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl glass border border-border grid place-items-center mb-5">
                <r.icon size={22} className="text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">{r.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Areas() {
  return (
    <section className="py-20 px-4 bg-secondary/30">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div {...fadeUp}>
          <div className="inline-flex items-center gap-2 rounded-full glass border border-border px-5 py-2 mb-6">
            <MapPin size={16} className="text-accent" />
            <span className="text-sm font-medium">איפה לומדים</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">אזורי <span className="gradient-text">לימוד</span></h2>
          <p className="text-2xl font-bold text-foreground/90">אשקלון והסביבה</p>
        </motion.div>
      </div>
    </section>
  );
}

const reviews = [
  { name: "ליאור מ׳", text: "חן הכי סבלני בעולם, עברתי טסט ראשון! ממליץ בחום.", rating: 5 },
  { name: "נועה ש׳", text: "אווירה כיפית ומקצועית, הרגשתי בטוחה כל הדרך.", rating: 5 },
  { name: "יובל א׳", text: "למדתי אופנוע אצל חן – חוויה מטורפת. רישיון ביד!", rating: 5 },
];

function Reviews() {
  return (
    <section id="reviews" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-accent font-bold text-sm tracking-wider uppercase mb-3">המלצות</p>
          <h2 className="text-4xl sm:text-5xl font-black">תלמידים <span className="gradient-text">מספרים</span></h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card rounded-3xl p-7 border border-border shadow-card"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(r.rating)].map((_, j) => <Star key={j} size={18} className="fill-accent text-accent" />)}
              </div>
              <p className="text-foreground/90 leading-relaxed mb-5">"{r.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-accent grid place-items-center text-primary-foreground font-bold">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">תלמיד/ה</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp}>
          <h3 className="text-2xl font-bold text-center mb-8">תלמידים שעברו טסט <span className="gradient-text">בהצלחה</span></h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-square rounded-2xl glass border border-border grid place-items-center text-muted-foreground hover:border-accent/50 transition">
                <div className="text-center">
                  <Users size={28} className="mx-auto mb-1 opacity-50" />
                  <p className="text-xs">תמונת תלמיד</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function LeadForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", interest: "רכב אוטומט דרגה B", area: "", notes: "" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("נא למלא שם וטלפון");
      return;
    }
    // mailto fallback + WhatsApp option
    const body = `שם: ${form.name}%0Aטלפון: ${form.phone}%0Aמעוניין: ${form.interest}%0Aאזור: ${form.area}%0Aהערות: ${form.notes}`;
    const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent("ליד חדש מהאתר")}&body=${body}`;
    // Open mailto in background
    window.open(mailto, "_blank");
    setSubmitted(true);
    toast.success("תודה! הפרטים התקבלו, חן יחזור אליך בהקדם.");
  };

  return (
    <section id="lead" className="py-24 px-4 bg-secondary/30">
      <div className="max-w-3xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-10">
          <p className="text-accent font-bold text-sm tracking-wider uppercase mb-3">השאירו פרטים</p>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">מתחילים את <span className="gradient-text">הדרך</span></h2>
          <p className="text-muted-foreground">השאר/י פרטים וחן יחזור אליך תוך זמן קצר</p>
        </motion.div>

        <motion.div {...fadeUp} className="bg-card rounded-3xl p-6 sm:p-10 border border-border shadow-card">
          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-accent grid place-items-center text-primary-foreground">
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
              <Field label="שם מלא *">
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-input border border-border rounded-xl px-4 py-3 outline-none focus:border-accent transition" placeholder="ישראל ישראלי" />
              </Field>
              <Field label="טלפון *">
                <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-input border border-border rounded-xl px-4 py-3 outline-none focus:border-accent transition" placeholder="050-0000000" />
              </Field>
              <Field label="מה מעניין אותך ללמוד?">
                <select value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })}
                  className="w-full bg-input border border-border rounded-xl px-4 py-3 outline-none focus:border-accent transition">
                  <option>רכב אוטומט דרגה B</option>
                  <option>אופנוע A2</option>
                  <option>אופנוע A1</option>
                  <option>אופנוע A</option>
                </select>
              </Field>
              <Field label="אזור מגורים">
                <input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })}
                  className="w-full bg-input border border-border rounded-xl px-4 py-3 outline-none focus:border-accent transition" placeholder="אשקלון" />
              </Field>
              <Field label="הערות נוספות">
                <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full bg-input border border-border rounded-xl px-4 py-3 outline-none focus:border-accent transition resize-none" placeholder="כל מה שחשוב שנדע..." />
              </Field>
              <button type="submit" className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-accent px-6 py-4 font-bold text-primary-foreground shadow-glow hover:scale-[1.02] transition">
                שלח/י פרטים <ArrowLeft size={18} />
              </button>
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
      <span className="block text-sm font-bold mb-2">{label}</span>
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
    <section id="faq" className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12">
          <p className="text-accent font-bold text-sm tracking-wider uppercase mb-3">שאלות נפוצות</p>
          <h2 className="text-4xl sm:text-5xl font-black">כל מה ש<span className="gradient-text">חשוב לדעת</span></h2>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-card rounded-2xl border border-border overflow-hidden"
            >
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-right font-bold hover:bg-secondary/50 transition">
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
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-accent opacity-10" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/30 blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-accent/30 blur-3xl animate-float-slow" style={{ animationDelay: "2s" }} />
      </div>
      <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl sm:text-6xl font-black mb-4">מתחילים את הדרך <span className="gradient-text">לרישיון</span>?</h2>
        <p className="text-lg text-muted-foreground mb-10">דבר אחד מפריד בינך לבין הרישיון — ההחלטה שלך</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-4 font-bold text-white hover:scale-105 transition shadow-glow">
            <MessageCircle size={20} /> שלחו הודעה בוואטסאפ
          </a>
          <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 rounded-full bg-gradient-accent px-7 py-4 font-bold text-primary-foreground hover:scale-105 transition shadow-glow">
            <Phone size={20} /> התקשרו עכשיו
          </a>
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-12 px-4 pb-28 md:pb-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2 font-extrabold text-lg mb-3">
            <span className="w-9 h-9 rounded-xl bg-gradient-accent grid place-items-center text-primary-foreground">חכ</span>
            חן כחלון
          </div>
          <p className="text-muted-foreground">מורה נהיגה לרכב ואופנוע</p>
        </div>
        <div>
          <h4 className="font-bold mb-3">צור קשר</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><a href={`tel:${PHONE}`} className="hover:text-foreground inline-flex items-center gap-2"><Phone size={14} /> {PHONE}</a></li>
            <li><a href={`mailto:${EMAIL}`} className="hover:text-foreground inline-flex items-center gap-2"><Mail size={14} /> {EMAIL}</a></li>
            <li className="inline-flex items-center gap-2"><MapPin size={14} /> אשקלון והסביבה</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">עקבו אחריי</h4>
          <div className="flex gap-3">
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-11 h-11 rounded-full glass border border-border grid place-items-center hover:bg-gradient-accent hover:border-transparent transition">
              <Instagram size={18} />
            </a>
            <a href={FACEBOOK} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-11 h-11 rounded-full glass border border-border grid place-items-center hover:bg-gradient-accent hover:border-transparent transition">
              <Facebook size={18} />
            </a>
            <a href={TIKTOK} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-11 h-11 rounded-full glass border border-border grid place-items-center hover:bg-gradient-accent hover:border-transparent transition">
              <TikTokIcon className="w-[18px] h-[18px]" />
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} חן כחלון - מורה נהיגה. כל הזכויות שמורות.
      </div>
    </footer>
  );
}

function FloatingWA() {
  return (
    <a href={WA_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
      className="fixed bottom-24 md:bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-[#25D366] grid place-items-center text-white shadow-glow hover:scale-110 transition relative">
      <MessageCircle size={26} />
      <span className="absolute inset-0 rounded-full bg-[#25D366] -z-10 animate-pulse-ring" />
    </a>
  );
}

function MobileBar() {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-border">
      <div className="grid grid-cols-3 gap-1 p-2">
        <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-secondary transition">
          <MessageCircle size={20} className="text-[#25D366]" />
          <span className="text-xs font-bold">וואטסאפ</span>
        </a>
        <a href={`tel:${PHONE}`} className="flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-secondary transition">
          <Phone size={20} className="text-primary" />
          <span className="text-xs font-bold">שיחה</span>
        </a>
        <a href="#lead" className="flex flex-col items-center gap-1 py-2 rounded-xl bg-gradient-accent text-primary-foreground">
          <Sparkles size={20} />
          <span className="text-xs font-bold">השארת פרטים</span>
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
        <Areas />
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
