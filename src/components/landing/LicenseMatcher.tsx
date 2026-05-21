import { useState } from "react";
import { Car, Bike, MessageCircle, Sparkles } from "lucide-react";
import { useSiteSettings } from "@/lib/site-settings";

export function LicenseMatcher() {
  const s = useSiteSettings();
  const [age, setAge] = useState<number | "">("");
  const [hasLicense, setHasLicense] = useState<"yes" | "no" | "">("");
  const [vehicle, setVehicle] = useState<"car" | "moto" | "">("");
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  type Rec = { code: string; title: string; note: string; interest: string };
  const recommendations: Rec[] | null = (() => {
    if (!age || !hasLicense || !vehicle) return null;
    const a = Number(age);
    if (vehicle === "car") {
      if (a < 16.5) return [{ code: "B", title: "רכב אוטומט (B)", note: "צריך להמתין לגיל 16.5 כדי להתחיל ללמוד.", interest: "רכב אוטומט דרגה B" }];
      return [{ code: "B", title: "רכב אוטומט (B)", note: "מתאים לך! נתחיל את התהליך לרישיון רכב פרטי.", interest: "רכב אוטומט דרגה B" }];
    }
    // moto
    if (a < 16) {
      return [{ code: "A2", title: "אופנוע/קטנוע A2", note: "צריך להמתין לגיל 16 כדי להתחיל ללמוד A2.", interest: "אופנוע A2" }];
    }
    if (a === 16) {
      return [{ code: "A2", title: "אופנוע/קטנוע A2", note: "בגיל 16 ניתן ללמוד A2 בלבד — בכפוף לאישור הורים.", interest: "אופנוע A2 (גיל 16 — דורש אישור הורים)" }];
    }
    if (a === 17) {
      return [{ code: "A2", title: "אופנוע/קטנוע A2", note: "בגיל 17 ניתן ללמוד A2 — ללא צורך באישור הורים.", interest: "אופנוע A2" }];
    }
    // age >= 18
    const recs: Rec[] = [];
    if (hasLicense === "no") {
      recs.push({ code: "A2", title: "אופנוע/קטנוע A2", note: "מתאים לך — עד 14.7 כ״ס (125 סמ״ק).", interest: "אופנוע A2" });
      recs.push({ code: "A1", title: "אופנוע/קטנוע A1", note: "מתאים לך — עד 47 כ״ס.", interest: "אופנוע A1" });
    } else {
      recs.push({ code: "A1", title: "אופנוע/קטנוע A1", note: "מתאים לך — עד 47 כ״ס.", interest: "אופנוע A1" });
      if (a >= 21) {
        recs.push({ code: "A", title: "אופנוע ללא הגבלה (A)", note: "מתאים לך — בכפוף לרישיון A1 עם ותק של שנה לפחות.", interest: "אופנוע A" });
      }
    }
    return recs;
  })();


  const hasMultiple = !!recommendations && recommendations.length > 1;
  const activeRec = recommendations
    ? recommendations.find((r) => r.code === selectedCode) ?? (hasMultiple ? null : recommendations[0])
    : null;

  const waMatcherUrl = (() => {
    if (!activeRec) return "#";
    const vehicleWord = vehicle === "car" ? "רכב" : "אופנוע";
    const lines = [
      "היי חן, הגעתי דרך האתר 👋",
      "",
      "בדקתי איזה רישיון מתאים לי:",
      "",
      `גיל: ${age}`,
      `יש לי רישיון קודם: ${hasLicense === "yes" ? "כן" : "לא"}`,
    ];
    lines.push(`תחום לימוד: ${vehicleWord}`);
    lines.push(`הדרגה שאני מעוניין/ת בה: ${activeRec.title}`);
    lines.push("", "אשמח לקבל פרטים ולהתחיל ללמוד 🙌");
    const msg = lines.join("\n");
    return `https://wa.me/${s.contact.phone_intl}?text=${encodeURIComponent(msg)}`;
  })();

  return (
    <section id="match" className="py-7 sm:py-24 px-4 relative">
      <div className="absolute inset-0 -z-10 grid-bg opacity-30" />
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-5 sm:mb-14">
          <p className="gradient-text-blue font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">כלי חכם</p>
          <h2 className="text-display text-4xl sm:text-5xl">
            איזה <span className="gradient-text-blue">רישיון</span> <span className="text-white">מתאים</span> <span className="gradient-text-blue">לי</span>?
          </h2>
          <p className="text-muted-foreground mt-2 sm:mt-4 max-w-xl mx-auto">ענה על 3 שאלות ונמצא לך את הדרגה המתאימה ביותר.</p>
        </div>

        <div className="glass-strong rounded-[2rem] border border-white/10 p-4 sm:p-8 grid lg:grid-cols-2 gap-4 sm:gap-8 shadow-card">
          <div className="space-y-3 sm:space-y-5">
            <div>
              <label className="text-xs font-bold mb-2 block text-muted-foreground">גיל</label>
              <input type="number" min={14} max={99} value={age} onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-base outline-none focus:border-accent transition" placeholder="לדוגמה: 18" />
            </div>
            <div>
              <label className="text-xs font-bold mb-2 block text-muted-foreground">יש לך רישיון קיים?</label>
              <div className="grid grid-cols-2 gap-2">
                {[{ v: "yes", l: "כן" }, { v: "no", l: "לא" }].map((o) => (
                  <button key={o.v} type="button" onClick={() => setHasLicense(o.v as "yes" | "no")}
                    className={`rounded-xl py-3 font-bold text-sm border transition ${hasLicense === o.v ? "bg-gradient-blue text-white border-transparent shadow-glow" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
                    {o.l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold mb-2 block text-muted-foreground">רכב או אופנוע?</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setVehicle("car")}
                  className={`rounded-xl py-3 font-bold text-sm border transition flex items-center justify-center gap-2 ${vehicle === "car" ? "bg-gradient-blue text-white border-transparent shadow-glow" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
                  <Car size={16} /> רכב
                </button>
                <button type="button" onClick={() => setVehicle("moto")}
                  className={`rounded-xl py-3 font-bold text-sm border transition flex items-center justify-center gap-2 ${vehicle === "moto" ? "bg-gradient-blue text-white border-transparent shadow-glow" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
                  <Bike size={16} /> אופנוע
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-background/40 p-4 sm:p-6 flex flex-col justify-center min-h-[140px] sm:min-h-[220px]">
            {recommendations && recommendations.length > 0 ? (
              <div>
                <p className="text-xs font-bold tracking-[0.2em] uppercase gradient-text-blue mb-2">
                  {hasMultiple ? "בחר/י את הדרגה שמעניינת אותך" : "ההמלצה שלנו"}
                </p>
                <div className="space-y-3 mb-5">
                  {recommendations.map((r) => {
                    const selected = activeRec?.code === r.code;
                    const Tag = hasMultiple ? "button" : "div";
                    return (
                      <Tag
                        key={r.code}
                        {...(hasMultiple ? { type: "button" as const, onClick: () => setSelectedCode(r.code) } : {})}
                        className={`w-full text-right rounded-xl border p-3 sm:p-4 transition ${
                          hasMultiple
                            ? selected
                              ? "border-primary bg-primary/10 shadow-glow"
                              : "border-white/10 bg-white/5 hover:bg-white/10"
                            : "border-white/10 bg-white/5"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h3 className="text-display text-2xl sm:text-3xl mb-1">{r.title}</h3>
                            <p className="text-muted-foreground text-sm">{r.note}</p>
                          </div>
                          {hasMultiple && (
                            <span className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? "border-accent bg-accent" : "border-white/30"}`}>
                              {selected && <span className="w-2 h-2 rounded-full bg-white" />}
                            </span>
                          )}
                        </div>
                      </Tag>
                    );
                  })}
                </div>
                {activeRec ? (
                  <a
                    href={waMatcherUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-bold text-white shadow-[0_10px_30px_-10px_rgba(37,211,102,0.8)] hover:scale-105 transition"
                  >
                    <MessageCircle size={16} /> שלח לי פרטים בוואטסאפ
                  </a>
                ) : (
                  <p className="text-xs text-muted-foreground">בחר/י דרגה אחת כדי לשלוח לחן בוואטסאפ.</p>
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <Sparkles size={28} className="mx-auto mb-3 text-accent" />
                <p className="text-sm">מלא/י את 3 השאלות מימין ונמליץ לך על הדרגה המתאימה.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
