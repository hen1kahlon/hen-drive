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
        const safeInterest = escapeHtml(leadInput.interest || 'לא צוין')
        const safeArea = escapeHtml(leadInput.area || 'לא צוין')
        const safeNotes = escapeHtml(leadInput.notes || 'אין פירוט נוסף')
        const safeTime = escapeHtml(formatTime(submittedAt))
        const html = `<div dir="rtl" style="font-family:Arial,sans-serif;line-height:1.6;color:#111"><h2>ליד חדש מהאתר</h2><p><strong>שם מלא:</strong> ${safeName}</p><p><strong>טלפון:</strong> ${safePhone}</p><p><strong>תחום עניין:</strong> ${safeInterest}</p><p><strong>אזור:</strong> ${safeArea}</p><p><strong>פרטים:</strong><br>${safeNotes.replace(/\n/g, '<br>')}</p><p><strong>זמן שליחה:</strong> ${safeTime}</p></div>`
        const text = `ליד חדש מהאתר\nשם מלא: ${leadInput.full_name}\nטלפון: ${leadInput.phone}\nתחום עניין: ${leadInput.interest || 'לא צוין'}\nאזור: ${leadInput.area || 'לא צוין'}\nפרטים: ${leadInput.notes || 'אין פירוט נוסף'}\nזמן שליחה: ${formatTime(submittedAt)}`

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
            subject: `ליד חדש מהאתר - ${leadInput.full_name}`,
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
