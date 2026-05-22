import { MessageCircle, Phone, Sparkles } from "lucide-react";
import { useSiteSettings, waUrl } from "@/lib/site-settings";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export function FinalCTA() {
  const s = useSiteSettings();
  const ref = useScrollReveal(0);
  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-7 sm:py-24 px-4 relative overflow-hidden"
      style={{ background: "#0f1729" }}
    >
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: "rgba(37,99,235,0.08)", filter: "blur(80px)" }} />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: "rgba(245,158,11,0.06)", filter: "blur(80px)" }} />
      <div className="max-w-4xl mx-auto text-center glass-strong rounded-[2.5rem] border border-white/10 p-8 sm:p-14 shadow-card">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-blue px-4 py-1.5 mb-6 text-xs font-bold text-white">
          <Sparkles size={14} /> בואו נתחיל
        </div>
        <h2 className="text-display text-4xl sm:text-6xl mb-4">
          מתחילים את הדרך<br />
          <span className="gradient-text-blue">לרישיון</span>?
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">דבר אחד מפריד בינך לבין הרישיון — ההחלטה שלך</p>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          <a
            href={waUrl(s)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-7 py-4 font-bold hover:scale-105 transition"
            style={{ background: "#f59e0b", color: "#1a1a1a" }}
          >
            <MessageCircle size={20} /> שלחו הודעה בוואטסאפ
          </a>
          <a
            href={`tel:${s.contact.phone}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-4 font-bold text-white hover:bg-white/10 hover:scale-105 transition"
          >
            <Phone size={20} /> התקשרו עכשיו
          </a>
        </div>
      </div>
    </section>
  );
}
