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

const COMPRESS_MAX_W = 1080;
const COMPRESS_WEBP_Q = 0.82;

export async function compressToWebP(file: File): Promise<Blob> {
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
  const ratio = width > COMPRESS_MAX_W ? COMPRESS_MAX_W / width : 1;
  const w = Math.max(1, Math.round(width * ratio));
  const h = Math.max(1, Math.round(height * ratio));
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) { cleanup?.(); throw new Error("הדפדפן לא תומך בעיבוד תמונה"); }
  ctx.drawImage(drawSource, 0, 0, w, h);
  cleanup?.();
  const tryEncode = (mime: string) => new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), mime, COMPRESS_WEBP_Q));
  let blob = await tryEncode("image/webp");
  if (!blob) blob = await tryEncode("image/jpeg");
  if (!blob) throw new Error("דחיסת התמונה נכשלה");
  return blob;
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      resolve(result.includes(",") ? result.split(",")[1] : result);
    };
    reader.onerror = () => reject(new Error("קריאת קובץ התמונה נכשלה"));
    reader.readAsDataURL(blob);
  });
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