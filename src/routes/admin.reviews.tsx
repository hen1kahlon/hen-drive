import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { uploadAdminMediaImage } from "@/lib/admin-media.functions";
import { imageFileToBase64 } from "@/lib/image-upload";
import { toast } from "sonner";
import { Star, Check, X, Trash2, Plus, Sparkles, Upload } from "lucide-react";

export const Route = createFileRoute("/admin/reviews")({ component: ReviewsPage });

type Review = {
  id: string; full_name: string; rating: number; license_type: string;
  content: string; image_url: string | null;
  status: "pending" | "approved" | "rejected";
  is_featured: boolean; created_at: string;
};

function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [editing, setEditing] = useState<Review | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message); else setReviews((data ?? []) as Review[]);
  }, []);
  useEffect(() => { load(); }, [load]);

  const updateField = async (id: string, patch: Partial<Review>) => {
    const { error } = await supabase.from("reviews").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("למחוק?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("נמחק"); load();
  };

  const filtered = reviews.filter((r) => filter === "all" || r.status === filter);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black mb-1">ביקורות</h1>
          <p className="text-sm text-muted-foreground">אישור, עריכה והבלטה</p>
        </div>
        <button onClick={() => setEditing({ id: "", full_name: "", rating: 5, license_type: "B", content: "", image_url: null, status: "approved", is_featured: false, created_at: "" })}
          className="bg-gradient-orange text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"><Plus size={14} /> הוסף</button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["pending", "approved", "rejected", "all"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold ${filter === f ? "bg-gradient-orange text-white" : "bg-white/5 text-muted-foreground hover:bg-white/10"}`}>
            {f === "pending" ? "ממתינות" : f === "approved" ? "מאושרות" : f === "rejected" ? "נדחו" : "הכל"} ({reviews.filter((r) => f === "all" || r.status === f).length})
          </button>
        ))}
      </div>

      <div className="grid gap-2">
        {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-12">אין ביקורות</p>}
        {filtered.map((r) => (
          <div key={r.id} className="bg-card border border-white/10 rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold">{r.full_name}</span>
                  <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full">{r.license_type}</span>
                  {r.is_featured && <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full inline-flex items-center gap-1"><Sparkles size={10} /> מובלטת</span>}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${r.status === "approved" ? "bg-green-500/20 text-green-300" : r.status === "rejected" ? "bg-red-500/20 text-red-300" : "bg-yellow-500/20 text-yellow-300"}`}>
                    {r.status === "approved" ? "מאושרת" : r.status === "rejected" ? "נדחתה" : "ממתינה"}
                  </span>
                </div>
                <div className="flex gap-0.5">{[...Array(r.rating)].map((_, i) => <Star key={i} size={13} className="fill-[oklch(0.78_0.18_55)] text-[oklch(0.78_0.18_55)]" />)}</div>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {r.status !== "approved" && <button onClick={() => updateField(r.id, { status: "approved" })} className="bg-green-500/20 text-green-300 hover:bg-green-500/30 p-2 rounded-lg"><Check size={14} /></button>}
                {r.status !== "rejected" && <button onClick={() => updateField(r.id, { status: "rejected" })} className="bg-red-500/20 text-red-300 hover:bg-red-500/30 p-2 rounded-lg"><X size={14} /></button>}
                <button onClick={() => updateField(r.id, { is_featured: !r.is_featured })} className={`p-2 rounded-lg ${r.is_featured ? "bg-yellow-500/30 text-yellow-200" : "bg-white/5 hover:bg-white/10"}`} title="הבלט"><Sparkles size={14} /></button>
                <button onClick={() => setEditing(r)} className="bg-white/5 hover:bg-white/10 px-3 rounded-lg text-xs">ערוך</button>
                <button onClick={() => remove(r.id)} className="bg-red-500/10 text-red-300 hover:bg-red-500/20 p-2 rounded-lg"><Trash2 size={14} /></button>
              </div>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{r.content}</p>
            {r.image_url && <img src={r.image_url} alt="" className="mt-3 rounded-xl max-h-48 object-cover" />}
            <p className="text-[10px] text-muted-foreground mt-2">{new Date(r.created_at).toLocaleString("he-IL")}</p>
          </div>
        ))}
      </div>

      {editing && <ReviewModal review={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function ReviewModal({ review, onClose, onSaved }: { review: Review; onClose: () => void; onSaved: () => void }) {
  const uploadImage = useServerFn(uploadAdminMediaImage);
  const [form, setForm] = useState({
    full_name: review.full_name, rating: review.rating, license_type: review.license_type,
    content: review.content, image_url: review.image_url ?? "", status: review.status, is_featured: review.is_featured,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const image = await imageFileToBase64(file);
      const result = await uploadImage({ data: { bucket: "review-images", folder: "reviews", ...image } });
      setForm((f) => ({ ...f, image_url: result.publicUrl }));
      toast.success("התמונה הועלתה");
    } catch (e) { toast.error(e instanceof Error ? e.message : "שגיאה"); }
    finally { setUploading(false); }
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form, image_url: form.image_url || null };
      const { error } = review.id
        ? await supabase.from("reviews").update(payload).eq("id", review.id)
        : await supabase.from("reviews").insert(payload);
      if (error) throw error;
      toast.success("נשמר"); onSaved();
    } catch (e) { toast.error(e instanceof Error ? e.message : "שגיאה"); }
    finally { setSaving(false); }
  };

  return (
    <div dir="rtl" className="fixed inset-0 z-50 bg-black/80 grid place-items-center p-4" onClick={onClose}>
      <div className="bg-card border border-white/10 rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-black mb-4">{review.id ? "ערוך ביקורת" : "הוסף ביקורת"}</h2>
        <div className="space-y-3">
          <Field label="שם מלא"><input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className={inputCls} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="דירוג"><select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className={inputCls}>
              {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n} ★</option>)}
            </select></Field>
            <Field label="סוג לימוד"><select value={form.license_type} onChange={(e) => setForm({ ...form, license_type: e.target.value })} className={inputCls}>
              <option value="B">רכב B</option><option value="A2">A2</option><option value="A1">A1</option><option value="A">A</option>
            </select></Field>
          </div>
          <Field label="סטטוס"><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Review["status"] })} className={inputCls}>
            <option value="pending">ממתינה</option><option value="approved">מאושרת</option><option value="rejected">נדחתה</option>
          </select></Field>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
            הבלט באתר
          </label>
          <Field label="טקסט"><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={5} className={inputCls} /></Field>
          <Field label="תמונת תלמיד">
            <div className="flex gap-2">
              <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} dir="ltr" className={inputCls} placeholder="URL או העלה" />
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="bg-white/5 hover:bg-white/10 px-3 rounded-xl text-xs flex items-center gap-1 disabled:opacity-50">
                <Upload size={12} /> {uploading ? "..." : "העלה"}
              </button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />
            </div>
            {form.image_url && <img src={form.image_url} alt="" className="mt-2 rounded-lg max-h-32" />}
          </Field>
        </div>
        <div className="flex gap-2 mt-6">
          <button onClick={save} disabled={saving} className="flex-1 bg-gradient-orange text-white font-bold rounded-xl py-2.5 disabled:opacity-50">{saving ? "שומר..." : "שמור"}</button>
          <button onClick={onClose} className="px-5 bg-white/5 hover:bg-white/10 rounded-xl text-sm">בטל</button>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-sm";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="text-xs font-semibold mb-1 block">{label}</label>{children}</div>;
}
