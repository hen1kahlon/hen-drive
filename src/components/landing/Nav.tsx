import { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import { useSiteSettings } from "@/lib/site-settings";

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-11 h-11 rounded-xl bg-gradient-blue grid place-items-center text-white font-black shadow-glow">חכ</div>
      <div className="leading-tight">
        <div className="font-black text-base text-white">חן כחלון</div>
        <div className="text-[10px] text-white/60 -mt-0.5">מורה נהיגה</div>
      </div>
    </div>
  );
}

export function Nav() {
  const s = useSiteSettings();
  const [openMenu, setOpenMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const links = [
    { href: "#categories", label: "דרגות" },
    { href: "#about", label: "עליי" },
    { href: "#why", label: "למה אני" },
    { href: "#reviews", label: "ביקורות" },
    { href: "#faq", label: "שאלות" },
    { href: "#lead", label: "צור קשר" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerClass = scrolled
    ? "fixed top-0 inset-x-0 z-50 border-b border-white/10 transition-colors duration-300"
    : "fixed top-0 inset-x-0 z-50 border-b border-transparent transition-colors duration-300";
  const headerStyle = scrolled
    ? { background: "#0f1729" }
    : { background: "transparent" };

  return (
    <header className={headerClass} style={headerStyle}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <a
          href={`tel:${s.contact.phone}`}
          className="hidden md:inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition hover:scale-105"
          style={{ background: "#f59e0b", color: "#1a1a1a", borderRadius: "20px" }}
        >
          <Phone size={15} /> {s.contact.phone_display}
        </a>
        <nav className="hidden md:flex items-center gap-7 text-sm text-white/70">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-white transition relative">
              {l.label}
            </a>
          ))}
        </nav>
        <a href="#top"><Logo /></a>
        {/* mobile */}
        <button onClick={() => setOpenMenu(!openMenu)} className="md:hidden w-10 h-10 grid place-items-center rounded-lg border border-white/10" aria-label="תפריט">
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-5 bg-white transition ${openMenu ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-white transition ${openMenu ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-white transition ${openMenu ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </div>
      {openMenu && (
        <div className="md:hidden border-t border-white/10 px-4 py-4 space-y-1" style={{ background: "rgba(15,23,41,0.97)", backdropFilter: "blur(12px)" }}>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpenMenu(false)} className="block py-2 px-3 rounded-lg text-sm font-medium text-white/80 hover:bg-white/5 hover:text-white">
              {l.label}
            </a>
          ))}
          <a
            href={`tel:${s.contact.phone}`}
            className="mt-2 flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold"
            style={{ background: "#f59e0b", color: "#1a1a1a", borderRadius: "20px" }}
          >
            <Phone size={14} /> {s.contact.phone_display}
          </a>
          <a href="/admin" onClick={() => setOpenMenu(false)} className="mt-2 block text-center rounded-lg border border-white/10 bg-white/5 py-2 text-sm font-semibold text-white hover:bg-white/10" aria-label="כניסת מנהל">
            כניסת מנהל
          </a>
        </div>
      )}
    </header>
  );
}
