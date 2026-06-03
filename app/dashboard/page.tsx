import { createClient } from '@/lib/supabase/server'
import NavBar from '@/components/NavBar'
import MetricCard from '@/components/MetricCard'
import CallsChart from '@/components/charts/CallsChart'
import SentimentChart from '@/components/charts/SentimentChart'
import ServiceTypeChart from '@/components/charts/ServiceTypeChart'
import { formatDuration } from '@/lib/utils'
import type { DashboardData } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = createClient()

  const dateFrom = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
  const dateTo   = new Date().toISOString().split('T')[0]

  const { data: calls } = await supabase
    .from('calls')
    .select('start_time, duration_seconds, call_successful, user_sentiment, service_type_classification, provider_full_name')
    .gte('start_time', dateFrom)
    .lte('start_time', dateTo + 'T23:59:59Z')
    .not('start_time', 'is', null)

  const c = calls ?? []
  const totalCalls       = c.length
  const successfulCalls  = c.filter(x => x.call_successful === true).length
  const avgDuration      = totalCalls > 0
    ? Math.round(c.reduce((s, x) => s + (x.duration_seconds ?? 0), 0) / totalCalls)
    : 0
  const uniqueProviders  = new Set(c.map(x => x.provider_full_name).filter(Boolean)).size
  const successRate      = totalCalls > 0 ? Math.round((successfulCalls / totalCalls) * 100) : 0

  const byDay: Record<string, number> = {}
  for (const x of c) {
    const day = x.start_time!.split('T')[0]
    byDay[day] = (byDay[day] ?? 0) + 1
  }
  const callsByDay = Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b)).map(([date, count]) => ({ date, count }))

  const bySentiment: Record<string, number> = {}
  for (const x of c) {
    const s = x.user_sentiment ?? 'Unknown'
    bySentiment[s] = (bySentiment[s] ?? 0) + 1
  }
  const sentimentBreakdown = Object.entries(bySentiment).map(([sentiment, count]) => ({ sentiment, count }))

  const byService: Record<string, number> = {}
  for (const x of c) {
    for (const s of (x.service_type_classification ?? [])) {
      byService[s] = (byService[s] ?? 0) + 1
    }
  }
  const serviceTypeBreakdown = Object.entries(byService).sort(([, a], [, b]) => b - a).map(([service, count]) => ({ service, count }))

  const data: DashboardData = {
    totalCalls, successfulCalls, avgDurationSeconds: avgDuration,
    uniqueProviders, successRate, callsByDay, sentimentBreakdown, serviceTypeBreakdown,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Total Calls" value={String(data.totalCalls)} />
          <MetricCard label="Success Rate" value={`${data.successRate}%`} accent="green" />
          <MetricCard label="Avg Duration" value={formatDuration(data.avgDurationSeconds)} />
          <MetricCard label="Unique Providers" value={String(data.uniqueProviders)} />
        </div>

        {/* Calls over time */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Calls per Day</h2>
          <CallsChart data={data.callsByDay} />
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Sentiment Breakdown</h2>
            <SentimentChart data={data.sentimentBreakdown} />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Service Type Distribution</h2>
            <ServiceTypeChart data={data.serviceTypeBreakdown} />
          </div>
        </div>
      </main>
    </div>
  )
}
