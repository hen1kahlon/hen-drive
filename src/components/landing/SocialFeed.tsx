import { Instagram } from "lucide-react";
import { TikTokRow } from "@/components/TikTokEmbed";
import { useSiteSettings } from "@/lib/site-settings";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.41a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.34Z"/>
    </svg>
  );
}

const VIDEOS = [
  { id: "7686478543789788436", title: "ככה נראה יום טסט אצלנו" },
  { id: "7683852015776091412", title: "משיעור ראשון לנסיעה לבד" },
  { id: "7696639346836868372", title: "רישיון A – כוח פוגש שליטה" },
  { id: "7697191865300405510", title: "המגרש מלמעלה" },
];

export function SocialFeed() {
  const s = useSiteSettings();
  const instagram = s.social.instagram;
  const tiktok = s.social.tiktok;
  return (
    <section id="social" className="py-7 sm:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-5 sm:mb-14">
          <p className="gradient-text-blue font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">עקבו אחריי</p>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl">
            הסיפורים שלי <span className="gradient-text-blue">ברשתות</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">סרטונים אמיתיים מהשיעורים ומימי הטסט – ככה זה נראה אצלי.</p>
        </div>

        <TikTokRow videos={VIDEOS} />

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
