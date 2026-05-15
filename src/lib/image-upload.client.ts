export const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export type AllowedImageMimeType = (typeof ALLOWED_IMAGE_MIME_TYPES)[number];

export function getSafeImageMimeType(file: File): AllowedImageMimeType {
  if (ALLOWED_IMAGE_MIME_TYPES.includes(file.type as AllowedImageMimeType)) {
    return file.type as AllowedImageMimeType;
  }

  const name = file.name.toLowerCase();
  if (/\.jpe?g$/.test(name)) return "image/jpeg";
  if (/\.png$/.test(name)) return "image/png";
  if (/\.webp$/.test(name)) return "image/webp";

  throw new Error("סוג התמונה לא נתמך. ניתן להעלות JPG, PNG או WEBP בלבד");
}

export async function imageFileToBase64(file: File, maxBytes = 5 * 1024 * 1024) {
  if (file.size > maxBytes) throw new Error("התמונה גדולה מדי (עד 5MB)");
  const mimeType = getSafeImageMimeType(file);

  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      resolve(result.includes(",") ? result.split(",")[1] : result);
    };
    reader.onerror = () => reject(new Error("קריאת התמונה נכשלה"));
    reader.readAsDataURL(file);
  });

  if (!base64) throw new Error("קובץ התמונה ריק");
  return { base64, mimeType };
}