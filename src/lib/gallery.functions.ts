import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { uploadGalleryImageAsAdmin, updateGalleryTitleAsAdmin } from "./gallery-upload.server";

const GalleryUploadSchema = z.object({
  category: z.enum(["cars", "motorcycles", "success"]),
  fileName: z.string().min(1).max(180),
  mimeType: z.enum([
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/webm",
    "video/quicktime",
  ]),
  base64: z.string().min(1).max(60_000_000),
});

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

    const item = await uploadGalleryImageAsAdmin(data);
    return { item };
  });

const TitleSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().max(200).nullable(),
});

export const updateGalleryTitle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => TitleSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: roleRow, error: roleError } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (roleError) throw new Error(`בדיקת הרשאת מנהל נכשלה: ${roleError.message}`);
    if (!roleRow) throw new Error("אין הרשאת מנהל — התחברו בחשבון מנהל");
    const item = await updateGalleryTitleAsAdmin(data.id, data.title);
    return { item };
  });
