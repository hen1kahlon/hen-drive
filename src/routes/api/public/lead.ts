import { createClient } from '@supabase/supabase-js'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const RECIPIENT_EMAIL = 'hendriver12@gmail.com'
const FROM_ADDRESS = 'Hendrive <noreply@hendrive.co.il>'
const RESEND_GATEWAY = 'https://connector-gateway.lovable.dev/resend'

const LeadSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(8).max(30),
  license_type: z.string().trim().max(20).nullable().optional(),
  interest: z.string().trim().max(200).nullable().optional(),
  area: z.string().trim().max(200).nullable().optional(),
  notes: z.string().trim().max(2000).nullable().optional(),
  source: z.string().trim().max(80).optional(),
})

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]!)
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('he-IL', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Jerusalem' }).format(date)
}

async function sendViaResend(payload: {
  to: string
  subject: string
  html: string
  text: string
}) {
  const lovableKey = process.env.LOVABLE_API_KEY
  const resendKey = process.env.RESEND_API_KEY
  if (!lovableKey) throw new Error('LOVABLE_API_KEY is not configured')
  if (!resendKey) throw new Error('RESEND_API_KEY is not configured')

  const res = await fetch(`${RESEND_GATEWAY}/emails`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${lovableKey}`,
      'X-Connection-Api-Key': resendKey,
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: [payload.to],
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    }),
  })

  const body = await res.text()
  if (!res.ok) {
    throw new Error(`Resend send failed [${res.status}]: ${body}`)
  }
  try {
    return JSON.parse(body) as { id?: string }
  } catch {
    return {}
  }
}

export const Route = createFileRoute('/api/public/lead')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!supabaseUrl || !serviceKey) {
          console.error('Lead notification config missing')
          return Response.json({ error: 'Server configuration error' }, { status: 500 })
        }

        let leadInput: z.infer<typeof LeadSchema>
        try {
          leadInput = LeadSchema.parse(await request.json())
        } catch (error) {
          return Response.json({ error: 'Invalid lead details' }, { status: 400 })
        }

        const supabase = createClient(supabaseUrl, serviceKey)
        const submittedAt = new Date()
        const { data: lead, error: leadError } = await supabase
          .from('leads')
          .insert({
            full_name: leadInput.full_name,
            phone: leadInput.phone,
            license_type: leadInput.license_type ?? null,
            interest: leadInput.interest ?? null,
            area: leadInput.area ?? null,
            notes: leadInput.notes || null,
            source: leadInput.source || 'lead-form',
          })
          .select('id, created_at')
          .single()

        if (leadError || !lead) {
          console.error('Lead save failed', { error: leadError })
          return Response.json({ error: 'Lead save failed' }, { status: 500 })
        }

        const messageId = `lead-notification-${lead.id}`
        const safeName = escapeHtml(leadInput.full_name)
        const safePhone = escapeHtml(leadInput.phone)
        const phoneDigits = leadInput.phone.replace(/\D/g, '')
        const waNumber = phoneDigits.startsWith('0') ? '972' + phoneDigits.slice(1) : phoneDigits
        const safePhoneHref = escapeHtml(leadInput.phone.replace(/\s+/g, ''))
        const safeWa = escapeHtml(waNumber)
        const safeLicense = escapeHtml(leadInput.license_type || 'לא צוין')
        const safeInterest = escapeHtml(leadInput.interest || 'לא צוין')
        const safeArea = escapeHtml(leadInput.area || 'לא צוין')
        const safeNotes = escapeHtml(leadInput.notes || 'אין פירוט נוסף')
        const safeTime = escapeHtml(formatTime(submittedAt))
        const html = `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:24px 12px;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#111;direction:rtl">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.06);overflow:hidden">
<tr><td style="padding:24px 28px;background:#1a2d5a;color:#fff">
<div style="font-size:20px;font-weight:700;line-height:1.4">🔔 פנייה חדשה מהאתר — ${safeName} מחכה לחזרה</div>
<div style="font-size:13px;opacity:0.75;margin-top:4px">Hendrive</div>
</td></tr>
<tr><td style="padding:28px">
<div style="margin-bottom:20px"><div style="font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">👤 שם</div><div style="font-size:17px;font-weight:600;color:#111">${safeName}</div></div>
<div style="margin-bottom:20px"><div style="font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">📞 טלפון</div><div style="font-size:22px;font-weight:700"><a href="tel:${safePhoneHref}" style="color:#2563eb;text-decoration:none">${safePhone}</a></div></div>
<div style="margin-bottom:24px"><a href="tel:${safePhoneHref}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600;font-size:15px;margin-left:8px">📞 התקשר</a><a href="https://wa.me/${safeWa}" style="display:inline-block;background:#25d366;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600;font-size:15px;margin-left:8px">💬 וואטסאפ</a><a href="https://hendrive.co.il/admin" style="display:inline-block;background:#1a2d5a;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600;font-size:15px">🖥️ פתח בדשבורד</a></div>
<div style="height:1px;background:#e5e7eb;margin:24px 0"></div>
<div style="margin-bottom:20px"><div style="font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">🚘 סוג רישיון</div><div style="font-size:16px;color:#111">${safeLicense}</div></div>
<div style="margin-bottom:20px"><div style="font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">📍 אזור</div><div style="font-size:16px;color:#111">${safeArea}</div></div>
<div style="margin-bottom:20px"><div style="font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">📝 פרטים</div><div style="font-size:15px;color:#111;line-height:1.6;background:#f9fafb;padding:14px 16px;border-radius:10px">${safeNotes.replace(/\n/g, '<br>')}</div></div>
<div style="margin-bottom:4px"><div style="font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">🕒 זמן שליחה</div><div style="font-size:14px;color:#6b7280">${safeTime}</div></div>
</td></tr>
<tr><td style="padding:20px 28px;background:#f9fafb;text-align:center;font-size:12px;color:#6b7280;line-height:1.7">
<div style="margin-bottom:10px;font-size:14px;font-weight:600;color:#1a2d5a">מומלץ לחזור תוך שעה לתוצאות טובות יותר 💪</div>
<div style="margin-bottom:8px">📩 מייל זה נשלח אוטומטית ממערכת Hendrive.</div>
<div style="margin-bottom:8px">אין להשיב למייל זה.</div>
<div>ליצירת קשר מהיר ניתן לחייג או לשלוח WhatsApp דרך הכפתורים במייל.</div>
</td></tr>
</table>
</body></html>`
        const text = `🔔 פנייה חדשה מהאתר — ${leadInput.full_name} מחכה לחזרה\n\n👤 שם: ${leadInput.full_name}\n📞 טלפון: ${leadInput.phone}\n💬 וואטסאפ: https://wa.me/${waNumber}\n🚘 סוג רישיון: ${leadInput.license_type || 'לא צוין'}\n📍 אזור: ${leadInput.area || 'לא צוין'}\n📝 פרטים: ${leadInput.notes || 'אין פירוט נוסף'}\n🕒 זמן שליחה: ${formatTime(submittedAt)}\n\nמומלץ לחזור תוך שעה לתוצאות טובות יותר 💪\n\n📩 מייל זה נשלח אוטומטית ממערכת Hendrive.\nאין להשיב למייל זה.`

        await supabase.from('email_send_log').insert({
          message_id: messageId,
          template_name: 'lead-notification',
          recipient_email: RECIPIENT_EMAIL,
          status: 'pending',
          metadata: { lead_id: lead.id },
        })

        try {
          const result = await sendViaResend({
            to: RECIPIENT_EMAIL,
            subject: `🔔 פנייה חדשה מהאתר — ${leadInput.full_name} מחכה לחזרה`,
            html,
            text,
          })
          await supabase.from('email_send_log').insert({
            message_id: messageId,
            template_name: 'lead-notification',
            recipient_email: RECIPIENT_EMAIL,
            status: 'sent',
            metadata: { lead_id: lead.id, provider: 'resend', provider_id: result.id ?? null },
          })
          return Response.json({ success: true, leadId: lead.id, notificationSent: true })
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error)
          console.error('Lead notification send failed', { error: message, lead_id: lead.id })
          await supabase.from('email_send_log').insert({
            message_id: messageId,
            template_name: 'lead-notification',
            recipient_email: RECIPIENT_EMAIL,
            status: 'failed',
            error_message: message.slice(0, 1000),
            metadata: { lead_id: lead.id, provider: 'resend' },
          })
          return Response.json({ success: true, leadId: lead.id, notificationSent: false, notificationError: message }, { status: 202 })
        }
      },
    },
  },
})
