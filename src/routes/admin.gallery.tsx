import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
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
const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25MB original
const ALLOWED_MIME = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

async function compressToWebP(file: File): Promise<Blob> {
  // Decode the image. Try createImageBitmap first (fast, handles EXIF),
  // then fall back to HTMLImageElement.
  let width = 0, height = 0;
  let drawSource: CanvasImageSource;
  let cleanup: (() => void) | null = null;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" } as ImageBitmapOptions);
    width = bitmap.width; height = bitmap.height;
    drawSource = bitmap;
    cleanup = () => bitmap.close?.();
  } catch {
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise<HTMLImageElement>((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = () => rej(new Error("פורמט תמונה לא נתמך (אולי HEIC?)"));
        i.src = url;
      });
      width = img.naturalWidth; height = img.naturalHeight;
      drawSource = img;
      cleanup = () => URL.revokeObjectURL(url);
    } catch (e) {
      URL.revokeObjectURL(url);
      throw e;
    }
  }
  if (!width || !height) { cleanup?.(); throw new Error("לא ניתן לקרוא את מימדי התמונה"); }
  const ratio = width > MAX_W ? MAX_W / width : 1;
  const w = Math.max(1, Math.round(width * ratio));
  const h = Math.max(1, Math.round(height * ratio));
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) { cleanup?.(); throw new Error("הדפדפן לא תומך בעיבוד תמונה"); }
  ctx.drawImage(drawSource, 0, 0, w, h);
  cleanup?.();
  // Try WebP, fall back to JPEG if the browser can't encode WebP (rare on iOS <14).
  const tryEncode = (mime: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), mime, WEBP_Q));
  let blob = await tryEncode("image/webp");
  if (!blob) blob = await tryEncode("image/jpeg");
  if (!blob) throw new Error("דחיסת התמונה נכשלה");
  return blob;
}

function GalleryPage() {
  const navigate = useNavigate();
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
    // Validate the session on the server before uploading. getSession() only
    // reads localStorage and may return a stale (expired) token, which the
    // server then rejects → auth.uid() is NULL → RLS denies the upload.
    // getUser() round-trips to /auth/v1/user, which forces autoRefreshToken
    // to mint a fresh access token if the current one expired.
    let userId: string | null = null;
    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData.user) throw userErr ?? new Error("no user");
      userId = userData.user.id;
    } catch {
      // Token couldn't be refreshed — try one explicit refresh, then bail.
      const { data: refreshed } = await supabase.auth.refreshSession();
      if (!refreshed.session) {
        toast.error("פג תוקף ההתחברות — מתחבר מחדש...", { duration: 4000 });
        setTimeout(() => navigate({ to: "/auth" }), 800);
        return;
      }
      userId = refreshed.session.user.id;
    }
    // Sanity-check admin role from the live session — fails fast with a clear
    // message instead of letting every storage upload return a cryptic RLS error.
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) {
      toast.error("החשבון המחובר אינו מנהל — התחברו בחשבון מנהל");
      setTimeout(() => navigate({ to: "/auth" }), 1200);
      return;
    }
    const all = Array.from(files);
    const list: File[] = [];
    const skipped: string[] = [];
    for (const f of all) {
      const name = f.name || "תמונה";
      const isHeic = /\.(heic|heif)$/i.test(name) || f.type === "image/heic" || f.type === "image/heif";
      if (isHeic) { skipped.push(`${name}: HEIC לא נתמך — המירו ל-JPG`); continue; }
      if (f.type && !ALLOWED_MIME.includes(f.type)) { skipped.push(`${name}: סוג קובץ לא נתמך (${f.type})`); continue; }
      if (!f.type && !/\.(jpe?g|png|webp)$/i.test(name)) { skipped.push(`${name}: סוג קובץ לא ידוע`); continue; }
      if (f.size > MAX_FILE_BYTES) { skipped.push(`${name}: קובץ גדול מ-25MB`); continue; }
      list.push(f);
    }
    if (skipped.length) skipped.forEach((m) => toast.error(m, { duration: 5000 }));
    if (list.length === 0) { toast.error("אין קבצים תקינים להעלאה"); return; }
    setUploading(true);
    setProgress({ done: 0, total: list.length });
    let ok = 0, fail = 0;
    try {
      for (const file of list) {
        const fname = file.name || "תמונה";
        try {
          const blob = await compressToWebP(file);
          const ext = blob.type === "image/jpeg" ? "jpg" : "webp";
          const path = `${cat}/${crypto.randomUUID()}.${ext}`;
          const { error } = await supabase.storage.from("gallery").upload(path, blob, {
            cacheControl: "31536000",
            contentType: blob.type,
          });
          if (error) {
            const m = error.message.toLowerCase();
            if (m.includes("row-level security") || m.includes("unauthorized") || m.includes("403")) {
              throw new Error("אין הרשאת מנהל — התחברו שוב");
            }
            throw new Error(`העלאה לאחסון נכשלה: ${error.message}`);
          }
          const { data } = supabase.storage.from("gallery").getPublicUrl(path);
          const { error: insErr } = await supabase.from("gallery_items").insert({
            image_url: data.publicUrl,
            category: cat,
            title: null,
          });
          if (insErr) {
            const m = insErr.message.toLowerCase();
            if (m.includes("row-level security")) {
              throw new Error("אין הרשאת מנהל לשמור פריט — התחברו שוב");
            }
            throw new Error(`שמירה למסד נכשלה: ${insErr.message}`);
          }
          ok++;
        } catch (err) {
          const msg = err instanceof Error ? err.message : "שגיאה לא ידועה";
          console.error(`upload failed for ${fname}:`, err);
          toast.error(`${fname} — ${msg}`, { duration: 6000 });
          fail++;
        }
        setProgress((p) => (p ? { ...p, done: p.done + 1 } : p));
      }
      if (ok) toast.success(`הועלו ${ok} תמונות${fail ? ` · ${fail} נכשלו` : ""}`);
      else if (!ok && !fail) toast.error("העלאה נכשלה");
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
          onChange={(e) => {
            // Prevent any accidental form submit / navigation on mobile
            e.preventDefault();
            e.stopPropagation();
            const files = e.target.files;
            // Defer upload so the picker overlay can fully close on Android
            // before we kick off async work — avoids focus/back-nav glitches.
            setTimeout(() => onUpload(files), 0);
          }}
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
