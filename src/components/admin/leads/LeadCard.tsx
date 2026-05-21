import { Phone, MessageCircle, Check, Trash2, StickyNote, GraduationCap, Trophy, XCircle, Ban, CalendarClock, Clock } from "lucide-react";
import { type Lead, type LeadStatus, STATUS_LABEL, STATUS_STYLES, timeAgo, followUpBadge, toDatetimeLocal } from "./types";

export function StatTile({ label, value, tone }: { label: string; value: number | string; tone: "blue" | "emerald" | "zinc" | "violet" }) {
  const tones = {
    blue: "from-blue-500/15 to-blue-500/0 border-blue-500/20",
    emerald: "from-emerald-500/15 to-emerald-500/0 border-emerald-500/20",
    zinc: "from-zinc-500/15 to-zinc-500/0 border-zinc-500/20",
    violet: "from-violet-500/15 to-violet-500/0 border-violet-500/20",
  };
  return (
    <div className={`rounded-2xl p-4 border bg-gradient-to-br ${tones[tone]}`}>
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="text-2xl font-black mt-1">{value}</div>
    </div>
  );
}

export function LeadActions({ lead: l, onStatus, onDelete, onNotes, compact }: {
  lead: Lead;
  onStatus: (id: string, s: LeadStatus) => void;
  onDelete: () => void;
  onNotes: () => void;
  compact?: boolean;
}) {
  const phoneDigits = l.phone.replace(/\D/g, "");
  const btn = "p-2 rounded-lg transition";
  return (
    <div className={`flex flex-wrap gap-1.5 ${compact ? "" : ""}`}>
      <a href={`tel:${l.phone}`} className={`${btn} bg-blue-500/20 text-blue-300 hover:bg-blue-500/30`} title="התקשר"><Phone size={14} /></a>
      <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noopener noreferrer" className={`${btn} bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30`} title="וואטסאפ"><MessageCircle size={14} /></a>
      {l.status !== "contacted" && <button onClick={() => onStatus(l.id, "contacted")} className={`${btn} bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30`} title="נוצר קשר"><Check size={14} /></button>}
      {l.status !== "lesson_scheduled" && <button onClick={() => onStatus(l.id, "lesson_scheduled")} className={`${btn} bg-violet-500/20 text-violet-300 hover:bg-violet-500/30`} title="קבע שיעור"><GraduationCap size={14} /></button>}
      {l.status !== "won" && <button onClick={() => onStatus(l.id, "won")} className={`${btn} bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30`} title="נסגר בהצלחה"><Trophy size={14} /></button>}
      {l.status !== "closed" && <button onClick={() => onStatus(l.id, "closed")} className={`${btn} bg-white/5 hover:bg-white/10`} title="סגור"><XCircle size={14} /></button>}
      {l.status !== "not_relevant" && <button onClick={() => onStatus(l.id, "not_relevant")} className={`${btn} bg-red-500/10 text-red-300 hover:bg-red-500/20`} title="לא רלוונטי"><Ban size={14} /></button>}
      <button onClick={onNotes} className={`${btn} bg-white/5 hover:bg-white/10`} title="הערות / היסטוריה"><StickyNote size={14} /></button>
      <button onClick={onDelete} className={`${btn} bg-red-500/10 text-red-300 hover:bg-red-500/20`} title="מחק"><Trash2 size={14} /></button>
    </div>
  );
}

export function LeadCard({ lead: l, onStatus, onDelete, onNotes, onFollowUp }: {
  lead: Lead;
  onStatus: (id: string, s: LeadStatus) => void;
  onDelete: () => void;
  onNotes: () => void;
  onFollowUp: (id: string, iso: string | null) => void;
}) {
  const st = STATUS_STYLES[l.status];
  const fu = followUpBadge(l.follow_up_at);
  return (
    <div className="bg-card border border-white/10 rounded-2xl overflow-hidden">
      <div className={`h-1 ${st.bar}`} />
      <div className="p-4 space-y-2.5">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-bold">{l.full_name}</span>
              {l.license_type && <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full">{l.license_type}</span>}
              <span className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full border ${st.chip}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                {STATUS_LABEL[l.status]}
              </span>
              {fu && <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${fu.cls}`}><CalendarClock size={10} /> {fu.label}</span>}
            </div>
            <a href={`tel:${l.phone}`} dir="ltr" className="text-sm text-foreground/90 inline-flex items-center gap-1.5 hover:text-blue-400 hover:underline">
              <Phone size={12} /> {l.phone}
            </a>
          </div>
          <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1" title={new Date(l.created_at).toLocaleString("he-IL")}>
            <Clock size={11} /> {timeAgo(l.created_at)}
          </span>
        </div>

        {(l.interest || l.area || l.source) && (
          <div className="text-[11px] text-foreground/70 flex flex-wrap gap-x-2 gap-y-1">
            {l.interest && <span>מסלול: <b className="text-foreground/90">{l.interest}</b></span>}
            {l.area && <span>אזור: <b className="text-foreground/90">{l.area}</b></span>}
            {l.source && <span>מקור: <b className="text-foreground/90">{l.source}</b></span>}
          </div>
        )}

        {l.notes && <div className="text-[11px] text-muted-foreground whitespace-pre-line bg-white/[0.02] rounded-lg p-2">{l.notes}</div>}

        <div className="pt-1 flex flex-wrap items-center gap-2">
          <LeadActions lead={l} onStatus={onStatus} onDelete={onDelete} onNotes={onNotes} />
          <label className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <CalendarClock size={12} />
            <input
              type="datetime-local"
              value={toDatetimeLocal(l.follow_up_at)}
              onChange={(e) => onFollowUp(l.id, e.target.value ? new Date(e.target.value).toISOString() : null)}
              className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[11px]"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
