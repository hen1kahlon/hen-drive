import { supabaseAdmin } from "@/integrations/supabase/client.server";

type GalleryUploadData = {
  category: "cars" | "motorcycles" | "success";
  mimeType:
    | "image/jpeg"
    | "image/png"
    | "image/webp"
    | "video/mp4"
    | "video/webm"
    | "video/quicktime";
  base64: string;
};

export async function uploadGalleryImageAsAdmin(data: GalleryUploadData) {
  const bytes = Buffer.from(data.base64, "base64");
  if (bytes.byteLength === 0) throw new Error("הקובץ ריק");
  const isVideo = data.mimeType.startsWith("video/");
  const maxBytes = isVideo ? 40 * 1024 * 1024 : 6 * 1024 * 1024;
  if (bytes.byteLength > maxBytes)
    throw new Error(isVideo ? "הסרטון גדול מדי (עד 40MB)" : "התמונה הדחוסה גדולה מדי");

  const extMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov",
  };
  const ext = extMap[data.mimeType] ?? "bin";
  const path = `${data.category}/${crypto.randomUUID()}.${ext}`;
  const body = new Blob([bytes], { type: data.mimeType });

  const { error: uploadError } = await supabaseAdmin.storage.from("gallery").upload(path, body, {
    cacheControl: "31536000",
    contentType: data.mimeType,
    upsert: false,
  });

  if (uploadError) throw new Error(`העלאה לאחסון נכשלה: ${uploadError.message}`);

  const { data: publicUrlData } = supabaseAdmin.storage.from("gallery").getPublicUrl(path);
  const { data: item, error: insertError } = await supabaseAdmin
    .from("gallery_items")
    .insert({
      image_url: publicUrlData.publicUrl,
      category: data.category,
      title: null,
      media_type: isVideo ? "video" : "image",
    })
    .select("id,image_url,category,title,sort_order,media_type")
    .single();

  if (insertError) {
    await supabaseAdmin.storage.from("gallery").remove([path]);
    throw new Error(`שמירה למסד נכשלה: ${insertError.message}`);
  }

  return item;
}

export async function updateGalleryTitleAsAdmin(id: string, title: string | null) {
  const { data, error } = await supabaseAdmin
    .from("gallery_items")
    .update({ title })
    .eq("id", id)
    .select("id,title")
    .single();
  if (error) throw new Error(`שמירת הכיתוב נכשלה: ${error.message}`);
  return data;
}
