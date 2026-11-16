import { useState } from "react";
import { Play } from "lucide-react";

const PROFILE = "https://www.tiktok.com/@hen_driver";

const LOCAL_VIDEOS = new Set([
  "7697191865300405510",
  "7700293638508629269",
  "7701800344614964500",
  "7703058468957179157",
  "7704374003556715797",
  "7705854726016863508",
  "7706609289632271637",
  "moment-license",
  "scooter-lesson",
  "a1-lot-practice",
  "before-test-day",
  "test-day-drone",
  "test-day-drone-2",
  "helmet-gift",
  "task3-night",
  "first-test-pass",
  "lot-route",
]);

function TikTokLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.41a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.34Z" />
    </svg>
  );
}

function PlayBadge() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/10" />
      <div className="absolute inset-0 grid place-items-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-black shadow-lg transition-transform group-hover:scale-110">
          <Play className="h-7 w-7 translate-x-0.5" fill="currentColor" />
        </span>
      </div>
    </>
  );
}

const CARD = "!no-underline group relative block aspect-[9/15] w-full overflow-hidden rounded-3xl border border-white/10 bg-black shadow-card";

function LocalVideo({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  if (playing) {
    return (
      <div className={CARD}>
        <video
          src={`/videos/${id}.mp4`}
          poster={`/videos/${id}.webp`}
          controls
          autoPlay
          playsInline
          className="absolute inset-0 h-full w-full object-contain bg-black"
        />
      </div>
    );
  }
  return (
    <button type="button" onClick={() => setPlaying(true)} aria-label={`הפעלת הסרטון: ${title}`} className={`${CARD} text-start`}>
      <img
        src={`/videos/${id}.webp`}
        alt={title}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <PlayBadge />
    </button>
  );
}

// TikTok's in-page player fails in browsers that block third-party cookies,
// so clips we don't host ourselves open on TikTok instead.
function TikTokLink({ id, title }: { id: string; title: string }) {
  return (
    <a
      href={`${PROFILE}/video/${id}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${title} – צפייה בטיקטוק`}
      className={CARD}
    >
      <img
        src={`/videos/${id}.webp`}
        alt={title}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <PlayBadge />
      <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white">
        <TikTokLogo className="h-3 w-3" /> TikTok
      </span>
    </a>
  );
}

export function TikTokEmbed({ id, title }: { id: string; title: string }) {
  return LOCAL_VIDEOS.has(id) ? <LocalVideo id={id} title={title} /> : <TikTokLink id={id} title={title} />;
}

export function TikTokRow({ videos }: { videos: { id: string; title: string }[] }) {
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-4">
      {videos.map((v) => (
        <figure key={v.id} className="w-[70%] shrink-0 snap-start sm:w-auto">
          <TikTokEmbed id={v.id} title={v.title} />
          <figcaption className="mt-2 text-sm font-bold text-center">{v.title}</figcaption>
        </figure>
      ))}
    </div>
  );
}
