import { supabaseAdmin } from "@/integrations/supabase/client.server";

type UploadData = {
  bucket: "gallery" | "review-images";
  folder: string;
  mimeType: "image/jpeg" | "image/png" | "image/webp";
  base64: string;
};

export async function uploadAdminImage(data: UploadData) {
  if (!/^[a-z0-9-]+$/i.test(data.folder)) throw new Error("תיקיית העלאה לא תקינה");

  const bytes = Buffer.from(data.base64, "base64");
  if (bytes.byteLength === 0) throw new Error("קובץ התמונה ריק");
  if (bytes.byteLength > 6 * 1024 * 1024) throw new Error("התמונה גדולה מדי");

  const ext = data.mimeType === "image/jpeg" ? "jpg" : data.mimeType === "image/png" ? "png" : "webp";
  const path = `${data.folder}/${crypto.randomUUID()}.${ext}`;
  const body = new Blob([bytes], { type: data.mimeType });

  const { error } = await supabaseAdmin.storage.from(data.bucket).upload(path, body, {
    cacheControl: "31536000",
    contentType: data.mimeType,
    upsert: false,
  });
  if (error) throw new Error(`העלאת התמונה נכשלה: ${error.message}`);

  const { data: publicUrlData } = supabaseAdmin.storage.from(data.bucket).getPublicUrl(path);
  return { path, publicUrl: publicUrlData.publicUrl };
}