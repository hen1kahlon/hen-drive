import { supabaseAdmin } from "@/integrations/supabase/client.server";

type GalleryUploadData = {
  category: "cars" | "motorcycles" | "success";
  mimeType: "image/jpeg" | "image/png" | "image/webp";
  base64: string;
};

export async function uploadGalleryImageAsAdmin(data: GalleryUploadData) {
  const bytes = Buffer.from(data.base64, "base64");
  if (bytes.byteLength === 0) throw new Error("קובץ התמונה ריק");
  if (bytes.byteLength > 6 * 1024 * 1024) throw new Error("התמונה הדחוסה גדולה מדי");

  const ext =
    data.mimeType === "image/jpeg" ? "jpg" : data.mimeType === "image/png" ? "png" : "webp";
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
    .insert({ image_url: publicUrlData.publicUrl, category: data.category, title: null })
    .select("id,image_url,category,title,sort_order")
    .single();

  if (insertError) {
    await supabaseAdmin.storage.from("gallery").remove([path]);
    throw new Error(`שמירה למסד נכשלה: ${insertError.message}`);
  }

  return item;
}
