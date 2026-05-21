export type LeadStatus =
  | "new"
  | "contacted"
  | "lesson_scheduled"
  | "won"
  | "closed"
  | "not_relevant"
  | "archived";

export type Lead = {
  id: string; full_name: string; phone: string; license_type: string | null;
  source: string | null; status: LeadStatus;
  notes: string | null; interest: string | null; area: string | null;
  follow_up_at: string | null; created_at: string;
};

export type LeadNote = { id: string; lead_id: string; content: string; created_at: string };

export const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "חדש",
  contacted: "נוצר קשר",
  lesson_scheduled: "קבע שיעור",
  won: "נסגר בהצלחה",
  closed: "נסגר",
  not_relevant: "לא רלוונטי",
  archived: "ארכיון",
};

export const STATUS_STYLES: Record<LeadStatus, { dot: string; chip: string; bar: string }> = {
  new:              { dot: "bg-yellow-400",  chip: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",   bar: "bg-yellow-400" },
  contacted:        { dot: "bg-blue-400",    chip: "bg-blue-500/20 text-blue-300 border-blue-500/30",         bar: "bg-blue-400" },
  lesson_scheduled: { dot: "bg-violet-400",  chip: "bg-violet-500/20 text-violet-300 border-violet-500/30",   bar: "bg-violet-400" },
  won:              { dot: "bg-emerald-400", chip: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", bar: "bg-emerald-400" },
  closed:           { dot: "bg-zinc-400",    chip: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",         bar: "bg-zinc-400" },
  not_relevant:     { dot: "bg-red-400",     chip: "bg-red-500/20 text-red-300 border-red-500/30",            bar: "bg-red-400" },
  archived:         { dot: "bg-zinc-600",    chip: "bg-zinc-700/30 text-zinc-400 border-zinc-600/30",         bar: "bg-zinc-600" },
};

export function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "לפני רגע";
  if (diff < 3600) return `לפני ${Math.floor(diff / 60)} ד׳`;
  if (diff < 86400) return `לפני ${Math.floor(diff / 3600)} ש׳`;
  if (diff < 86400 * 7) return `לפני ${Math.floor(diff / 86400)} ימים`;
  return new Date(iso).toLocaleDateString("he-IL");
}

export function followUpBadge(iso: string | null): { label: string; cls: string } | null {
  if (!iso) return null;
  const d = new Date(iso).getTime();
  const now = Date.now();
  const dayMs = 86400_000;
  const dayStart = new Date(); dayStart.setHours(0, 0, 0, 0);
  const todayMs = dayStart.getTime();
  const fmt = new Date(iso).toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit" });
  if (d < now) return { label: `מעקב באיחור · ${fmt}`, cls: "bg-red-500/20 text-red-300 border-red-500/30" };
  if (d < todayMs + dayMs) return { label: `מעקב היום · ${fmt}`, cls: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" };
  return { label: `מעקב · ${fmt}`, cls: "bg-blue-500/20 text-blue-300 border-blue-500/30" };
}

export function toDatetimeLocal(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60_000).toISOString().slice(0, 16);
}

export function playDing() {
  try {
    const AC = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    const ctx = new AC();
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(880, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.18);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    o.connect(g).connect(ctx.destination); o.start();
    o.stop(ctx.currentTime + 0.42);
    setTimeout(() => ctx.close(), 700);
  } catch { /* ignore */ }
}
