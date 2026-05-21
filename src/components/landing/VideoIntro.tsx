import { useState } from "react";
import { Play, MessageCircle, Video as VideoIcon } from "lucide-react";
import { useSiteSettings, waUrl } from "@/lib/site-settings";
import portraitImg from "@/assets/instructor-portrait.webp";
import portraitImgMobile from "@/assets/instructor-portrait-mobile.webp";

export function VideoIntro() {
  const s = useSiteSettings();
  const [playing, setPlaying] = useState(false);
  return (
    <section id="video" className="py-7 sm:py-24 px-4 relative">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] rounded-full bg-[oklch(0.62_0.20_255_/_0.12)] blur-[120px] -z-10" />
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-5 sm:mb-14">
          <p className="gradient-text-blue font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">וידאו</p>
          <h2 className="text-display text-4xl sm:text-5xl">
            תכירו את <span className="gradient-text-blue">חן כחלון</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">סרטון היכרות קצר — הגישה, האווירה והדרך שלי ללמד נהיגה.</p>
        </div>

        <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-white/10 shadow-glow group">
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
            <a href={waUrl(s)} target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-bold text-white shadow-card">
              <MessageCircle size={14} /> שאל אותי שאלה
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
