import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCallRecordingUrl } from '@/lib/retell'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Confirm the call exists in our DB before hitting Retell
  const { data: call, error } = await supabase
    .from('calls')
    .select('retell_call_id')
    .eq('retell_call_id', params.id)
    .single()

  if (error || !call) {
    return NextResponse.json({ error: 'Call not found' }, { status: 404 })
  }

  const url = await getCallRecordingUrl(call.retell_call_id)
  if (!url) {
    return NextResponse.json({ error: 'Recording not available' }, { status: 404 })
  }

  return NextResponse.json({ url })
}
