import { useState, useEffect, useRef } from "react";
import { MessageCircle, Phone, Sparkles, Send, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useSiteSettings, waUrl } from "@/lib/site-settings";

export function ExitIntent() {
  const s = useSiteSettings();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forceExitIntent = params.get("showExitIntent") === "1";
    // Suppress for 7 days after dismiss/submit
    try {
      const ts = Number(localStorage.getItem("exit-intent:dismissed") ?? "0");
      if (!forceExitIntent && Date.now() - ts < 7 * 24 * 60 * 60 * 1000) return;
    } catch { /* ignore */ }

    const trigger = () => {
      if (triggered.current) return;
      triggered.current = true;
      setOpen(true);
      try {
        const gtag = (window as any).gtag;
        if (typeof gtag === "function") {
          gtag("event", "exit_intent_shown", { event_category: "engagement", value: 1 });
        }
      } catch { /* ignore */ }
    };

    if (forceExitIntent) {
      const t = window.setTimeout(trigger, 350);
      return () => window.clearTimeout(t);
    }

    const isMobile = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;

    // Desktop: mouse leaving the viewport upward
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && (e.relatedTarget === null || (e.relatedTarget as any)?.nodeName === "HTML")) {
        trigger();
      }
    };

    // Mobile: rapid upward scroll after engaging with the page
    let lastY = window.scrollY;
    let lastT = Date.now();
    let engaged = false;
    const engageT = window.setTimeout(() => { engaged = true; }, 8000);
    const onScroll = () => {
      if (!engaged) return;
      const y = window.scrollY;
      const t = Date.now();
      const dy = lastY - y;
      const dt = Math.max(t - lastT, 1);
      const speed = dy / dt; // px/ms upward
      if (y < 200 && speed > 1.2) trigger();
      lastY = y;
      lastT = t;
    };

    if (isMobile) {
      window.addEventListener("scroll", onScroll, { passive: true });
    } else {
      document.documentElement.addEventListener("mouseleave", onMouseLeave);
    }
    return () => {
      window.clearTimeout(engageT);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  const close = () => {
    setOpen(false);
    try { localStorage.setItem("exit-intent:dismissed", String(Date.now())); } catch { /* ignore */ }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const nm = name.trim();
    const ph = phone.trim().replace(/[\s\-().]/g, "");
    if (nm.length < 2) { toast.error("נא להזין שם"); return; }
    if (!/^(\+?972|0)?5\d{8}$/.test(ph)) { toast.error("מספר טלפון לא תקין"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/public/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: nm.slice(0, 100),
          phone: ph.slice(0, 30),
          interest: "שיעור ניסיון – הצעה מיוחדת",
          area: "אשקלון",
          source: "exit_intent",
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      try {
        const gtag = (window as any).gtag;
        if (typeof gtag === "function") {
          gtag("event", "exit_intent_submit", { event_category: "lead", value: 10 });
        }
      } catch { /* ignore */ }
      setDone(true);
      try { localStorage.setItem("exit-intent:dismissed", String(Date.now())); } catch { /* ignore */ }
    } catch {
      toast.error("השליחה נכשלה — נסו שוב או חייגו אלינו");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;
  return (
    <div
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-label="הצעה מיוחדת לפני שתעזבו"
      className="fixed inset-0 z-[80] flex items-center justify-center px-4 animate-fade-in"
    >
      <button type="button" aria-label="סגירה" onClick={close} className="absolute inset-0 bg-black/75" />
      <div className="relative w-full max-w-md glass-strong border border-white/10 rounded-3xl p-6 shadow-card animate-scale-in">
        <button
          type="button"
          onClick={close}
          aria-label="סגירה"
          className="absolute top-3 left-3 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
        >
          <X className="size-4" />
        </button>

        {done ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-[oklch(0.55_0.22_140)] grid place-items-center mx-auto mb-4">
              <Check className="size-7 text-white" />
            </div>
            <h3 className="text-2xl font-black mb-2">קיבלנו! 🎉</h3>
            <p className="text-sm text-muted-foreground mb-5">חן יחזור אליך בקרוב עם פרטים על שיעור הניסיון.</p>
            <button type="button" onClick={close} className="rounded-full bg-gradient-blue px-6 py-3 text-sm font-bold text-white shadow-glow">
              סגור
            </button>
          </div>
        ) : (
          <>
            <div className="inline-flex items-center gap-2 rounded-full bg-[oklch(0.55_0.22_30_/_0.2)] border border-[oklch(0.65_0.22_30_/_0.4)] px-3 py-1 mb-4 text-xs font-bold text-[oklch(0.8_0.18_40)]">
              <Sparkles className="size-3.5" /> רק לפני שאתם הולכים
            </div>
            <h3 className="text-display text-3xl mb-2">
              שיעור ניסיון <span className="gradient-text-blue">מיוחד</span> באשקלון
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              השאירו שם וטלפון — חן יחזור אליכם תוך זמן קצר עם הצעה אישית לרכב או אופנוע.
            </p>

            <form onSubmit={submit} className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="שם מלא"
                required
                autoComplete="name"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-[oklch(0.7_0.18_255)] focus:bg-white/10 transition"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="טלפון (05X-XXXXXXX)"
                required
                inputMode="tel"
                autoComplete="tel"
                dir="ltr"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-[oklch(0.7_0.18_255)] focus:bg-white/10 transition text-right"
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-blue px-5 py-3.5 text-sm font-bold text-white shadow-glow hover:scale-[1.02] transition disabled:opacity-60 disabled:hover:scale-100"
              >
                {submitting ? "שולח..." : (<><Send className="size-4" /> בקשו חזרה אליי</>)}
              </button>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[10px] text-muted-foreground font-medium">או</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={waUrl(s)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-3 py-3 text-xs font-bold text-white"
                >
                  <MessageCircle className="size-4" /> וואטסאפ
                </a>
                <a
                  href={`tel:${s.contact.phone}`}
                  onClick={close}
                  className="inline-flex items-center justify-center gap-2 rounded-full glass-strong border border-white/10 px-3 py-3 text-xs font-bold"
                >
                  <Phone className="size-4" /> התקשרו
                </a>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
