import { Play } from "lucide-react";

const PROFILE = "https://www.tiktok.com/@hen_driver";

function TikTokLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.41a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.34Z" />
    </svg>
  );
}

// TikTok's in-page player fails in browsers that block third-party cookies,
// so each video is a cover image that opens the clip on TikTok.
export function TikTokEmbed({ id, title }: { id: string; title: string }) {
  return (
    <a
      href={`${PROFILE}/video/${id}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${title} – צפייה בטיקטוק`}
      className="!no-underline group relative block aspect-[9/15] w-full overflow-hidden rounded-3xl border border-white/10 bg-black shadow-card"
    >
      <img
        src={`/videos/${id}.webp`}
        alt={title}
        loading="lazy"
        decoding="async"
        width={280}
        height={462}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/20" />
      <div className="absolute inset-0 grid place-items-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-black shadow-lg transition-transform group-hover:scale-110">
          <Play className="h-7 w-7 translate-x-0.5" fill="currentColor" />
        </span>
      </div>
      <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white">
        <TikTokLogo className="h-3 w-3" /> TikTok
      </span>
      <span className="absolute bottom-3 inset-x-3 text-center text-xs font-bold text-white/90">לצפייה בסרטון ↗</span>
    </a>
  );
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
