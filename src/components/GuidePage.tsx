import { Link } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { useSiteSettings, waUrl } from "@/lib/site-settings";
import { LegalLinks } from "@/components/LegalPage";

export type GuideStep = { title: string; body: ReactNode };

export function GuidePage({
  eyebrow,
  title,
  intro,
  waMessage,
  children,
  related,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  waMessage: string;
  children: ReactNode;
  related: { to: string; title: string }[];
}) {
  const s = useSiteSettings();
  const wa = waUrl(s, waMessage);
  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      <header className="sticky top-0 z-40 bg-background/95 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-sm">
            <ArrowLeft size={16} /> חזרה לאתר
          </Link>
          <a href={wa} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-4 py-2 text-xs font-bold">
            <MessageCircle size={14} /> וואטסאפ
          </a>
        </div>
      </header>

      <section className="relative px-4 pt-10 pb-8 sm:pt-14 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[oklch(0.16_0.04_255)] via-background to-background" />
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-primary mb-3">{eyebrow}</p>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight">{title}</h1>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">{intro}</p>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-4 pb-10 text-right space-y-6 text-sm sm:text-base leading-relaxed text-foreground/85 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-foreground [&_ul]:list-disc [&_ul]:pr-5 [&_ul]:space-y-1.5 [&_a]:text-primary [&_a]:underline">
        {children}
      </main>

      <section className="px-4 py-10 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-black mb-2">רוצים להתחיל?</h2>
          <p className="text-sm text-muted-foreground mb-6">שלחו הודעה ואחזור אליכם עם כל הפרטים – רכב או אופנוע, באשקלון והסביבה.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={wa} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-6 py-3 text-sm font-bold">
              <MessageCircle size={18} /> שלחו וואטסאפ
            </a>
            <a href={`tel:${s.contact.phone}`}
               className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold">
              <Phone size={18} /> {s.contact.phone_display}
            </a>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <nav aria-label="עמודים קשורים" className="max-w-3xl mx-auto px-4 py-8">
          <h2 className="text-lg font-black mb-3 text-right">עוד מידע שיעזור לך</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {related.map((r) => (
              <li key={r.to}>
                <Link to={r.to} className="block rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-bold hover:bg-white/[0.06]">
                  {r.title} ←
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <LegalLinks className="pb-10" />
    </div>
  );
}

export function GuideSteps({ steps }: { steps: GuideStep[] }) {
  return (
    <ol className="space-y-4 list-none p-0">
      {steps.map((st, i) => (
        <li key={st.title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <span className="shrink-0 w-9 h-9 rounded-full bg-primary/15 text-primary grid place-items-center font-black">{i + 1}</span>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-1">{st.title}</h3>
            <div className="text-sm text-foreground/80 leading-relaxed">{st.body}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}
