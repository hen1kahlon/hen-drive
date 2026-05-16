import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { uploadAdminMediaImage } from "@/lib/admin-media.functions";
import { imageFileToBase64 } from "@/lib/image-upload";
import { toast } from "sonner";
import { Save, Plus, Trash2, Upload, GripVertical } from "lucide-react";

export const Route = createFileRoute("/admin/license-cards")({ component: Page });

type Card = {
  id: string; code: string; title: string; subtitle: string; description: string;
  interest_label: string; icon: string; color: string; image_url: string | null;
  sort_order: number; is_active: boolean;
};

const ICONS = ["Car", "Bike", "Zap"] as const;
const COLORS = ["blue", "orange"] as const;

function Page() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("license_cards").select("*").order("sort_order");
    setCards((data ?? []) as Card[]);
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);

  const save = async (card: Card) => {
    const { error } = await supabase.from("license_cards").update({
      code: card.code, title: card.title, subtitle: card.subtitle, description: card.description,
      interest_label: card.interest_label, icon: card.icon, color: card.color,
      image_url: card.image_url, sort_order: card.sort_order, is_active: card.is_active,
    }).eq("id", card.id);
    if (error) toast.error(error.message); else toast.success("נשמר");
  };

  const add = async () => {
    const { error } = await supabase.from("license_cards").insert({
      code: "NEW", title: "כותרת חדשה", subtitle: "תת-כותרת",
      description: "תיאור", interest_label: "מסלול חדש", icon: "Car", color: "blue",
      sort_order: cards.length + 1,
    });
    if (error) toast.error(error.message); else { toast.success("נוסף"); void load(); }
  };

  const del = async (id: string) => {
    if (!confirm("למחוק?")) return;
    const { error } = await supabase.from("license_cards").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("נמחק"); void load(); }
  };

  if (loading) return <div className="text-center py-20 text-muted-foreground">טוען...</div>;

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black mb-1">דרגות רישיון</h1>
          <p className="text-xs text-muted-foreground">הכרטיסים שמופיעים בעמוד הראשי</p>
        </div>
        <button onClick={add} className="bg-gradient-orange text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5">
          <Plus size={14} /> הוסף כרטיס
        </button>
      </div>

      <div className="space-y-3">
        {cards.map((c) => <CardEditor key={c.id} card={c} onSave={save} onDelete={() => del(c.id)} />)}
      </div>
    </div>
  );
}

function CardEditor({ card: initial, onSave, onDelete }: { card: Card; onSave: (c: Card) => void; onDelete: () => void }) {
  const uploadImage = useServerFn(uploadAdminMediaImage);
  const [c, setC] = useState(initial);
  const [up, setUp] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => setC(initial), [initial]);

  const upload = async (file: File) => {
    setUp(true);
    try {
      const image = await imageFileToBase64(file);
      const result = await uploadImage({ data: { bucket: "gallery", folder: "license-cards", ...image } });
      setC({ ...c, image_url: result.publicUrl });
      toast.success("התמונה הועלתה — לחצו שמור כרטיס");
    } catch (e) { toast.error(e instanceof Error ? e.message : "שגיאה"); }
    finally { setUp(false); }
  };

  return (
    <div className="bg-card border border-white/10 rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <GripVertical size={16} className="text-muted-foreground" />
        <input value={c.code} onChange={(e) => setC({ ...c, code: e.target.value })} className="bg-background border border-white/10 rounded-lg px-2 py-1 text-xs font-bold w-20" placeholder="B" />
        <input type="number" value={c.sort_order} onChange={(e) => setC({ ...c, sort_order: Number(e.target.value) })} className="bg-background border border-white/10 rounded-lg px-2 py-1 text-xs w-16" />
        <label className="text-xs flex items-center gap-1 mr-auto">
          <input type="checkbox" checked={c.is_active} onChange={(e) => setC({ ...c, is_active: e.target.checked })} /> פעיל
        </label>
        <button onClick={onDelete} className="text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg"><Trash2 size={14} /></button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <input value={c.title} onChange={(e) => setC({ ...c, title: e.target.value })} placeholder="כותרת" className="bg-background border border-white/10 rounded-xl px-3 py-2 text-sm" />
        <input value={c.subtitle} onChange={(e) => setC({ ...c, subtitle: e.target.value })} placeholder="תת-כותרת" className="bg-background border border-white/10 rounded-xl px-3 py-2 text-sm" />
      </div>
      <textarea value={c.description} onChange={(e) => setC({ ...c, description: e.target.value })} placeholder="תיאור" rows={2} className="w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-sm" />
      <input value={c.interest_label} onChange={(e) => setC({ ...c, interest_label: e.target.value })} placeholder="תווית בטופס ליד" className="w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-sm" />

      <div className="grid sm:grid-cols-2 gap-3">
        <select value={c.icon} onChange={(e) => setC({ ...c, icon: e.target.value })} className="bg-background border border-white/10 rounded-xl px-3 py-2 text-sm">
          {ICONS.map((i) => <option key={i}>{i}</option>)}
        </select>
        <select value={c.color} onChange={(e) => setC({ ...c, color: e.target.value })} className="bg-background border border-white/10 rounded-xl px-3 py-2 text-sm">
          {COLORS.map((i) => <option key={i}>{i}</option>)}
        </select>
      </div>

      <div className="flex gap-2 items-start">
        <input value={c.image_url ?? ""} onChange={(e) => setC({ ...c, image_url: e.target.value || null })} placeholder="URL תמונה (אופציונלי)" dir="ltr" className="flex-1 bg-background border border-white/10 rounded-xl px-3 py-2 text-sm" />
        <button onClick={() => ref.current?.click()} disabled={up} className="bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl text-xs flex items-center gap-1 disabled:opacity-50 shrink-0">
          <Upload size={12} /> {up ? "..." : "העלה"}
        </button>
        <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />
      </div>
      {c.image_url && <img src={c.image_url} alt="" className="rounded-lg max-h-32 border border-white/10" />}

      <button onClick={() => onSave(c)} className="bg-gradient-orange text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5">
        <Save size={12} /> שמור כרטיס
      </button>
    </div>
  );
}
