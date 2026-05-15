import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Upload, Check, Pencil } from "lucide-react";

export const Route = createFileRoute("/admin/gallery")({ component: GalleryPage });

type Item = { id: string; image_url: string; category: string; title: string | null; sort_order: number };
const CATS = [
  { id: "cars", label: "רכב" },
  { id: "motorcycles", label: "אופנוע" },
  { id: "success", label: "בוגרים מצליחים" },
] as const;

const MAX_W = 1080;
const WEBP_Q = 0.82;

async function compressToWebP(file: File): Promise<Blob> {
  // Try native createImageBitmap (faster, handles EXIF rotation on modern browsers)
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" } as ImageBitmapOptions);
  } catch {
    // Fallback via HTMLImageElement
    const url = URL.createObjectURL(file);
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = url;
    });
    bitmap = await createImageBitmap(img);
    URL.revokeObjectURL(url);
  }
  const ratio = bitmap.width > MAX_W ? MAX_W / bitmap.width : 1;
  const w = Math.round(bitmap.width * ratio);
  const h = Math.round(bitmap.height * ratio);
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
      "image/webp",
      WEBP_Q,
    );
  });
}

function GalleryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [cat, setCat] = useState<typeof CATS[number]["id"]>("cars");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("gallery_items").select("*").order("sort_order").order("created_at", { ascending: false });
    if (error) toast.error(error.message); else setItems((data ?? []) as Item[]);
  }, []);
  useEffect(() => { load(); }, [load]);

  const onUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) { toast.error("בחר קבצי תמונה בלבד"); return; }
    setUploading(true);
    setProgress({ done: 0, total: list.length });
    let ok = 0, fail = 0;
    try {
      for (const file of list) {
        try {
          const webp = await compressToWebP(file);
          const path = `${cat}/${crypto.randomUUID()}.webp`;
          const { error } = await supabase.storage.from("gallery").upload(path, webp, {
            cacheControl: "31536000",
            contentType: "image/webp",
          });
          if (error) throw error;
          const { data } = supabase.storage.from("gallery").getPublicUrl(path);
          const { error: insErr } = await supabase.from("gallery_items").insert({
            image_url: data.publicUrl,
            category: cat,
            title: null,
          });
          if (insErr) throw insErr;
          ok++;
        } catch (err) {
          console.error(err);
          fail++;
        }
        setProgress((p) => (p ? { ...p, done: p.done + 1 } : p));
      }
      if (ok) toast.success(`הועלו ${ok} תמונות${fail ? ` · ${fail} נכשלו` : ""}`);
      else toast.error("העלאה נכשלה");
      load();
    } catch (e) { toast.error(e instanceof Error ? e.message : "שגיאה"); }
    finally {
      setUploading(false);
      setProgress(null);
      if (fileRef.current) fileRef.current.value = "";
    }
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

  const saveTitle = async (id: string) => {
    const value = editValue.trim() || null;
    const { error } = await supabase.from("gallery_items").update({ title: value }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    setItems((p) => p.map((i) => (i.id === id ? { ...i, title: value } : i)));
    setEditingId(null);
    toast.success("נשמר");
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

      <label
        htmlFor="gallery-upload"
        className={`block bg-card border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${uploading ? "border-white/15 opacity-70" : "border-white/15 hover:border-[oklch(0.72_0.18_50_/_0.6)] hover:bg-white/[0.02]"}`}
        onDragOver={(e) => { e.preventDefault(); }}
        onDrop={(e) => { e.preventDefault(); if (!uploading) onUpload(e.dataTransfer.files); }}
      >
        <Upload size={22} className="mx-auto mb-2 text-muted-foreground" />
        <div className="bg-gradient-orange text-white inline-block px-5 py-2 rounded-xl text-sm font-bold">
          {uploading
            ? progress
              ? `מעלה ${progress.done}/${progress.total}...`
              : "מעלה..."
            : "בחר תמונות / גרור לכאן"}
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">
          העלאת קבוצה · המרה אוטומטית ל-WebP · עד 1080px · קטגוריה: <b>{CATS.find((c) => c.id === cat)?.label}</b>
        </p>
        <input
          ref={fileRef}
          id="gallery-upload"
          type="file"
          accept="image/*"
          multiple
          hidden
          disabled={uploading}
          onChange={(e) => onUpload(e.target.files)}
        />
      </label>

      {filtered.length === 0 ? <p className="text-center text-sm text-muted-foreground py-8">אין תמונות בקטגוריה זו</p> :
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((i) => (
            <div key={i.id} className="bg-card border border-white/10 rounded-2xl overflow-hidden flex flex-col">
              <div className="relative group aspect-square">
                <img src={i.image_url} alt={i.title ?? ""} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                <button onClick={() => remove(i)} aria-label="מחק" className="absolute top-2 left-2 bg-red-500/90 hover:bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="p-2">
                {editingId === i.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") saveTitle(i.id); if (e.key === "Escape") setEditingId(null); }}
                      placeholder="כיתוב..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs"
                    />
                    <button onClick={() => saveTitle(i.id)} className="bg-gradient-orange text-white p-1.5 rounded-lg" aria-label="שמור">
                      <Check size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditingId(i.id); setEditValue(i.title ?? ""); }}
                    className="w-full text-right flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition px-1 py-1"
                  >
                    <Pencil size={11} className="shrink-0" />
                    <span className="truncate">{i.title || "הוסף כיתוב"}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}
