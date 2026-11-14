import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

export const LEGAL_UPDATED = "15.11.2026";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      <header className="sticky top-0 z-40 bg-background/95 border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center">
          <Link to="/" className="flex items-center gap-2 font-bold text-sm">
            <ArrowLeft size={16} /> חזרה לאתר
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-10 sm:py-14 text-right">
        <h1 className="text-3xl sm:text-4xl font-black mb-2">{title}</h1>
        <p className="text-xs text-muted-foreground mb-8">עודכן לאחרונה: {LEGAL_UPDATED}</p>
        <div className="space-y-6 text-sm sm:text-base leading-relaxed text-foreground/85 [&_h2]:text-xl [&_h2]:font-black [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pr-5 [&_ul]:space-y-1 [&_a]:text-primary [&_a]:underline">
          {children}
        </div>
      </main>
      <LegalLinks />
    </div>
  );
}

export function LegalLinks({ className = "" }: { className?: string }) {
  return (
    <nav aria-label="מידע משפטי" className={`flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs py-6 ${className}`} style={{ color: "rgba(255,255,255,0.5)" }}>
      <Link to="/accessibility" className="hover:text-foreground underline-offset-4 hover:underline">הצהרת נגישות</Link>
      <span aria-hidden>·</span>
      <Link to="/privacy" className="hover:text-foreground underline-offset-4 hover:underline">מדיניות פרטיות</Link>
    </nav>
  );
}
