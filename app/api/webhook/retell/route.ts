import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyWebhookSignature } from '@/lib/retell'

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-retell-signature')

  const valid = await verifyWebhookSignature(rawBody, signature)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: RetellWebhookPayload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Only process call_ended — return 200 for everything else so Retell doesn't retry
  if (payload.event !== 'call_ended') {
    return NextResponse.json({ received: true })
  }

  const call = payload.call
  const analysis = call.call_analysis ?? {}

  const supabase = createServiceClient()

  const { error } = await supabase.from('calls').upsert(
    {
      retell_call_id: call.call_id,
      from_number: call.from_number ?? null,
      to_number: call.to_number ?? null,
      start_time: call.start_timestamp
        ? new Date(call.start_timestamp).toISOString()
        : null,
      end_time: call.end_timestamp
        ? new Date(call.end_timestamp).toISOString()
        : null,
      duration_seconds: call.duration_ms ? Math.round(call.duration_ms / 1000) : null,
      status: call.call_status ?? null,
      transcript: call.transcript_object ?? null,
      // Named analysis fields
      call_summary: analysis.call_summary ?? null,
      call_successful: analysis.call_successful ?? null,
      user_sentiment: analysis.user_sentiment ?? null,
      clinical_case_description: analysis.clinical_case_description ?? null,
      value_delivered: analysis.value_delivered ?? null,
      type_of_service: analysis.type_of_service ?? null,
      service_type_classification: analysis.service_type_classification ?? null,
      provider_full_name: analysis.provider_full_name ?? null,
      disconnection_reason: analysis.disconnection_reason ?? null,
      who_hung_up: analysis.who_hung_up ?? null,
      // Store the full analysis object in case Retell adds new fields
      raw_analysis: analysis,
    },
    { onConflict: 'retell_call_id' }
  )

  if (error) {
    console.error('[webhook] Supabase upsert error:', error)
    // Still return 200 — we don't want Retell to keep retrying
  }

  return NextResponse.json({ received: true })
}

// ── Retell webhook payload types ──────────────────────────────────────────────

interface RetellWebhookPayload {
  event: string
  call: RetellCall
}

interface RetellCall {
  call_id: string
  from_number?: string
  to_number?: string
  start_timestamp?: number
  end_timestamp?: number
  duration_ms?: number
  call_status?: string
  transcript_object?: { role: 'agent' | 'user'; content: string }[]
  call_analysis?: {
    call_summary?: string
    call_successful?: boolean
    user_sentiment?: string
    clinical_case_description?: string
    value_delivered?: string
    type_of_service?: string
    service_type_classification?: string[]
    provider_full_name?: string
    disconnection_reason?: string
    who_hung_up?: string
    [key: string]: unknown
  }
}
