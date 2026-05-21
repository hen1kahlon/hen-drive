import { MessageCircle, Phone, Sparkles, Navigation } from "lucide-react";
import { useSiteSettings, waUrl } from "@/lib/site-settings";
import { scrollToLead } from "@/components/landing/Categories";

export function MobileBar() {
  const s = useSiteSettings();
  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-30 glass-strong border-t border-white/10"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="grid grid-cols-4 gap-1 p-2 max-w-screen-sm mx-auto">
        <a href={waUrl(s)} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 py-2 rounded-xl bg-[#25D366] text-white shadow-[0_8px_20px_-8px_rgba(37,211,102,0.8)]">
          <MessageCircle size={18} />
          <span className="text-[10px] font-bold">וואטסאפ</span>
        </a>
        <a href={`tel:${s.contact.phone}`} className="flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-white/5 transition">
          <Phone size={18} className="text-[oklch(0.7_0.18_255)]" />
          <span className="text-[10px] font-bold">שיחה</span>
        </a>
        <button type="button" onClick={scrollToLead} className="flex flex-col items-center gap-1 py-2 rounded-xl bg-gradient-blue text-white">
          <Sparkles size={18} />
          <span className="text-[10px] font-bold">פרטים</span>
        </button>
        <a href={s.contact.training_map_url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-white/5 transition">
          <Navigation size={18} className="text-accent" />
          <span className="text-[10px] font-bold">ניווט</span>
        </a>
      </div>
    </div>
  );
}
