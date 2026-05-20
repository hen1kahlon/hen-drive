import { createClient } from '@supabase/supabase-js'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const RECIPIENT_EMAIL = 'hendriver12@gmail.com'
const SENDER_DOMAIN = 'notify.hendrive.co.il'
const FROM_DOMAIN = 'notify.hendrive.co.il'
const SITE_NAME = 'Hendrive'

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

        const { error: enqueueError } = await supabase.rpc('enqueue_email', {
          queue_name: 'transactional_emails',
          payload: {
            message_id: messageId,
            to: RECIPIENT_EMAIL,
            from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
            sender_domain: SENDER_DOMAIN,
            subject: `ליד חדש מהאתר - ${leadInput.full_name}`,
            html,
            text,
            purpose: 'transactional',
            label: 'lead-notification',
            idempotency_key: messageId,
            unsubscribe_token: null,
            queued_at: submittedAt.toISOString(),
          },
        })

        if (enqueueError) {
          console.error('Lead notification enqueue failed', { error: enqueueError, lead_id: lead.id })
          await supabase.from('email_send_log').insert({
            message_id: messageId,
            template_name: 'lead-notification',
            recipient_email: RECIPIENT_EMAIL,
            status: 'failed',
            error_message: enqueueError.message?.slice(0, 1000) || 'Failed to enqueue notification',
            metadata: { lead_id: lead.id },
          })
          return Response.json({ success: true, leadId: lead.id, notificationQueued: false }, { status: 202 })
        }

        return Response.json({ success: true, leadId: lead.id, notificationQueued: true })
      },
    },
  },
})
