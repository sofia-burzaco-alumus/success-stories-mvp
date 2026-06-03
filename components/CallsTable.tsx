import Link from 'next/link'
import type { Call } from '@/lib/types'
import { formatDateTime, formatDuration, formatPhone, sentimentColor } from '@/lib/utils'
import Pagination from '@/components/Pagination'

interface Props {
  calls: Call[]
  total: number
  page: number
  pageSize: number
}

export default function CallsTable({ calls, total, page, pageSize }: Props) {
  if (calls.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500 text-sm">No calls found matching your filters.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">From</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Provider</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Duration</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Successful</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Sentiment</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Service Type</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {calls.map(call => (
              <tr key={call.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                  {formatDateTime(call.start_time)}
                </td>
                <td className="px-4 py-3 font-mono text-gray-700">
                  {formatPhone(call.from_number)}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {call.provider_full_name ?? '—'}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {formatDuration(call.duration_seconds)}
                </td>
                <td className="px-4 py-3">
                  {call.call_successful === null ? (
                    <span className="text-gray-400">—</span>
                  ) : call.call_successful ? (
                    <span className="text-green-700 font-medium">Yes</span>
                  ) : (
                    <span className="text-red-600 font-medium">No</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {call.user_sentiment ? (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sentimentColor(call.user_sentiment)}`}>
                      {call.user_sentiment}
                    </span>
                  ) : '—'}
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs">
                  {call.service_type_classification?.join(', ') ?? '—'}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/calls/${call.retell_call_id}`}
                    className="text-blue-600 hover:underline text-xs whitespace-nowrap"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination total={total} page={page} pageSize={pageSize} />
    </div>
  )
}
