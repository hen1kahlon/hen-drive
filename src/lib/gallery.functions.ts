import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const GalleryUploadSchema = z.object({
  category: z.enum(["cars", "motorcycles", "success"]),
  fileName: z.string().min(1).max(180),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  base64: z.string().min(1).max(8_000_000),
});

function base64ToBytes(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

export const uploadGalleryImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => GalleryUploadSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: roleRow, error: roleError } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError) throw new Error(`בדיקת הרשאת מנהל נכשלה: ${roleError.message}`);
    if (!roleRow) throw new Error("אין הרשאת מנהל — התחברו בחשבון מנהל");

    const bytes = base64ToBytes(data.base64);
    if (bytes.byteLength === 0) throw new Error("קובץ התמונה ריק");
    if (bytes.byteLength > 6 * 1024 * 1024) throw new Error("התמונה הדחוסה גדולה מדי");

    const ext = data.mimeType === "image/jpeg" ? "jpg" : data.mimeType === "image/png" ? "png" : "webp";
    const path = `${data.category}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await context.supabase.storage.from("gallery").upload(path, bytes, {
      cacheControl: "31536000",
      contentType: data.mimeType,
      upsert: false,
    });

    if (uploadError) throw new Error(`העלאה לאחסון נכשלה: ${uploadError.message}`);

    const { data: publicUrlData } = context.supabase.storage.from("gallery").getPublicUrl(path);
    const { data: item, error: insertError } = await context.supabase
      .from("gallery_items")
      .insert({ image_url: publicUrlData.publicUrl, category: data.category, title: null })
      .select("id,image_url,category,title,sort_order")
      .single();

    if (insertError) {
      await context.supabase.storage.from("gallery").remove([path]);
      throw new Error(`שמירה למסד נכשלה: ${insertError.message}`);
    }

    return { item };
  });