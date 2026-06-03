import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const dateFrom = searchParams.get('dateFrom') ?? new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
  const dateTo   = searchParams.get('dateTo') ?? new Date().toISOString().split('T')[0]

  const { data: calls, error } = await supabase
    .from('calls')
    .select('start_time, duration_seconds, call_successful, user_sentiment, service_type_classification, provider_full_name')
    .gte('start_time', dateFrom)
    .lte('start_time', dateTo + 'T23:59:59Z')
    .not('start_time', 'is', null)

  if (error) {
    return NextResponse.json({ error: 'Query failed' }, { status: 500 })
  }

  const totalCalls = calls.length
  const successfulCalls = calls.filter(c => c.call_successful === true).length
  const avgDurationSeconds = totalCalls > 0
    ? Math.round(calls.reduce((sum, c) => sum + (c.duration_seconds ?? 0), 0) / totalCalls)
    : 0
  const uniqueProviders = new Set(calls.map(c => c.provider_full_name).filter(Boolean)).size

  // Calls by day
  const byDay: Record<string, number> = {}
  for (const c of calls) {
    const day = c.start_time!.split('T')[0]
    byDay[day] = (byDay[day] ?? 0) + 1
  }
  const callsByDay = Object.entries(byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }))

  // Sentiment breakdown
  const bySentiment: Record<string, number> = {}
  for (const c of calls) {
    const s = c.user_sentiment ?? 'Unknown'
    bySentiment[s] = (bySentiment[s] ?? 0) + 1
  }
  const sentimentBreakdown = Object.entries(bySentiment).map(([sentiment, count]) => ({ sentiment, count }))

  // Service type breakdown (from array field)
  const byServiceType: Record<string, number> = {}
  for (const c of calls) {
    for (const s of c.service_type_classification ?? []) {
      byServiceType[s] = (byServiceType[s] ?? 0) + 1
    }
  }
  const serviceTypeBreakdown = Object.entries(byServiceType)
    .sort(([, a], [, b]) => b - a)
    .map(([service, count]) => ({ service, count }))

  return NextResponse.json({
    totalCalls,
    successfulCalls,
    avgDurationSeconds,
    uniqueProviders,
    successRate: totalCalls > 0 ? Math.round((successfulCalls / totalCalls) * 100) : 0,
    callsByDay,
    sentimentBreakdown,
    serviceTypeBreakdown,
  })
}
