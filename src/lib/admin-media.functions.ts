import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { uploadAdminImage } from "./admin-media.server";

const AdminImageUploadSchema = z.object({
  bucket: z.enum(["gallery", "review-images"]),
  folder: z.enum(["license-cards", "hero", "general", "reviews"]),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  base64: z.string().min(1).max(8_000_000),
});

export const uploadAdminMediaImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => AdminImageUploadSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: roleRow, error: roleError } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError) throw new Error(`בדיקת הרשאת מנהל נכשלה: ${roleError.message}`);
    if (!roleRow) throw new Error("אין הרשאת מנהל — התחברו מחדש לחשבון מנהל");

    return uploadAdminImage(data);
  });