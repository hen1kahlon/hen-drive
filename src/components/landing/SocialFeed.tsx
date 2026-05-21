import { Instagram, Heart, Play } from "lucide-react";
import { useSiteSettings } from "@/lib/site-settings";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.41a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.34Z"/>
    </svg>
  );
}

const socialPosts = [
  { platform: "instagram" as const, caption: "תלמידה עברה טסט מהפעם הראשונה 🎉", likes: "248", grad: "from-[oklch(0.62_0.20_255)] to-[oklch(0.55_0.22_330)]" },
  { platform: "tiktok" as const, caption: "טיפ חשוב לפני טסט אופנוע 🏍️", likes: "1.2K", grad: "from-[oklch(0.20_0.02_260)] to-[oklch(0.10_0.02_260)]" },
  { platform: "instagram" as const, caption: "שיעור ראשון על הכלי החדש 🚗", likes: "189", grad: "from-[oklch(0.62_0.20_255)] to-[oklch(0.4_0.18_280)]" },
  { platform: "tiktok" as const, caption: "מה לבדוק לפני יציאה לכביש?", likes: "892", grad: "from-[oklch(0.78_0.20_55)] to-[oklch(0.5_0.22_30)]" },
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
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">תכנים חדשים, טיפים, ורגעים מתוך השיעורים — מוזמנים להצטרף.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {socialPosts.map((p, i) => {
            const href = p.platform === "tiktok" ? tiktok : instagram;
            return (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
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
              </a>
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
