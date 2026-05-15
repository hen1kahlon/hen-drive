import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Upload } from "lucide-react";

export const Route = createFileRoute("/admin/gallery")({ component: GalleryPage });

type Item = { id: string; image_url: string; category: string; title: string | null; sort_order: number };
const CATS = [
  { id: "cars", label: "רכב" },
  { id: "motorcycles", label: "אופנוע" },
  { id: "success", label: "בוגרים מצליחים" },
] as const;

function GalleryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [cat, setCat] = useState<typeof CATS[number]["id"]>("cars");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("gallery_items").select("*").order("sort_order").order("created_at", { ascending: false });
    if (error) toast.error(error.message); else setItems((data ?? []) as Item[]);
  }, []);
  useEffect(() => { load(); }, [load]);

  const onUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const path = `${cat}/${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from("gallery").upload(path, file, { cacheControl: "3600" });
        if (error) throw error;
        const { data } = supabase.storage.from("gallery").getPublicUrl(path);
        const { error: insErr } = await supabase.from("gallery_items").insert({ image_url: data.publicUrl, category: cat, title: file.name });
        if (insErr) throw insErr;
      }
      toast.success("הועלה בהצלחה"); load();
    } catch (e) { toast.error(e instanceof Error ? e.message : "שגיאה"); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  const remove = async (item: Item) => {
    if (!confirm("למחוק את התמונה?")) return;
    try {
      const url = new URL(item.image_url);
      const idx = url.pathname.indexOf("/gallery/");
      if (idx >= 0) {
        const path = decodeURIComponent(url.pathname.slice(idx + "/gallery/".length));
        await supabase.storage.from("gallery").remove([path]);
      }
      const { error } = await supabase.from("gallery_items").delete().eq("id", item.id);
      if (error) throw error;
      setItems((p) => p.filter((i) => i.id !== item.id));
      toast.success("נמחק");
    } catch (e) { toast.error(e instanceof Error ? e.message : "שגיאה"); }
  };

  const filtered = items.filter((i) => i.category === cat);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black mb-1">גלריה</h1>
        <p className="text-sm text-muted-foreground">ניהול תמונות לפי קטגוריה</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button key={c.id} onClick={() => setCat(c.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold ${cat === c.id ? "bg-gradient-orange text-white" : "bg-white/5 text-muted-foreground hover:bg-white/10"}`}>
            {c.label} ({items.filter((i) => i.category === c.id).length})
          </button>
        ))}
      </div>

      <div className="bg-card border border-dashed border-white/15 rounded-2xl p-6 text-center">
        <Upload size={20} className="mx-auto mb-2 text-muted-foreground" />
        <button onClick={() => fileRef.current?.click()} disabled={uploading} className="bg-gradient-orange text-white px-5 py-2 rounded-xl text-sm font-bold disabled:opacity-50">
          {uploading ? "מעלה..." : "העלה תמונות"}
        </button>
        <p className="text-[11px] text-muted-foreground mt-2">תמונות מרובות נתמכות · קטגוריה: {CATS.find((c) => c.id === cat)?.label}</p>
        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => onUpload(e.target.files)} />
      </div>

      {filtered.length === 0 ? <p className="text-center text-sm text-muted-foreground py-8">אין תמונות בקטגוריה זו</p> :
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((i) => (
            <div key={i.id} className="relative group rounded-2xl overflow-hidden bg-card border border-white/10 aspect-square">
              <img src={i.image_url} alt={i.title ?? ""} loading="lazy" className="w-full h-full object-cover" />
              <button onClick={() => remove(i)} className="absolute top-2 left-2 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      }
    </div>
  );
}
