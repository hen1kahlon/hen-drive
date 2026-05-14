import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Toaster, toast } from "sonner";
import { Star, Check, X, Trash2, LogOut, Plus } from "lucide-react";

export const Route = createFileRoute("/admin")({ component: AdminPage });

type Review = {
  id: string;
  full_name: string;
  rating: number;
  license_type: string;
  content: string;
  image_url: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

function AdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [editing, setEditing] = useState<Review | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setReviews((data ?? []) as Review[]);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate({ to: "/auth" }); return; }
      if (!mounted) return;
      setUserId(session.user.id);
      const { data: roles } = await supabase
        .from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle();
      const admin = !!roles;
      setIsAdmin(admin);
      if (admin) await load();
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [navigate, load]);

  const updateStatus = async (id: string, status: Review["status"]) => {
    const { error } = await supabase.from("reviews").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("עודכן");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("למחוק את הביקורת?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("נמחק");
    load();
  };

  const signOut = async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); };

  const filtered = reviews.filter((r) => filter === "all" || r.status === filter);

  if (loading) return <div className="min-h-screen grid place-items-center bg-background text-foreground">טוען...</div>;

  if (!isAdmin) {
    return (
      <div dir="rtl" className="min-h-screen bg-background text-foreground grid place-items-center px-4">
        <Toaster position="top-center" theme="dark" richColors />
        <div className="max-w-md text-center bg-card border border-white/10 rounded-3xl p-8">
          <h1 className="text-2xl font-black mb-3">אין הרשאת מנהל</h1>
          <p className="text-sm text-muted-foreground mb-2">החשבון שלך מחובר אך אינו מסומן כמנהל.</p>
          <p className="text-xs text-muted-foreground mb-6 break-all">User ID: {userId}</p>
          <p className="text-xs text-muted-foreground mb-6">פנה למפתח כדי לקבל הרשאות, או הריץ ב-Cloud:<br />
            <code className="text-[10px]">INSERT INTO user_roles(user_id, role) VALUES ('{userId}', 'admin');</code>
          </p>
          <button onClick={signOut} className="bg-white/10 px-4 py-2 rounded-xl text-sm">התנתק</button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <Toaster position="top-center" theme="dark" richColors />
      <header className="border-b border-white/5 px-4 py-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur z-10">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← לאתר</Link>
          <h1 className="text-lg font-black">ניהול ביקורות</h1>
        </div>
        <button onClick={signOut} className="text-xs flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg">
          <LogOut size={14} /> התנתק
        </button>
      </header>

      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {(["pending", "approved", "rejected", "all"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${filter === f ? "bg-gradient-orange text-white" : "bg-white/5 text-muted-foreground hover:bg-white/10"}`}>
              {f === "pending" ? "ממתינות" : f === "approved" ? "מאושרות" : f === "rejected" ? "נדחו" : "הכל"} ({reviews.filter(r => f === "all" || r.status === f).length})
            </button>
          ))}
          <button onClick={() => setEditing({ id: "", full_name: "", rating: 5, license_type: "B", content: "", image_url: null, status: "approved", created_at: "" })}
            className="mr-auto bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5">
            <Plus size={14} /> הוסף ביקורת
          </button>
        </div>

        <div className="grid gap-3">
          {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-12">אין ביקורות</p>}
          {filtered.map((r) => (
            <div key={r.id} className="bg-card border border-white/10 rounded-2xl p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold">{r.full_name}</span>
                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full">{r.license_type}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${r.status === "approved" ? "bg-green-500/20 text-green-300" : r.status === "rejected" ? "bg-red-500/20 text-red-300" : "bg-yellow-500/20 text-yellow-300"}`}>
                      {r.status === "approved" ? "מאושרת" : r.status === "rejected" ? "נדחתה" : "ממתינה"}
                    </span>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(r.rating)].map((_, i) => <Star key={i} size={13} className="fill-[oklch(0.78_0.18_55)] text-[oklch(0.78_0.18_55)]" />)}
                  </div>
                </div>
                <div className="flex gap-2">
                  {r.status !== "approved" && (
                    <button onClick={() => updateStatus(r.id, "approved")} className="bg-green-500/20 text-green-300 hover:bg-green-500/30 p-2 rounded-lg" title="אשר"><Check size={14} /></button>
                  )}
                  {r.status !== "rejected" && (
                    <button onClick={() => updateStatus(r.id, "rejected")} className="bg-red-500/20 text-red-300 hover:bg-red-500/30 p-2 rounded-lg" title="דחה"><X size={14} /></button>
                  )}
                  <button onClick={() => setEditing(r)} className="bg-white/5 hover:bg-white/10 p-2 rounded-lg text-xs px-3">ערוך</button>
                  <button onClick={() => remove(r.id)} className="bg-red-500/10 text-red-300 hover:bg-red-500/20 p-2 rounded-lg" title="מחק"><Trash2 size={14} /></button>
                </div>
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{r.content}</p>
              {r.image_url && <img src={r.image_url} alt="" className="mt-3 rounded-xl max-h-48 object-cover" />}
              <p className="text-[10px] text-muted-foreground mt-2">{new Date(r.created_at).toLocaleString("he-IL")}</p>
            </div>
          ))}
        </div>
      </div>

      {editing && <EditReviewModal review={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function EditReviewModal({ review, onClose, onSaved }: { review: Review; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    full_name: review.full_name, rating: review.rating, license_type: review.license_type,
    content: review.content, image_url: review.image_url ?? "", status: review.status,
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form, image_url: form.image_url || null };
      if (review.id) {
        const { error } = await supabase.from("reviews").update(payload).eq("id", review.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("reviews").insert(payload);
        if (error) throw error;
      }
      toast.success("נשמר");
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "שגיאה");
    } finally { setSaving(false); }
  };

  return (
    <div dir="rtl" className="fixed inset-0 z-50 bg-black/80 grid place-items-center p-4" onClick={onClose}>
      <div className="bg-card border border-white/10 rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-black mb-4">{review.id ? "ערוך ביקורת" : "הוסף ביקורת"}</h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold mb-1 block">שם מלא</label>
            <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold mb-1 block">דירוג</label>
              <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                className="w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-sm">
                {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n} ★</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block">סוג לימוד</label>
              <select value={form.license_type} onChange={(e) => setForm({ ...form, license_type: e.target.value })}
                className="w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-sm">
                <option value="B">רכב B</option>
                <option value="A2">אופנוע A2</option>
                <option value="A1">אופנוע A1</option>
                <option value="A">אופנוע A</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block">סטטוס</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Review["status"] })}
              className="w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-sm">
              <option value="pending">ממתינה</option>
              <option value="approved">מאושרת</option>
              <option value="rejected">נדחתה</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block">טקסט</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={5}
              className="w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block">קישור לתמונה (אופציונלי)</label>
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} dir="ltr"
              className="w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button onClick={save} disabled={saving} className="flex-1 bg-gradient-orange text-white font-bold rounded-xl py-2.5 disabled:opacity-50">
            {saving ? "שומר..." : "שמור"}
          </button>
          <button onClick={onClose} className="px-5 bg-white/5 hover:bg-white/10 rounded-xl text-sm">בטל</button>
        </div>
      </div>
    </div>
  );
}