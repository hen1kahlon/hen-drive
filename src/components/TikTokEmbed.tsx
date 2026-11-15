export function TikTokEmbed({ id, title }: { id: string; title: string }) {
  return (
    <div className="relative aspect-[9/16] w-full overflow-hidden rounded-3xl border border-white/10 bg-black shadow-card">
      <iframe
        src={`https://www.tiktok.com/player/v1/${id}?description=0&music_info=0&rel=0&native_context_menu=0`}
        title={title}
        loading="lazy"
        allow="fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
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
