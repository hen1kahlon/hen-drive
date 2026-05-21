import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import { useSiteSettings } from "@/lib/site-settings";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.41a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.34Z"/>
    </svg>
  );
}

function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const dim = size === "sm" ? "w-9 h-9 text-sm" : "w-11 h-11 text-base";
  return (
    <div className="flex items-center gap-2.5">
      <div className={`${dim} rounded-xl bg-gradient-blue grid place-items-center text-white font-black shadow-glow`}>חכ</div>
      <div className="leading-tight">
        <div className="font-black text-base">חן כחלון</div>
        <div className="text-[10px] text-muted-foreground -mt-0.5">מורה נהיגה</div>
      </div>
    </div>
  );
}

export function Footer() {
  const s = useSiteSettings();
  const instagram = s.social.instagram;
  const facebook = s.social.facebook;
  const tiktok = s.social.tiktok;
  return (
    <footer className="border-t border-white/5 py-8 sm:py-12 px-4 pb-28 md:pb-12 relative">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 sm:gap-8 text-sm">
        <div>
          <Logo />
          <p className="text-muted-foreground mt-4 max-w-xs">מורה נהיגה לרכב ואופנועים — אשקלון והסביבה. מלווה אותך עד הקריאה ״עברת״.</p>
        </div>
        <div>
          <h4 className="font-black mb-4 text-base">צור קשר</h4>
          <ul className="space-y-3 text-muted-foreground">
            <li><a href={`tel:${s.contact.phone}`} className="hover:text-foreground inline-flex items-center gap-2"><Phone size={14} className="text-accent" /> {s.contact.phone_display}</a></li>
            <li><a href={`mailto:${s.contact.email}`} className="hover:text-foreground inline-flex items-center gap-2"><Mail size={14} className="text-accent" /> {s.contact.email}</a></li>
            <li className="inline-flex items-center gap-2"><MapPin size={14} className="text-accent" /> אשקלון והסביבה</li>
          </ul>
        </div>
        <div>
          <h4 className="font-black mb-4 text-base">עקבו אחריי</h4>
          <div className="flex gap-3">
            <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-11 h-11 rounded-full glass-strong border border-white/10 grid place-items-center hover:bg-gradient-blue hover:border-transparent hover:text-white transition">
              <Instagram size={18} />
            </a>
            <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-11 h-11 rounded-full glass-strong border border-white/10 grid place-items-center hover:bg-gradient-blue hover:border-transparent hover:text-white transition">
              <Facebook size={18} />
            </a>
            <a href={tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-11 h-11 rounded-full glass-strong border border-white/10 grid place-items-center hover:bg-foreground hover:text-background hover:border-transparent transition">
              <TikTokIcon className="w-[18px] h-[18px]" />
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-5 border-t border-white/5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} חן כחלון - מורה נהיגה. כל הזכויות שמורות.
      </div>
    </footer>
  );
}
