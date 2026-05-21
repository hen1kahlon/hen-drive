import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/lib/site-settings";

const SUCCESS_CAPTIONS = [
  "טסט ראשון 🎉",
  "עבר/ה בהצלחה 🚗",
  "עוד הצלחה בדרך לרישיון",
  "גם אתם יכולים",
  "בדרך לעצמאות על הכביש",
  "עוד תלמיד/ה עם רישיון",
  "רישיון ביד ✨",
  "מוכן/ה לכביש",
];

type StudentItem = {
  id: string;
  image_url: string;
  title: string | null;
  caption: string;
  isFirstTry: boolean;
  media_type: "image" | "video";
};

function StudentCard({
  item,
  index,
  mobile = false,
}: {
  item: StudentItem;
  index: number;
  mobile?: boolean;
}) {
  // Masonry rhythm on desktop: every 3rd card spans 2 rows
  const tall = !mobile && index % 3 === 0;
  return (
    <article
      className={[
        "group relative overflow-hidden rounded-2xl border border-white/10 glass shadow-card",
        "hover:border-[oklch(0.62_0.20_255_/_0.5)] transition-colors",
        mobile ? "snap-start shrink-0 w-[78%] aspect-[3/4]" : tall ? "row-span-2" : "row-span-1",
      ].join(" ")}
    >
      {/* stable backdrop = no GPU blur repaint */}
      <img
        src={item.image_url}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-black/30" />

      {/* main media — full face, no crop */}
      {item.media_type === "video" ? (
        <video
          src={item.image_url}
          controls
          playsInline
          preload="metadata"
          className="relative z-[1] w-full h-full object-contain bg-black"
        />
      ) : (
        <img
          src={item.image_url}
          alt={item.title ?? "תלמיד שעבר טסט בהצלחה"}
          loading={index < 2 ? "eager" : "lazy"}
          fetchPriority={index < 2 ? "high" : "low"}
          decoding="async"
          sizes={mobile ? "78vw" : "(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"}
          className="relative z-[1] w-full h-full object-contain"
        />
      )}

      {/* readability gradient on top of main image */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none" />

      {/* top badges */}
      <div className="absolute z-[3] top-2.5 right-2.5 left-2.5 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-primary text-white px-2.5 py-1 text-[10px] font-black shadow-glow">
          <Check size={11} strokeWidth={3} />
          עבר/ה טסט
        </span>
        {item.isFirstTry && (
          <span className="rounded-full glass-strong border border-white/15 px-2 py-0.5 text-[10px] font-bold text-white">
            טסט ראשון
          </span>
        )}
      </div>

      {/* caption */}
      <div className="absolute z-[3] bottom-0 inset-x-0 p-3 sm:p-3.5 text-white">
        <div className="font-black text-sm sm:text-base leading-tight">{item.caption}</div>
      </div>
    </article>
  );
}

export function SuccessGallery() {
  const s = useSiteSettings();
  const [items, setItems] = useState<StudentItem[]>([]);

  useEffect(() => {
    supabase
      .from("gallery_items")
      .select("id,image_url,title,sort_order,media_type")
      .eq("category", "success")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (!data) return;
        setItems(
          data.map((row, i) => ({
            id: row.id as string,
            image_url: row.image_url as string,
            title: (row.title as string | null) ?? null,
            caption:
              ((row.title as string | null) ?? "").trim() ||
              SUCCESS_CAPTIONS[i % SUCCESS_CAPTIONS.length],
            // mark roughly every 3rd card as a "first-try" highlight
            isFirstTry: i % 3 === 0,
            media_type: ((row as { media_type?: string }).media_type === "video"
              ? "video"
              : "image") as "image" | "video",
          })),
        );
      });
  }, []);

  if (items.length === 0) return null;

  const stats = [
    { value: `+${s.stats.students.replace(/\D/g, "") || "350"}`, label: "תלמידים" },
    { value: s.stats.success, label: "הצלחה" },
    { value: s.stats.years, label: "שנות ניסיון" },
  ];

  return (
    <section id="gallery" className="py-7 sm:py-24 px-4 relative overflow-hidden">
      <div className="absolute -top-32 right-1/3 w-[28rem] h-[28rem] rounded-full bg-[oklch(0.62_0.20_255_/_0.10)] blur-[120px] -z-10" />
      <div className="absolute -bottom-40 left-1/4 w-[28rem] h-[28rem] rounded-full bg-[oklch(0.62_0.20_255_/_0.10)] blur-[120px] -z-10" />

      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-4 sm:mb-10">
          <p className="gradient-text-blue font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">הצלחות אמיתיות</p>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl">
            תלמידים <span className="gradient-text-blue">שעשו את זה</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm sm:text-base">
            רגעי הצלחה אמיתיים — מהשיעור הראשון ועד הקריאה ״עברת!״
          </p>
        </div>

        {/* Counters */}
        <div
          className="grid grid-cols-3 gap-2 sm:gap-4 max-w-3xl mx-auto mb-6 sm:mb-12"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-strong rounded-2xl border border-white/10 px-2 py-3 sm:px-5 sm:py-5 text-center hover:border-[oklch(0.62_0.20_255_/_0.5)] transition"
            >
              <div className="text-2xl sm:text-4xl font-black gradient-text-blue leading-none mb-1">
                {stat.value}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: swipe carousel */}
        <div className="sm:hidden -mx-4 px-4 overflow-x-auto snap-x snap-mandatory flex gap-3 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item, i) => (
            <StudentCard key={item.id} item={item} index={i} mobile />
          ))}
        </div>

        {/* Desktop: masonry-like grid */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-[180px] lg:auto-rows-[200px]">
          {items.map((item, i) => (
            <StudentCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
