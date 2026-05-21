import { useState, useEffect } from "react";
import { Accessibility, Plus, Minus, Contrast, RotateCcw, X } from "lucide-react";

export function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [underline, setUnderline] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale * 100}%`;
  }, [fontScale]);

  useEffect(() => {
    document.documentElement.classList.toggle("a11y-contrast", highContrast);
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.classList.toggle("a11y-underline", underline);
  }, [underline]);

  const reset = () => {
    setFontScale(1);
    setHighContrast(false);
    setUnderline(false);
  };

  return (
    <>
      <style>{`
        html.a11y-contrast { filter: contrast(1.35) saturate(1.2); }
        html.a11y-underline a { text-decoration: underline !important; }
      `}</style>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="פתיחת תפריט נגישות"
        aria-expanded={open}
        className="fixed bottom-20 md:bottom-6 right-4 z-[60] h-11 w-11 md:h-14 md:w-14 rounded-full bg-[oklch(0.55_0.22_255)] hover:bg-[oklch(0.62_0.22_255)] text-white shadow-glow flex items-center justify-center border-2 border-white/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40 transition-colors"
      >
        <Accessibility className="!size-5 md:!size-7" />
      </button>

      {open && (
        <div
          dir="rtl"
          role="dialog"
          aria-label="תפריט נגישות"
          className="fixed bottom-32 md:bottom-24 right-4 z-[60] w-72 max-w-[calc(100vw-2rem)] glass-strong border border-white/10 rounded-2xl p-4 shadow-card text-foreground"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Accessibility className="size-5 text-[oklch(0.7_0.18_255)]" />
              תפריט נגישות
            </h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="סגירה"
              className="h-8 w-8 rounded-md hover:bg-white/10 flex items-center justify-center"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 bg-white/5 rounded-lg p-2">
              <span className="text-sm">גודל טקסט</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setFontScale((s) => Math.max(0.85, +(s - 0.1).toFixed(2)))}
                  aria-label="הקטנת טקסט"
                  className="h-8 w-8 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center"
                >
                  <Minus className="size-4" />
                </button>
                <span className="text-xs w-10 text-center tabular-nums">{Math.round(fontScale * 100)}%</span>
                <button
                  type="button"
                  onClick={() => setFontScale((s) => Math.min(1.5, +(s + 0.1).toFixed(2)))}
                  aria-label="הגדלת טקסט"
                  className="h-8 w-8 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setHighContrast((v) => !v)}
              aria-pressed={highContrast}
              className={`w-full flex items-center justify-between gap-2 rounded-lg p-2 text-sm transition-colors ${highContrast ? "bg-[oklch(0.55_0.22_255)] text-white" : "bg-white/5 hover:bg-white/10"}`}
            >
              <span className="flex items-center gap-2"><Contrast className="size-4" /> ניגודיות גבוהה</span>
              <span className="text-xs opacity-80">{highContrast ? "פעיל" : "כבוי"}</span>
            </button>

            <button
              type="button"
              onClick={() => setUnderline((v) => !v)}
              aria-pressed={underline}
              className={`w-full flex items-center justify-between gap-2 rounded-lg p-2 text-sm transition-colors ${underline ? "bg-[oklch(0.55_0.22_255)] text-white" : "bg-white/5 hover:bg-white/10"}`}
            >
              <span>הדגשת קישורים</span>
              <span className="text-xs opacity-80">{underline ? "פעיל" : "כבוי"}</span>
            </button>

            <button
              type="button"
              onClick={reset}
              className="w-full flex items-center justify-center gap-2 rounded-lg p-2 text-sm bg-white/5 hover:bg-white/10"
            >
              <RotateCcw className="size-4" /> איפוס
            </button>
          </div>

          <p className="mt-3 text-[11px] text-muted-foreground leading-relaxed">
            האתר פועל לעמידה בתקן הנגישות הישראלי (ת"י 5568) ברמת AA.
          </p>
        </div>
      )}
    </>
  );
}
