'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'

const SENTIMENTS = ['Positive', 'Neutral', 'Negative']
const SERVICE_TYPES = [
  'Home Health', 'Skilled Nursing', 'Physical Therapy',
  'Occupational Therapy', 'Speech Therapy', 'Hospice', 'Other',
]

interface Props {
  currentFilters: Record<string, string | undefined>
}

export default function CallFilters({ currentFilters }: Props) {
  const router   = useRouter()
  const pathname = usePathname()

  const [filters, setFilters] = useState({
    dateFrom:                  currentFilters.dateFrom ?? '',
    dateTo:                    currentFilters.dateTo ?? '',
    fromNumber:                currentFilters.fromNumber ?? '',
    providerName:              currentFilters.providerName ?? '',
    callSuccessful:            currentFilters.callSuccessful ?? '',
    userSentiment:             currentFilters.userSentiment ?? '',
    serviceTypeClassification: currentFilters.serviceTypeClassification ?? '',
  })

  function apply() {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
    params.set('page', '1')
    router.push(`${pathname}?${params}`)
  }

  function clear() {
    setFilters({ dateFrom: '', dateTo: '', fromNumber: '', providerName: '', callSuccessful: '', userSentiment: '', serviceTypeClassification: '' })
    router.push(pathname)
  }

  const hasFilters = Object.values(filters).some(Boolean)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">From date</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
            className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">To date</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))}
            className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Phone number</label>
          <input
            type="text"
            placeholder="+1..."
            value={filters.fromNumber}
            onChange={e => setFilters(f => ({ ...f, fromNumber: e.target.value }))}
            className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Provider name</label>
          <input
            type="text"
            placeholder="Search..."
            value={filters.providerName}
            onChange={e => setFilters(f => ({ ...f, providerName: e.target.value }))}
            className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Successful</label>
          <select
            value={filters.callSuccessful}
            onChange={e => setFilters(f => ({ ...f, callSuccessful: e.target.value }))}
            className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Sentiment</label>
          <select
            value={filters.userSentiment}
            onChange={e => setFilters(f => ({ ...f, userSentiment: e.target.value }))}
            className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All</option>
            {SENTIMENTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Service type</label>
          <select
            value={filters.serviceTypeClassification}
            onChange={e => setFilters(f => ({ ...f, serviceTypeClassification: e.target.value }))}
            className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All</option>
            {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button
            onClick={apply}
            className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Apply
          </button>
          {hasFilters && (
            <button
              onClick={clear}
              className="py-2 px-3 border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
