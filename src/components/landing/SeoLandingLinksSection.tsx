import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

const seoLandingLinks = [
  { to: "/car-lessons-ashkelon", title: "שיעורי רכב באשקלון", desc: "רכב אוטומט חדש והכנה לטסט" },
  { to: "/motorcycle-lessons-ashkelon", title: "שיעורי אופנוע באשקלון", desc: "כל הדרגות: A, A1, A2 – ידני ואוטומט" },
] as const;

export function SeoLandingLinksSection() {
  return (
    <section id="seo-pages" className="py-7 sm:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-5 sm:mb-10">
          <p className="text-primary font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">מסלולי לימוד באשקלון</p>
          <h2 className="text-display text-4xl sm:text-5xl">
            בחרו דף מתאים <span className="text-primary">והתחילו עכשיו</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-xl mx-auto">
            דפי מידע מלאים עם שאלות נפוצות, המלצות תלמידים וכפתורי וואטסאפ לכל מסלול.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {seoLandingLinks.map((item) => (
            <div key={item.to}>
              <Link to={item.to} className="block rounded-2xl border border-white/10 bg-card p-5">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <ArrowLeft size={18} />
                </div>
                <h3 className="text-lg font-black mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.desc}</p>
                <span className="inline-flex items-center gap-2 text-xs font-bold text-accent">
                  פתחו דף מלא <ArrowLeft size={14} />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
