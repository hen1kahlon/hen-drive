import { useState, useEffect, useRef } from "react";
import { MapPin, Zap, Shield, UserCheck, Send, Check } from "lucide-react";
import { toast } from "sonner";
import { useSiteSettings } from "@/lib/site-settings";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block" suppressHydrationWarning>
      <span className="block text-xs font-bold mb-2 text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function ClientOnly({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return <>{mounted ? children : fallback}</>;
}

export function LeadForm({ selectedInterest }: { selectedInterest?: string | null }) {
  const sectionRef = useScrollReveal(0);
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", interest: "רכב אוטומט דרגה B", area: "אשקלון", notes: "" });
  // honeypot — bots fill all inputs; humans never see this one
  const [website, setWebsite] = useState("");
  // page-mount timestamp — instant-submit bots fail this
  const mountedAt = useRef<number>(Date.now());

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (selectedInterest) {
      setForm((prev) => ({ ...prev, interest: selectedInterest }));
    }
  }, [selectedInterest]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    // honeypot — silently drop bot submissions
    if (website.trim().length > 0) {
      setSubmitted(true);
      return;
    }
    // too-fast submit (under 1.5s = bot)
    if (Date.now() - mountedAt.current < 1500) {
      toast.error("נא למלא את הטופס לפני שליחה");
      return;
    }

    const name = form.name.trim();
    const phoneRaw = form.phone.trim();
    const phoneDigits = phoneRaw.replace(/[\s\-().]/g, "");

    if (name.length < 2) {
      toast.error("נא להזין שם מלא (לפחות 2 תווים)");
      return;
    }
    if (name.length > 60) {
      toast.error("השם ארוך מדי");
      return;
    }
    // Israeli phone: 9–10 digits, optional +972 / 00972 prefix
    const phoneOk = /^(\+?972|0)?5\d{8}$|^(\+?972|0)?[2-489]\d{7,8}$/.test(phoneDigits);
    if (!phoneOk) {
      toast.error("מספר טלפון לא תקין — נסו בפורמט 05X-XXXXXXX");
      return;
    }

    // local cooldown — 60s between submissions per device
    try {
      const last = Number(localStorage.getItem("lead:last") ?? "0");
      if (Date.now() - last < 60_000) {
        toast.error("כבר שלחת פנייה לאחרונה — חן יחזור אליך בקרוב 🙏");
        return;
      }
    } catch { /* localStorage may be blocked */ }

    // duplicate-submit guard — same phone in last 24h on this device
    try {
      const prev = localStorage.getItem("lead:phone");
      if (prev && prev === phoneDigits) {
        toast.error("כבר שלחנו את הפרטים האלה — חן יחזור אליך 👌");
        setSubmitted(true);
        return;
      }
    } catch { /* ignore */ }

    setSubmitting(true);
    // Map interest text to license_type when possible
    const it = form.interest;
    const license_type = /A2/i.test(it) ? "A2" : /A1/i.test(it) ? "A1" : /\bA\b/i.test(it) ? "A" : /B/i.test(it) ? "B" : null;
    try {
      const response = await fetch("/api/public/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: name.slice(0, 100),
          phone: phoneDigits.slice(0, 30),
          license_type,
          interest: it.slice(0, 200),
          area: form.area.slice(0, 200),
          notes: form.notes.slice(0, 2000) || null,
          source: "lead-form",
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.error || "שמירת הפרטים נכשלה");
      if (result?.notificationQueued === false) {
        console.warn("Lead saved but notification email was not queued", result);
      }
      try {
        localStorage.setItem("lead:last", String(Date.now()));
        localStorage.setItem("lead:phone", phoneDigits);
      } catch { /* ignore */ }
    } catch (err) {
      toast.error(err instanceof Error ? `שגיאה בשמירה: ${err.message}` : "שגיאה בשמירת הפרטים");
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    setSubmitted(true);
    toast.success("תודה! הפרטים התקבלו, חן יחזור אליך בהקדם.");
    // GA4 conversion event — fires only if GA4 is wired up
    if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "generate_lead", {
        event_category: "engagement",
        license_type: license_type || "unknown",
        value: 1,
        currency: "ILS",
        transport_type: "beacon",
      });
      (window as any).gtag("event", "form_submit", {
        event_category: "engagement",
        form_id: "lead-form",
        license_type: license_type || "unknown",
        transport_type: "beacon",
      });
    }
  };

  const promises = [
    { icon: Zap, title: "חזרה מהירה", desc: "תוך שעות בודדות" },
    { icon: Shield, title: "ללא התחייבות", desc: "השארת פרטים ללא עלות" },
    { icon: UserCheck, title: "התאמה אישית", desc: "נמצא ביחד את המסלול" },
  ];

  return (
    <section ref={sectionRef} id="lead" className="py-7 sm:py-24 px-4 relative overflow-hidden scroll-mt-20">
      <div className="absolute -top-40 left-0 w-[30rem] h-[30rem] rounded-full bg-[oklch(0.62_0.20_255_/_0.18)] blur-[120px] -z-10" />
      <div className="absolute -bottom-40 right-0 w-[30rem] h-[30rem] rounded-full bg-[oklch(0.62_0.20_255_/_0.18)] blur-[120px] -z-10" />

      <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
        {/* left: areas + promises */}
        <div className="lg:col-span-2">
          <div className="inline-flex items-center gap-2 rounded-full glass border border-white/10 px-4 py-1.5 mb-4">
            <MapPin size={14} className="text-accent" />
            <span className="text-xs font-medium">אזורי לימוד</span>
          </div>
          <h2 className="text-display text-4xl sm:text-5xl mb-3">
            <span className="gradient-text-blue">אשקלון</span><br />והסביבה
          </h2>
          <p className="text-muted-foreground mb-6">שיעורים בכל אזור אשקלון והסביבה בהתאמה מלאה לזמן ולמיקום שלך.</p>

          <div className="space-y-3">
            {promises.map((p) => (
              <div key={p.title} className="flex items-center gap-4 p-3 rounded-2xl glass border border-white/10">
                <div className="w-11 h-11 rounded-xl bg-gradient-blue grid place-items-center text-white flex-shrink-0">
                  <p.icon size={20} />
                </div>
                <div>
                  <div className="font-bold text-sm">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* right: form */}
        <div id="lead-form" className="lg:col-span-3 glass-strong rounded-[2rem] p-6 sm:p-8 border border-white/10 shadow-card relative scroll-mt-24">
          <div className="mb-6">
            <p className="gradient-text-blue font-bold text-xs tracking-[0.2em] uppercase mb-2">השאירו פרטים</p>
            <h3 className="text-2xl sm:text-3xl font-black">חן יחזור אליך <span className="gradient-text-blue">בהקדם</span></h3>
          </div>

          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-blue grid place-items-center text-white shadow-glow">
                <Check size={32} strokeWidth={3} />
              </div>
              <h3 className="text-2xl font-black mb-2">תודה!</h3>
              <p className="text-muted-foreground">הפרטים התקבלו, חן יחזור אליך בהקדם.</p>
            </div>
          ) : !mounted ? (
            <div className="grid gap-4" aria-hidden="true">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="h-[68px] rounded-xl bg-white/5 border border-white/10" />
                <div className="h-[68px] rounded-xl bg-white/5 border border-white/10" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="h-[68px] rounded-xl bg-white/5 border border-white/10" />
                <div className="h-[68px] rounded-xl bg-white/5 border border-white/10" />
              </div>
              <div className="h-[92px] rounded-xl bg-white/5 border border-white/10" />
              <div className="h-[56px] rounded-xl bg-gradient-blue opacity-70" />
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-4">
              {/* honeypot — invisible to humans, irresistible to bots */}
              <div aria-hidden="true" className="absolute opacity-0 pointer-events-none -z-10" style={{ left: "-9999px", height: 0, overflow: "hidden" }}>
                <label>אתר אינטרנט<input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="שם מלא *">
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={60}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent transition" placeholder="ישראל ישראלי" />
                </Field>
                <Field label="טלפון *">
                  <input required type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={20}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent transition" placeholder="050-0000000" />
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="מעוניין/ת ללמוד">
                  <ClientOnly fallback={
                    <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-muted-foreground">
                      {form.interest}
                    </div>
                  }>
                    <select value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent transition">
                      <option>רכב אוטומט דרגה B</option>
                      <option>אופנוע A2</option>
                      <option>אופנוע A1</option>
                      <option>אופנוע A</option>
                    </select>
                  </ClientOnly>
                </Field>
                <Field label="אזור מגורים">
                  <input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} maxLength={60}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent transition" placeholder="אשקלון" />
                </Field>
              </div>
              <Field label="הערות נוספות">
                <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} maxLength={500}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent transition resize-none" placeholder="כל מה שחשוב שנדע..." />
              </Field>
              <button type="submit" disabled={submitting} className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-blue px-6 py-4 font-bold text-white shadow-glow hover:scale-[1.01] transition disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100">
                <Send size={18} /> {submitting ? "שולח..." : "שלח/י פרטים"}
              </button>
              <p className="text-[11px] text-center text-muted-foreground">בלחיצה על שליחה את/ה מאשר/ת שנחזור אליך בקרוב</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
