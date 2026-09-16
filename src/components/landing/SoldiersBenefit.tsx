import { MessageCircle, Phone } from "lucide-react";
import { useSiteSettings, waUrl } from "@/lib/site-settings";

const BENEFITS = [
  "הפיקדון שלך מממן את השיעורים — ללא עלות מכיסך",
  "אופנוע ורכב — כל סוגי הרישיונות במקום אחד",
  "מתחילים תוך ימים ספורים — בלי המתנה ארוכה",
  "שעות גמישות — ערבים, שישי, לפי הנוחות שלך",
  "ליווי אישי צמוד — מהשיעור הראשון ועד הטסט",
  "כלי רכב ואופנועים חדשים ומעודכנים",
  "אחוזי הצלחה גבוהים במיוחד בטסט ראשון",
  "בלי בירוקרטיה — פניה ישירה בוואטסאפ",
];

function CheckIcon() {
  return (
    <span
      className="flex-shrink-0 w-6 h-6 rounded-full grid place-items-center"
      style={{ background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.3)" }}
      aria-hidden
    >
      <svg viewBox="0 0 14 14" width="13" height="13" fill="none">
        <polyline points="2,7 5.5,10.5 12,3.5" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function SoldiersBenefit() {
  const s = useSiteSettings();

  return (
    <section
      id="chayalim"
      className="relative py-16 lg:py-24 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0f1729 0%, #1a2d5a 100%)" }}
    >
      {/* subtle glow blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full -z-0 pointer-events-none" style={{ background: "rgba(245,158,11,0.05)", filter: "blur(80px)" }} />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full -z-0 pointer-events-none" style={{ background: "rgba(37,99,235,0.08)", filter: "blur(80px)" }} />

      <div className="relative max-w-6xl mx-auto px-4">
        {/* badge */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-bold"
          style={{ background: "rgba(245,158,11,0.13)", border: "1px solid rgba(245,158,11,0.35)", color: "#fbbf24" }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: "#fbbf24" }} />
          🎖️ לחיילים משוחררים
        </div>

        {/* headline */}
        <h2 className="text-display text-[2rem] sm:text-4xl lg:text-5xl font-black leading-tight mb-4">
          לומדים נהיגה<br />
          <span style={{ color: "#60a5fa" }}>על חשבון הפיקדון</span>
        </h2>

        <p className="text-base sm:text-lg mb-8 max-w-xl" style={{ color: "#94a3b8" }}>
          השתחררת? הפיקדון שנצבר לך בצבא מממן שיעורי נהיגה — אופנוע או רכב.
          נלווה אותך צעד אחר צעד עד הרישיון, בלי בירוקרטיה.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 mb-12">
          <a
            href={waUrl(s)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-bold text-sm"
            style={{ background: "rgba(37,211,102,0.15)", border: "1px solid rgba(37,211,102,0.4)", color: "#25D366" }}
          >
            <MessageCircle size={16} aria-hidden />
            שלח וואטסאפ
          </a>
          <a
            href={`tel:${s.contact.phone}`}
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-bold text-sm border border-white/10"
            style={{ background: "rgba(255,255,255,0.06)", color: "#f8fafc" }}
          >
            <Phone size={16} aria-hidden />
            התקשר
          </a>
        </div>

        {/* benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {BENEFITS.map((text) => (
            <div
              key={text}
              className="flex items-start gap-3 rounded-xl p-4"
              style={{ background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <CheckIcon />
              <span className="text-sm font-medium leading-snug" style={{ color: "#e2e8f0" }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
