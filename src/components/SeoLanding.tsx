import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Phone, MessageCircle, Check, Star, ChevronDown, MapPin,
  Trophy, ArrowLeft, Shield, GraduationCap, Bike, Car, Send, X,
} from "lucide-react";
import { useSiteSettings, waUrl } from "@/lib/site-settings";
import { supabase } from "@/integrations/supabase/client";

export type SeoFaq = { q: string; a: string };
export type SeoReview = { name: string; text: string; type: string };
export type RelatedLink = { to: string; title: string };

export type SeoLandingProps = {
  eyebrow: string;
  h1Lead: string;
  h1Highlight: string;
  intro: string;
  highlights: { icon: "bike" | "car" | "shield" | "grad" | "trophy"; title: string; body: string }[];
  faqs: SeoFaq[];
  reviews: SeoReview[];
  related: RelatedLink[];
  waMessage: string;
  ctaSubline: string;
  slug?: string;
  licenseTiers?: { code: string; title: string; image: string; body: string; transmission?: string; waMessage?: string }[];
};

const ICONS = {
  bike: Bike, car: Car, shield: Shield, grad: GraduationCap, trophy: Trophy,
} as const;

export default function SeoLanding(initial: SeoLandingProps) {
  const [props, setProps] = useState(initial);
  useEffect(() => {
    if (!initial.slug) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from("landing_pages").select("hero, highlights, reviews, faqs, related").eq("slug", initial.slug!).eq("is_active", true).maybeSingle();
      if (cancelled || !data) return;
      const row = data as any;
      const hero = (row.hero ?? {}) as Partial<SeoLandingProps>;
      setProps((p) => ({
        ...p,
        eyebrow: hero.eyebrow || p.eyebrow,
        h1Lead: hero.h1Lead || p.h1Lead,
        h1Highlight: hero.h1Highlight || p.h1Highlight,
        intro: hero.intro || p.intro,
        ctaSubline: hero.ctaSubline || p.ctaSubline,
        waMessage: hero.waMessage || p.waMessage,
        highlights: Array.isArray(row.highlights) && row.highlights.length ? (row.highlights as SeoLandingProps["highlights"]) : p.highlights,
        reviews: Array.isArray(row.reviews) && row.reviews.length ? (row.reviews as SeoReview[]) : p.reviews,
        faqs: Array.isArray(row.faqs) && row.faqs.length ? (row.faqs as SeoFaq[]) : p.faqs,
        related: Array.isArray(row.related) && row.related.length ? (row.related as RelatedLink[]) : p.related,
      }));
    })();
    return () => { cancelled = true; };
  }, [initial.slug]);
  const s = useSiteSettings();
  const wa = waUrl(s, props.waMessage);
  const tel = `tel:${s.contact.phone}`;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      {/* Top nav */}
      <header className="sticky top-0 z-40 bg-background/95 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-sm">
            <ArrowLeft size={16} /> חזרה לאתר
          </Link>
          <a href={wa} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-4 py-2 text-xs font-bold">
            <MessageCircle size={14} /> וואטסאפ
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-4 pt-10 pb-12 sm:pt-16 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[oklch(0.16_0.04_255)] via-background to-background" />
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-primary mb-3">
            {props.eyebrow}
          </p>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight">
            {props.h1Lead}{" "}
            <span className="bg-gradient-to-l from-[oklch(0.75_0.18_255)] to-[oklch(0.65_0.22_220)] bg-clip-text text-transparent">
              {props.h1Highlight}
            </span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            {props.intro}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href={wa} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-6 py-3 text-sm font-bold shadow-[0_10px_30px_-10px_rgba(37,211,102,0.7)]">
              <MessageCircle size={18} /> שלחו וואטסאפ עכשיו
            </a>
            <a href={tel}
               className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold">
              <Phone size={18} /> {s.contact.phone_display}
            </a>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin size={12} /> אשקלון והסביבה</span>
            <span className="inline-flex items-center gap-1"><Star size={12} className="fill-[#FBBC04] text-[#FBBC04]" /> 5.0 · 120+ המלצות</span>
            <span className="inline-flex items-center gap-1"><Trophy size={12} /> 98% טסט ראשון</span>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="px-4 py-10 sm:py-14">
        <div className="max-w-5xl mx-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {props.highlights.map((h, i) => {
            const Icon = ICONS[h.icon];
            return (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="w-10 h-10 rounded-xl bg-primary/15 grid place-items-center mb-3">
                  <Icon size={20} className="text-primary" />
                </div>
                <h3 className="font-bold mb-1">{h.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{h.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Reviews */}
      <section className="px-4 py-10 sm:py-14 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <div className="mx-auto mb-6 max-w-lg rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1" aria-label="דירוג 5 כוכבים">
              {[...Array(5)].map((_, k) => (
                <Star key={k} size={18} className="fill-[oklch(0.82_0.17_85)] text-[oklch(0.82_0.17_85)]" />
              ))}
              <span className="font-black tabular-nums">5.0</span>
            </div>
          <p className="text-xs text-muted-foreground">120+ תלמידים ממליצים · בית ספר לנהיגה באשקלון</p>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-2">המלצות תלמידים</h2>
          <p className="text-center text-sm text-muted-foreground mb-8">
            סיפורי הצלחה אמיתיים מאשקלון והסביבה
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {props.reviews.map((r, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-background p-5 shadow-card">
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, k) => (
                    <Star key={k} size={14} className="fill-[oklch(0.82_0.17_85)] text-[oklch(0.82_0.17_85)]" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-3">{r.text}</p>
                <p className="text-xs font-bold text-muted-foreground">{r.name} · {r.type}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a href={wa} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center justify-center gap-2 rounded-full bg-[oklch(0.74_0.18_145)] text-white px-6 py-3 text-sm font-bold shadow-card">
              <MessageCircle size={18} /> גם אני רוצה לעבור טסט ראשון
            </a>
          </div>
        </div>
      </section>

      {/* Pricing / contact */}
      <section className="px-4 py-10 sm:py-14">
        <div className="max-w-5xl mx-auto grid gap-4 lg:grid-cols-3">
          {[
            { title: "שיעור רכב", body: "רכב אוטומט חדש, איסוף באשקלון בתיאום, הכנה מלאה לטסט.", icon: Car },
            { title: "שיעור אופנוע", body: "A / A1 / A2, ידני ואוטומט, ציוד בטיחות ומגרש אימונים מסודר.", icon: Bike },
            { title: "חבילת טסט ראשון", body: "מסלול ממוקד לפני טסט: רענון, נקודות חולשה וטיפים לבוחן.", icon: Trophy },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <item.icon className="mb-3 text-primary" size={24} />
              <h2 className="font-black text-lg mb-2">{item.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.body}</p>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground">
                קבלו מחיר בוואטסאפ <ArrowLeft size={14} />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-10 sm:py-14">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-8">שאלות נפוצות</h2>
          <div className="space-y-2">
            {props.faqs.map((f, i) => (
              <div key={i} className="rounded-xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full text-right px-4 py-3 flex items-center justify-between gap-3 bg-white/[0.03] hover:bg-white/[0.05] transition">
                  <span className="font-bold text-sm">{f.q}</span>
                  <ChevronDown size={16} className={`shrink-0 transition ${open === i ? "rotate-180" : ""}`} />
                </button>
                {open === i && (
                  <div className="px-4 py-3 text-sm text-muted-foreground leading-relaxed">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-br from-[oklch(0.18_0.04_255)] to-[oklch(0.10_0.02_140)] p-6 sm:p-10 text-center">
          <Check size={32} className="mx-auto text-[#25D366] mb-3" />
          <h2 className="text-2xl sm:text-3xl font-black mb-2">{props.ctaSubline}</h2>
          <p className="text-sm text-muted-foreground mb-6">
            התקשרו או שלחו וואטסאפ לקבלת פרטים ושיריון מקום לשיעור ניסיון באשקלון.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={wa} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-6 py-3 text-sm font-bold">
              <MessageCircle size={18} /> שלחו וואטסאפ
            </a>
            <a href={tel}
               className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold">
              <Phone size={18} /> {s.contact.phone_display}
            </a>
          </div>
        </div>
      </section>

      {/* Internal links */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg font-bold mb-4 text-center">קישורים נוספים</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {props.related.map((r) => (
              <Link key={r.to} to={r.to}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-bold hover:bg-white/[0.06] transition flex items-center justify-between">
                <span>{r.title}</span>
                <ArrowLeft size={14} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <DeferredExitIntent wa={wa} tel={tel} phoneDisplay={s.contact.phone_display} />

      {/* Sticky mobile CTA bar */}
      <div className="fixed bottom-0 inset-x-0 z-50 sm:hidden border-t border-white/10 bg-background/95" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <div className="grid grid-cols-2 gap-2 p-2">
          <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[oklch(0.74_0.18_145)] text-white px-4 py-3 text-sm font-bold">
            <MessageCircle size={18} /> וואטסאפ
          </a>
          <a href={tel} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-bold">
            <Phone size={18} /> שיחה עכשיו
          </a>
        </div>
      </div>
    </div>
  );
}

function SeoLandingExitIntent({ wa, tel, phoneDisplay }: { wa: string; tel: string; phoneDisplay: string }) {
  const [open, setOpen] = useState(false);
  // exposed below
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const triggered = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const force = params.get("showExitIntent") === "1";
    try {
      const ts = Number(localStorage.getItem("seo-exit-intent:dismissed") ?? "0");
      if (!force && Date.now() - ts < 7 * 24 * 60 * 60 * 1000) return;
    } catch { /* ignore */ }

    const trigger = () => {
      if (triggered.current) return;
      triggered.current = true;
      setOpen(true);
    };
    if (force) {
      const t = window.setTimeout(trigger, 350);
      return () => window.clearTimeout(t);
    }
    const onMouseLeave = (e: MouseEvent) => { if (e.clientY <= 0) trigger(); };
    const mobileTimer = window.setTimeout(() => {
      if (window.matchMedia("(max-width: 768px), (pointer: coarse)").matches && window.scrollY > 320) trigger();
    }, 14000);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    return () => {
      window.clearTimeout(mobileTimer);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  const close = () => {
    setOpen(false);
    try { localStorage.setItem("seo-exit-intent:dismissed", String(Date.now())); } catch { /* ignore */ }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  if (!open) return null;
  return (
    <div dir="rtl" role="dialog" aria-modal="true" className="fixed inset-0 z-[80] flex items-center justify-center px-4">
      <button type="button" aria-label="סגירה" onClick={close} className="absolute inset-0 bg-black/75" />
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-background p-6 shadow-card">
        <button type="button" onClick={close} aria-label="סגירה" className="absolute top-3 left-3 h-9 w-9 rounded-full bg-white/10 grid place-items-center">
          <X size={16} />
        </button>
        {done ? (
          <div className="text-center py-5">
            <Check className="mx-auto mb-3 text-primary" size={38} />
            <h2 className="text-2xl font-black mb-2">מעולה, קיבלנו</h2>
            <p className="text-sm text-muted-foreground mb-4">אפשר גם לשלוח וואטסאפ ישירות לחן.</p>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[oklch(0.74_0.18_145)] text-white px-5 py-3 text-sm font-bold">
              <MessageCircle size={18} /> וואטסאפ עכשיו
            </a>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <p className="text-xs font-bold text-primary">רגע לפני שיוצאים</p>
            <h2 className="text-2xl font-black">רוצים הצעה מהירה לשיעור באשקלון?</h2>
            <p className="text-sm text-muted-foreground">השאירו פרטים או דברו עכשיו בוואטסאפ/טלפון.</p>
            <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="שם מלא" className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm outline-none focus:border-primary" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="טלפון" inputMode="tel" className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm outline-none focus:border-primary" />
            <button type="submit" className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">
              <Send size={16} /> חזרו אליי
            </button>
            <div className="grid grid-cols-2 gap-2">
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[oklch(0.74_0.18_145)] text-white px-3 py-3 text-xs font-bold"><MessageCircle size={16} /> וואטסאפ</a>
              <a href={tel} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-3 text-xs font-bold"><Phone size={16} /> {phoneDisplay}</a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function buildFaqJsonLd(faqs: SeoFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function DeferredExitIntent(props: { wa: string; tel: string; phoneDisplay: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const arm = () => { if (!cancelled) setReady(true); };
    const opts: AddEventListenerOptions = { once: true, passive: true };
    window.addEventListener("scroll", arm, opts);
    window.addEventListener("pointermove", arm, opts);
    window.addEventListener("touchstart", arm, opts);
    window.addEventListener("keydown", arm, opts);
    const t = window.setTimeout(arm, 6000);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
      window.removeEventListener("scroll", arm);
      window.removeEventListener("pointermove", arm);
      window.removeEventListener("touchstart", arm);
      window.removeEventListener("keydown", arm);
    };
  }, []);
  if (!ready) return null;
  return <SeoLandingExitIntent {...props} />;
}

export function buildLocalBusinessJsonLd(opts: { serviceName: string; serviceDesc: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "DrivingSchool"],
    "@id": "https://hendrive.co.il/#business",
    name: "חן כחלון – בית הספר לנהיגה ואופנוע אשקלון",
    url: opts.url,
    telephone: "+972503250150",
    priceRange: "₪₪",
    image: "https://hendrive.co.il/og-image.jpg",
    address: { "@type": "PostalAddress", addressLocality: "אשקלון", addressRegion: "דרום", addressCountry: "IL" },
    geo: { "@type": "GeoCoordinates", latitude: 31.6688, longitude: 34.5743 },
    areaServed: [
      { "@type": "City", name: "אשקלון" },
    ],
    aggregateRating: { "@type": "AggregateRating", ratingValue: "5.0", reviewCount: "120", bestRating: "5", worstRating: "1" },
    makesOffer: {
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: opts.serviceName, description: opts.serviceDesc, areaServed: "אשקלון" },
    },
  };
}