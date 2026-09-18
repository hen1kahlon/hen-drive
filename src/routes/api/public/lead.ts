import { createClient } from '@supabase/supabase-js'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const LeadSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(8).max(30),
  license_type: z.enum(['B', 'A2', 'A1', 'A']).nullable().optional(),
  interest: z.string().trim().max(200).nullable().optional(),
  area: z.string().trim().max(200).nullable().optional(),
  notes: z.string().trim().max(2000).nullable().optional(),
  source: z.string().trim().max(80).optional(),
})

export const Route = createFileRoute('/api/public/lead')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
        if (!supabaseUrl || !supabaseKey) {
          console.error('Supabase env vars missing')
          return Response.json({ error: 'Server configuration error' }, { status: 500 })
        }

        let leadInput: z.infer<typeof LeadSchema>
        try {
          leadInput = LeadSchema.parse(await request.json())
        } catch {
          return Response.json({ error: 'Invalid lead details' }, { status: 400 })
        }

        const leadId = crypto.randomUUID()
        const supabase = createClient(supabaseUrl, supabaseKey)
        const { error: leadError } = await supabase.from('leads').insert({
          id: leadId,
          full_name: leadInput.full_name,
          phone: leadInput.phone,
          license_type: leadInput.license_type ?? null,
          interest: leadInput.interest ?? null,
          area: leadInput.area ?? null,
          notes: leadInput.notes || null,
          source: leadInput.source || 'lead-form',
        })

        if (leadError) {
          console.error('Lead save failed', leadError)
          return Response.json({ error: 'Lead save failed' }, { status: 500 })
        }

        // Fire-and-forget: email via Supabase Edge Function (non-fatal if it fails)
        fetch(`${supabaseUrl}/functions/v1/notify-lead`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${supabaseKey}` },
          body: JSON.stringify({
            lead_id: leadId,
            full_name: leadInput.full_name,
            phone: leadInput.phone,
            license_type: leadInput.license_type,
            interest: leadInput.interest,
            area: leadInput.area,
            notes: leadInput.notes,
          }),
        }).catch(() => { /* email failure is non-fatal */ })

        return Response.json({ success: true, leadId })
      },
    },
  },
})
