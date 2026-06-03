const RETELL_API_BASE = 'https://api.retellai.com'

export async function getCallRecordingUrl(retellCallId: string): Promise<string | null> {
  const res = await fetch(`${RETELL_API_BASE}/v2/get-call/${retellCallId}`, {
    headers: { Authorization: `Bearer ${process.env.RETELL_API_KEY}` },
    next: { revalidate: 0 },
  })

  if (!res.ok) return null

  const data = await res.json()
  return data.recording_url ?? null
}

export async function verifyWebhookSignature(
  rawBody: string,
  signature: string | null
): Promise<boolean> {
  if (!signature) return false

  const secret = process.env.RETELL_WEBHOOK_SECRET!
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody))
  const computed = btoa(String.fromCharCode(...Array.from(new Uint8Array(mac))))
  return computed === signature
}
