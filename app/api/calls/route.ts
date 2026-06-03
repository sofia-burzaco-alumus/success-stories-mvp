import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const page     = Math.max(1, Number(searchParams.get('page') ?? 1))
  const pageSize = Math.min(100, Number(searchParams.get('pageSize') ?? 25))
  const from     = (page - 1) * pageSize

  let query = supabase
    .from('calls')
    .select('*', { count: 'exact' })
    .order('start_time', { ascending: false })
    .range(from, from + pageSize - 1)

  const dateFrom = searchParams.get('dateFrom')
  const dateTo   = searchParams.get('dateTo')
  if (dateFrom) query = query.gte('start_time', dateFrom)
  if (dateTo)   query = query.lte('start_time', dateTo + 'T23:59:59Z')

  const fromNumber = searchParams.get('fromNumber')
  if (fromNumber) query = query.ilike('from_number', `%${fromNumber}%`)

  const providerName = searchParams.get('providerName')
  if (providerName) query = query.ilike('provider_full_name', `%${providerName}%`)

  const callSuccessful = searchParams.get('callSuccessful')
  if (callSuccessful === 'true')  query = query.eq('call_successful', true)
  if (callSuccessful === 'false') query = query.eq('call_successful', false)

  const sentiment = searchParams.get('userSentiment')
  if (sentiment) query = query.ilike('user_sentiment', sentiment)

  const serviceType = searchParams.get('serviceTypeClassification')
  if (serviceType) query = query.contains('service_type_classification', [serviceType])

  const { data, count, error } = await query

  if (error) {
    console.error('[calls] query error:', error)
    return NextResponse.json({ error: 'Query failed' }, { status: 500 })
  }

  return NextResponse.json({ calls: data, total: count, page, pageSize })
}
