// Supabase Edge Function: notify-new-event
// Triggered by Database Webhook on events INSERT
// Sends email notification to all approved members via Resend

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface EventRecord {
  id: string
  title: string
  description: string | null
  event_date: string
  start_time: string
  end_time: string | null
  location: string | null
  event_type: 'sessao_regular' | 'evento'
}

Deno.serve(async (req) => {
  try {
    const payload = await req.json()
    const event: EventRecord = payload.record

    // Criar cliente Supabase com service role (bypass RLS)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Buscar emails dos membros aprovados
    const { data: members, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('approved', true)

    if (error || !members?.length) {
      return new Response(JSON.stringify({ message: 'No approved members to notify' }), { status: 200 })
    }

    const typeLabel = event.event_type === 'sessao_regular' ? 'Sessao Regular' : 'Evento'
    const timeStr = event.start_time.substring(0, 5) + (event.end_time ? ` - ${event.end_time.substring(0, 5)}` : '')

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #E8E8E8; padding: 30px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #D4A843; margin: 0;">R∴L∴ Aviz Nº8</h2>
          <p style="color: #A0A0B8; font-size: 14px; margin: 5px 0 0;">Novo ${typeLabel}</p>
        </div>
        <div style="background: #1e2a47; border: 1px solid #2A3A5C; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #E8C872; margin: 0 0 15px;">${event.title}</h3>
          <p style="margin: 8px 0; color: #A0A0B8;">
            <strong style="color: #D4A843;">Data:</strong> ${event.event_date}
          </p>
          <p style="margin: 8px 0; color: #A0A0B8;">
            <strong style="color: #D4A843;">Hora:</strong> ${timeStr}
          </p>
          ${event.location ? `<p style="margin: 8px 0; color: #A0A0B8;"><strong style="color: #D4A843;">Local:</strong> ${event.location}</p>` : ''}
          ${event.description ? `<p style="margin: 15px 0 0; color: #A0A0B8; font-size: 14px; line-height: 1.5;">${event.description}</p>` : ''}
        </div>
        <p style="text-align: center; color: #6B6B80; font-size: 12px; margin-top: 20px;">
          Grande Loja Soberana de Portugal
        </p>
      </div>
    `

    // Enviar emails via Resend (batch)
    const emails = members.map(m => ({
      from: 'R∴L∴ Aviz Nº8 <noreply@aviz8.pt>',
      to: m.email,
      subject: `${typeLabel}: ${event.title} - ${event.event_date}`,
      html,
    }))

    const resendResponse = await fetch('https://api.resend.com/emails/batch', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emails),
    })

    const resendResult = await resendResponse.json()

    // Log das notificacoes
    const logEntries = members.map(m => ({
      event_id: event.id,
      sent_to: m.email,
      status: resendResponse.ok ? 'sent' : 'failed',
    }))

    await supabase.from('notification_log').insert(logEntries)

    return new Response(JSON.stringify({ success: true, sent: members.length, resend: resendResult }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
