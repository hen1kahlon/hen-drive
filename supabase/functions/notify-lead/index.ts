import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RECIPIENT = "hen1kahlon@gmail.com";
const FROM = "Hendrive <onboarding@resend.dev>";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, content-type",
      },
    });
  }

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const db = createClient(SUPABASE_URL, SERVICE_KEY);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const { lead_id, full_name, phone, license_type, interest, area, notes } = body as {
    lead_id: string;
    full_name: string;
    phone: string;
    license_type?: string;
    interest?: string;
    area?: string;
    notes?: string;
  };

  const phoneDigits = (phone ?? "").replace(/\D/g, "");
  const waNumber = phoneDigits.startsWith("0") ? "972" + phoneDigits.slice(1) : phoneDigits;
  const timeStr = new Intl.DateTimeFormat("he-IL", {
    dateStyle: "short", timeStyle: "short", timeZone: "Asia/Jerusalem",
  }).format(new Date());

  const subject = `🔔 פנייה חדשה מהאתר — ${full_name} מחכה לחזרה`;
  const msgId = `lead-${lead_id}`;

  if (!RESEND_API_KEY) {
    await db.from("email_send_log").insert({
      message_id: msgId, template_name: "lead-notification",
      recipient_email: RECIPIENT, status: "failed",
      error_message: "RESEND_API_KEY not configured", metadata: { lead_id },
    });
    return json({ error: "RESEND_API_KEY not configured" }, 500);
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM, to: [RECIPIENT], subject,
        html: buildHtml({ full_name, phone, waNumber, license_type, interest, area, notes, time: timeStr }),
        text: buildText({ full_name, phone, waNumber, license_type, area, notes, time: timeStr }),
      }),
    });
    const result = await res.json() as { id?: string; message?: string };
    if (!res.ok) throw new Error(result.message ?? `Resend ${res.status}`);
    await db.from("email_send_log").insert({
      message_id: msgId, template_name: "lead-notification",
      recipient_email: RECIPIENT, status: "sent",
      metadata: { lead_id, provider_id: result.id },
    });
    return json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await db.from("email_send_log").insert({
      message_id: msgId, template_name: "lead-notification",
      recipient_email: RECIPIENT, status: "failed",
      error_message: msg.slice(0, 1000), metadata: { lead_id },
    });
    return json({ error: msg }, 500);
  }
});

function esc(s?: string) {
  return (s ?? "").replace(/[&<>'"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[c]!
  );
}

function buildHtml(p: {
  full_name: string; phone: string; waNumber: string;
  license_type?: string; interest?: string; area?: string; notes?: string; time: string;
}) {
  const n = esc(p.full_name), ph = esc(p.phone);
  const phHref = esc((p.phone ?? "").replace(/\s+/g, ""));
  const wa = esc(p.waNumber);
  const lic = esc(p.license_type ?? "לא צוין");
  const ar = esc(p.area ?? "לא צוין");
  const nt = esc(p.notes ?? "אין פירוט נוסף").replace(/\n/g, "<br>");
  const t = esc(p.time);

  return `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:24px 12px;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#111;direction:rtl">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,.06);overflow:hidden">
<tr><td style="padding:24px 28px;background:#1a2d5a;color:#fff">
  <div style="font-size:20px;font-weight:700;line-height:1.4">🔔 פנייה חדשה — ${n} מחכה לחזרה</div>
  <div style="font-size:13px;opacity:.75;margin-top:4px">Hendrive</div>
</td></tr>
<tr><td style="padding:28px">
  <div style="margin-bottom:20px"><div style="font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">👤 שם</div><div style="font-size:17px;font-weight:600">${n}</div></div>
  <div style="margin-bottom:20px"><div style="font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">📞 טלפון</div><div style="font-size:22px;font-weight:700"><a href="tel:${phHref}" style="color:#2563eb;text-decoration:none">${ph}</a></div></div>
  <div style="margin-bottom:24px">
    <a href="tel:${phHref}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600;font-size:15px;margin-left:8px">📞 התקשר</a>
    <a href="https://wa.me/${wa}" style="display:inline-block;background:#25d366;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600;font-size:15px;margin-left:8px">💬 וואטסאפ</a>
    <a href="https://hendrive.co.il/admin" style="display:inline-block;background:#1a2d5a;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600;font-size:15px">🖥️ דשבורד</a>
  </div>
  <div style="height:1px;background:#e5e7eb;margin:24px 0"></div>
  <div style="margin-bottom:16px"><div style="font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">🚘 סוג רישיון</div><div style="font-size:16px">${lic}</div></div>
  <div style="margin-bottom:16px"><div style="font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">📍 אזור</div><div style="font-size:16px">${ar}</div></div>
  <div style="margin-bottom:16px"><div style="font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">📝 פרטים</div><div style="font-size:15px;background:#f9fafb;padding:14px 16px;border-radius:10px;line-height:1.6">${nt}</div></div>
  <div><div style="font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">🕒 זמן שליחה</div><div style="font-size:14px;color:#6b7280">${t}</div></div>
</td></tr>
<tr><td style="padding:20px 28px;background:#f9fafb;text-align:center;font-size:12px;color:#6b7280;line-height:1.7">
  <div style="font-size:14px;font-weight:600;color:#1a2d5a;margin-bottom:8px">מומלץ לחזור תוך שעה לתוצאות טובות יותר 💪</div>
  <div>📩 נשלח אוטומטית מ-Hendrive · אין להשיב למייל זה</div>
</td></tr>
</table></body></html>`;
}

function buildText(p: {
  full_name: string; phone: string; waNumber: string;
  license_type?: string; area?: string; notes?: string; time: string;
}) {
  return [
    `🔔 פנייה חדשה — ${p.full_name} מחכה לחזרה`,
    ``,
    `👤 שם: ${p.full_name}`,
    `📞 טלפון: ${p.phone}`,
    `💬 וואטסאפ: https://wa.me/${p.waNumber}`,
    `🚘 סוג רישיון: ${p.license_type ?? "לא צוין"}`,
    `📍 אזור: ${p.area ?? "לא צוין"}`,
    `📝 פרטים: ${p.notes ?? "אין פירוט נוסף"}`,
    `🕒 זמן שליחה: ${p.time}`,
    ``,
    `מומלץ לחזור תוך שעה 💪`,
    `📩 נשלח אוטומטית מ-Hendrive`,
  ].join("\n");
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
}
