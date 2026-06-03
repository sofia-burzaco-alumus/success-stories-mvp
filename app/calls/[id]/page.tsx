import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import NavBar from '@/components/NavBar'
import TranscriptViewer from '@/components/TranscriptViewer'
import AudioPlayer from '@/components/AudioPlayer'
import { formatDateTime, formatDuration, formatPhone, sentimentColor } from '@/lib/utils'
import type { Call } from '@/lib/types'

export default async function CallDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: call, error } = await supabase
    .from('calls')
    .select('*')
    .eq('retell_call_id', params.id)
    .single()

  if (error || !call) notFound()

  const c = call as Call

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Link href="/calls" className="text-sm text-blue-600 hover:underline mb-2 inline-block">
              ← Back to calls
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">
              {formatPhone(c.from_number)}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{formatDateTime(c.start_time)}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${c.call_successful ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {c.call_successful ? 'Successful' : 'Unsuccessful'}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${sentimentColor(c.user_sentiment)}`}>
              {c.user_sentiment ?? 'Unknown sentiment'}
            </span>
          </div>
        </div>

        {/* Audio player */}
        <AudioPlayer callId={params.id} />

        {/* Analysis grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard label="Provider" value={c.provider_full_name} />
          <InfoCard label="Duration" value={formatDuration(c.duration_seconds)} />
          <InfoCard label="Type of Service" value={c.type_of_service} />
          <InfoCard label="Who Hung Up" value={c.who_hung_up} />
          <InfoCard label="Disconnection Reason" value={c.disconnection_reason} />
          <InfoCard
            label="Service Classification"
            value={c.service_type_classification?.join(', ')}
          />
        </div>

        {/* Text analysis fields */}
        {c.call_summary && (
          <TextCard label="Call Summary" value={c.call_summary} />
        )}
        {c.clinical_case_description && (
          <TextCard label="Clinical Case Description" value={c.clinical_case_description} />
        )}
        {c.value_delivered && (
          <TextCard label="Value Delivered" value={c.value_delivered} />
        )}

        {/* Transcript */}
        {c.transcript && c.transcript.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Transcript</h2>
            <TranscriptViewer transcript={c.transcript} />
          </div>
        )}
      </main>
    </div>
  )
}

function InfoCard({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-sm text-gray-900">{value ?? '—'}</p>
    </div>
  )
}

function TextCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{label}</p>
      <p className="text-sm text-gray-700 leading-relaxed">{value}</p>
    </div>
  )
}
