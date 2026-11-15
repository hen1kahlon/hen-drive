import { useEffect, useState } from "react";
import { Languages, X } from "lucide-react";

const LANGS = [
  { code: "iw", label: "עברית", short: "עב" },
  { code: "en", label: "English", short: "EN" },
  { code: "ru", label: "Русский", short: "RU" },
  { code: "ar", label: "العربية", short: "عر" },
] as const;

type LangCode = (typeof LANGS)[number]["code"];

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: { translate?: { TranslateElement: new (opts: object, id: string) => unknown } };
  }
}

function readLang(): LangCode {
  const m = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]+\/([^;]+)/);
  const code = m?.[1];
  return LANGS.some((l) => l.code === code) ? (code as LangCode) : "iw";
}

function writeLang(code: LangCode) {
  const host = location.hostname;
  const apex = host.replace(/^www\./, "");
  const value = code === "iw" ? "" : `/iw/${code}`;
  const expires = code === "iw" ? "; expires=Thu, 01 Jan 1970 00:00:00 GMT" : "";
  for (const domain of ["", `; domain=${host}`, `; domain=.${apex}`]) {
    document.cookie = `googtrans=${value}; path=/${domain}${expires}`;
  }
}

// Google Translate rewrites text nodes React owns; without this React throws on re-render.
function guardDomForTranslation() {
  const proto = Node.prototype as Node & { __gtPatched?: boolean };
  if (proto.__gtPatched) return;
  proto.__gtPatched = true;
  const removeChild = proto.removeChild;
  proto.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) return child;
    return removeChild.call(this, child) as T;
  };
  const insertBefore = proto.insertBefore;
  proto.insertBefore = function <T extends Node>(this: Node, node: T, ref: Node | null): T {
    if (ref && ref.parentNode !== this) return node;
    return insertBefore.call(this, node, ref) as T;
  };
}

function loadTranslator() {
  if (document.getElementById("gt-script")) return;
  guardDomForTranslation();
  window.googleTranslateElementInit = () => {
    const TE = window.google?.translate?.TranslateElement;
    if (TE) new TE({ pageLanguage: "iw", autoDisplay: false }, "gt-el");
  };
  const s = document.createElement("script");
  s.id = "gt-script";
  s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  s.async = true;
  document.body.appendChild(s);
}

export function LanguageSwitcher() {
  const [lang, setLang] = useState<LangCode>("iw");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const current = readLang();
    setLang(current);
    if (current !== "iw") loadTranslator();
  }, []);

  const choose = (code: LangCode) => {
    setOpen(false);
    if (code === lang) return;
    writeLang(code);
    location.reload();
  };

  const active = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  return (
    <>
      <style>{`
        .goog-te-banner-frame, .skiptranslate iframe, #goog-gt-tt, .goog-te-balloon-frame { display: none !important; }
        body { top: 0 !important; }
        .goog-text-highlight { background: none !important; box-shadow: none !important; }
      `}</style>
      <div id="gt-el" className="hidden" aria-hidden />
      <div className="notranslate fixed top-1/2 -translate-y-1/2 left-0 z-[55]" translate="no">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Language / שפה"
          aria-expanded={open}
          className="flex flex-col items-center gap-1 rounded-r-2xl border border-l-0 border-white/15 bg-[oklch(0.2_0.02_260)]/90 backdrop-blur px-2 py-3 text-white shadow-glow hover:bg-[oklch(0.28_0.03_260)] transition-colors"
        >
          <Languages className="size-5" />
          <span className="text-[11px] font-bold leading-none">{active.short}</span>
        </button>

        {open && (
          <div
            role="menu"
            className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-40 rounded-2xl border border-white/10 glass-strong p-2 shadow-card"
          >
            <div className="flex items-center justify-between px-2 pb-1">
              <span className="text-xs text-muted-foreground">Language</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="rounded p-1 hover:bg-white/10">
                <X className="size-3.5" />
              </button>
            </div>
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                role="menuitem"
                onClick={() => choose(l.code)}
                dir={l.code === "iw" || l.code === "ar" ? "rtl" : "ltr"}
                className={`block w-full rounded-lg px-3 py-2 text-sm font-bold text-start transition-colors ${
                  l.code === lang ? "bg-primary/20 text-primary" : "hover:bg-white/10"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
