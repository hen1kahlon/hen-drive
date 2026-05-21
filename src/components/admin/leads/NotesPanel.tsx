import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { X, CalendarClock, Plus, Trash2 } from "lucide-react";
import { type Lead, type LeadNote, timeAgo, toDatetimeLocal } from "./types";

export function NotesPanel({ lead, onClose, onFollowUp }: {
  lead: Lead;
  onClose: () => void;
  onFollowUp: (id: string, iso: string | null) => void;
}) {
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [followUp, setFollowUpLocal] = useState<string>(toDatetimeLocal(lead.follow_up_at));

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.from("lead_notes")
        .select("*").eq("lead_id", lead.id).order("created_at", { ascending: false });
      if (error) toast.error(error.message); else setNotes((data ?? []) as LeadNote[]);
      setLoading(false);
    })();
  }, [lead.id]);

  const add = async () => {
    const content = newNote.trim();
    if (!content) return;
    setSaving(true);
    const { data, error } = await supabase.from("lead_notes")
      .insert({ lead_id: lead.id, content }).select().single();
    setSaving(false);
    if (error) return toast.error(error.message);
    setNotes((p) => [data as LeadNote, ...p]);
    setNewNote("");
  };

  const removeNote = async (id: string) => {
    const { error } = await supabase.from("lead_notes").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setNotes((p) => p.filter((n) => n.id !== id));
  };

  const saveFollowUp = () => {
    onFollowUp(lead.id, followUp ? new Date(followUp).toISOString() : null);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60" onClick={onClose} />
      <div className="w-full max-w-md bg-background border-l border-white/10 h-full overflow-y-auto p-5 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-xs text-muted-foreground">היסטוריית הערות</div>
            <h2 className="text-lg font-black">{lead.full_name}</h2>
            <a href={`tel:${lead.phone}`} dir="ltr" className="text-xs text-blue-400 hover:underline">{lead.phone}</a>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-white/5 hover:bg-white/10"><X size={16} /></button>
        </div>

        <div className="bg-card border border-white/10 rounded-xl p-3 space-y-2">
          <div className="text-xs font-semibold flex items-center gap-1.5"><CalendarClock size={13} /> תאריך מעקב</div>
          <div className="flex gap-2">
            <input type="datetime-local" value={followUp} onChange={(e) => setFollowUpLocal(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-sm" />
            <button onClick={saveFollowUp} className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-3 rounded-lg">שמור</button>
            {lead.follow_up_at && (
              <button onClick={() => { setFollowUpLocal(""); onFollowUp(lead.id, null); }} className="bg-white/5 hover:bg-white/10 text-xs px-3 rounded-lg">נקה</button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} rows={3}
            placeholder="הוסף הערה פנימית..."
            className="w-full bg-card border border-white/10 rounded-xl p-3 text-sm resize-none" />
          <button onClick={add} disabled={saving || !newNote.trim()}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold py-2 rounded-xl text-sm flex items-center justify-center gap-1.5">
            <Plus size={14} /> הוסף הערה
          </button>
        </div>

        <div className="space-y-2">
          {loading ? <p className="text-xs text-muted-foreground">טוען...</p> :
            notes.length === 0 ? <p className="text-xs text-muted-foreground text-center py-4">אין הערות עדיין</p> :
            notes.map((n) => (
              <div key={n.id} className="bg-card border border-white/10 rounded-xl p-3 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm whitespace-pre-line flex-1">{n.content}</p>
                  <button onClick={() => removeNote(n.id)} className="p-1 rounded text-red-300 hover:bg-red-500/10"><Trash2 size={12} /></button>
                </div>
                <div className="text-[10px] text-muted-foreground">{new Date(n.created_at).toLocaleString("he-IL")} · {timeAgo(n.created_at)}</div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
