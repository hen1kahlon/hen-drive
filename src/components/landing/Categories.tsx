import { Car, Bike } from "lucide-react";
import { Link } from "@tanstack/react-router";
import vehSedan from "@/assets/vehicle-sedan.webp";
import vehBikeA from "@/assets/vehicle-bike-a.webp";

type Category = {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  img: string;
  icon: typeof Car;
  accent: string;
  interest: string;
  link: "/car-lessons-ashkelon" | "/motorcycle-lessons-ashkelon";
  linkLabel: string;
};

const categories: Category[] = [
  {
    id: "B",
    title: "רכב אוטומט",
    subtitle: "דרגה B",
    desc: "רכב פרטי אוטומט — הדרגה הפופולרית והמבוקשת ביותר.",
    img: vehSedan,
    icon: Car,
    accent: "#2563eb",
    interest: "רכב אוטומט דרגה B",
    link: "/car-lessons-ashkelon",
    linkLabel: "כל הפרטים על רכב אוטומט ←",
  },
  {
    id: "A",
    title: "אופנוע",
    subtitle: "A · A1 · A2 — לפי גיל וניסיון",
    desc: "A2 מגיל 16 · A1 מגיל 18 · A מגיל 21 — ידני ואוטומט, מינימום שיעורים לפי דרגה.",
    img: vehBikeA,
    icon: Bike,
    accent: "#2563eb",
    interest: "אופנוע",
    link: "/motorcycle-lessons-ashkelon",
    linkLabel: "כל הפרטים על אופנוע ←",
  },
];

function getLeadScrollOffset() {
  const header = document.querySelector("header");
  const headerHeight = header?.getBoundingClientRect().height ?? 64;
  return Math.ceil(headerHeight + 14);
}

function getLeadScrollTop(target: HTMLElement) {
  return Math.max(0, Math.round(target.getBoundingClientRect().top + window.scrollY - getLeadScrollOffset()));
}

function alignLeadAfterScroll(target: HTMLElement) {
  let done = false;
  let settleTimer = 0;
  let safetyTimer = 0;

  const finish = () => {
    if (done) return;
    done = true;
    window.clearTimeout(settleTimer);
    window.clearTimeout(safetyTimer);
    window.removeEventListener("scroll", onScroll);
    const delta = target.getBoundingClientRect().top - getLeadScrollOffset();
    if (Math.abs(delta) > 4) window.scrollBy({ top: delta, behavior: "auto" });
  };

  const scheduleFinish = () => {
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(finish, 160);
  };

  const onScroll = () => scheduleFinish();
  window.addEventListener("scroll", onScroll, { passive: true });
  scheduleFinish();
  safetyTimer = window.setTimeout(finish, 1800);
}

export function scrollToLead() {
  const target = (document.getElementById("lead-form") || document.getElementById("lead")) as HTMLElement | null;
  if (!target) return;
  requestAnimationFrame(() => {
    window.scrollTo({ top: getLeadScrollTop(target), behavior: "auto" });
    alignLeadAfterScroll(target);
  });
}

export function Categories({ onSelectInterest }: { onSelectInterest?: (interest: string) => void }) {
  return (
    <section id="categories" className="py-7 sm:py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-5 sm:mb-14">
          <p className="text-primary font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">בחרו את הדרגה</p>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-6xl">
            על מה <span className="text-primary">תרצו ללמוד</span>?
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 max-w-3xl mx-auto">
          {categories.map((c) => (
            <div
              key={c.id}
              className="relative bg-card rounded-3xl overflow-hidden border border-white/10 flex flex-col transition-transform duration-200 hover:scale-[1.02]"
            >
              <div className="h-[3px] w-full" style={{ background: c.accent }} />
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-black leading-tight">{c.title}</h3>
                    <p className="text-sm font-bold mt-1" style={{ color: c.accent }}>{c.subtitle}</p>
                  </div>
                  <div
                    className="w-16 h-16 rounded-2xl grid place-items-center border shrink-0"
                    style={{ background: `${c.accent}20`, color: c.accent, borderColor: `${c.accent}40` }}
                  >
                    <c.icon size={32} />
                  </div>
                </div>

                <div className="aspect-[4/3] grid place-items-center my-3 rounded-2xl bg-white/[0.03] border border-white/5 p-3 overflow-hidden">
                  <img
                    src={c.img}
                    alt={`${c.title} ${c.subtitle}`}
                    loading="lazy"
                    decoding="async"
                    width={400}
                    height={300}
                    className="w-full h-full object-contain"
                  />
                </div>

                <p className="text-xs text-muted-foreground mb-4 leading-relaxed flex-1">{c.desc}</p>

                <button
                  type="button"
                  onClick={() => onSelectInterest?.(c.interest)}
                  className="block w-full text-center rounded-xl py-2.5 text-sm font-bold text-white transition-colors"
                  style={{ background: c.accent }}
                >
                  אני רוצה להתחיל ←
                </button>
                <Link
                  to={c.link}
                  className="block w-full text-center rounded-xl border border-white/10 py-2.5 text-sm font-medium bg-background hover:bg-white/5 transition-colors mt-2"
                >
                  {c.linkLabel}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
