import { createClient } from '@/lib/supabase/server'
import NavBar from '@/components/NavBar'
import CallsTable from '@/components/CallsTable'
import CallFilters from '@/components/CallFilters'

interface Props {
  searchParams: Record<string, string | undefined>
}

export default async function CallsPage({ searchParams }: Props) {
  const supabase = createClient()
  const page     = Math.max(1, Number(searchParams.page ?? 1))
  const pageSize = 25
  const from     = (page - 1) * pageSize

  let query = supabase
    .from('calls')
    .select('*', { count: 'exact' })
    .order('start_time', { ascending: false })
    .range(from, from + pageSize - 1)

  if (searchParams.dateFrom) query = query.gte('start_time', searchParams.dateFrom)
  if (searchParams.dateTo)   query = query.lte('start_time', searchParams.dateTo + 'T23:59:59Z')
  if (searchParams.fromNumber)   query = query.ilike('from_number', `%${searchParams.fromNumber}%`)
  if (searchParams.providerName) query = query.ilike('provider_full_name', `%${searchParams.providerName}%`)
  if (searchParams.callSuccessful === 'true')  query = query.eq('call_successful', true)
  if (searchParams.callSuccessful === 'false') query = query.eq('call_successful', false)
  if (searchParams.userSentiment)              query = query.ilike('user_sentiment', searchParams.userSentiment)
  if (searchParams.serviceTypeClassification)  query = query.contains('service_type_classification', [searchParams.serviceTypeClassification])

  const { data: calls, count } = await query

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Call History</h1>
          <p className="text-sm text-gray-500 mt-1">{count ?? 0} total calls</p>
        </div>

        <CallFilters currentFilters={searchParams} />

        <div className="mt-4">
          <CallsTable
            calls={calls ?? []}
            total={count ?? 0}
            page={page}
            pageSize={pageSize}
          />
        </div>
      </main>
    </div>
  )
}
