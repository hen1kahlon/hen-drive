import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Phone, MessageCircle, Check, Star, ChevronDown, MapPin,
  Trophy, ArrowLeft, Shield, GraduationCap, Bike, Car,
} from "lucide-react";
import { useSiteSettings, waUrl } from "@/lib/site-settings";

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
};

const ICONS = {
  bike: Bike, car: Car, shield: Shield, grad: GraduationCap, trophy: Trophy,
} as const;

export default function SeoLanding(props: SeoLandingProps) {
  const s = useSiteSettings();
  const wa = waUrl(s, props.waMessage);
  const tel = `tel:${s.contact.phone}`;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      {/* Top nav */}
      <header className="sticky top-0 z-40 backdrop-blur bg-background/70 border-b border-white/5">
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
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="w-10 h-10 rounded-xl bg-primary/15 grid place-items-center mb-3">
                  <Icon size={20} className="text-primary" />
                </div>
                <h3 className="font-bold mb-1">{h.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{h.body}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Reviews */}
      <section className="px-4 py-10 sm:py-14 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-2">המלצות תלמידים</h2>
          <p className="text-center text-sm text-muted-foreground mb-8">
            סיפורי הצלחה אמיתיים מאשקלון, אשדוד, קריית גת והדרום
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {props.reviews.map((r, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-background p-5">
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, k) => (
                    <Star key={k} size={14} className="fill-[#FBBC04] text-[#FBBC04]" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-3">{r.text}</p>
                <p className="text-xs font-bold text-muted-foreground">{r.name} · {r.type}</p>
              </div>
            ))}
          </div>
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

      {/* Sticky mobile WhatsApp */}
      <a href={wa} target="_blank" rel="noopener noreferrer"
         className="fixed bottom-4 left-4 z-50 sm:hidden inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-5 py-3 text-sm font-bold shadow-[0_10px_30px_-10px_rgba(37,211,102,0.9)]">
        <MessageCircle size={18} /> וואטסאפ
      </a>
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
      { "@type": "City", name: "אשדוד" },
      { "@type": "City", name: "קריית גת" },
      { "@type": "City", name: "קרית מלאכי" },
      { "@type": "City", name: "גן יבנה" },
      { "@type": "City", name: "נתיבות" },
      { "@type": "City", name: "שדרות" },
    ],
    aggregateRating: { "@type": "AggregateRating", ratingValue: "5.0", reviewCount: "120", bestRating: "5", worstRating: "1" },
    makesOffer: {
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: opts.serviceName, description: opts.serviceDesc, areaServed: "אשקלון" },
    },
  };
}