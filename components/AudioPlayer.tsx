'use client'

import { useState } from 'react'

export default function AudioPlayer({ callId }: { callId: string }) {
  const [url, setUrl]       = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/calls/${callId}/recording`)
      if (!res.ok) {
        setError('Recording not available')
        return
      }
      const { url } = await res.json()
      setUrl(url)
    } catch {
      setError('Failed to load recording')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-gray-900 text-sm">Recording</h2>
        {!url && (
          <button
            onClick={load}
            disabled={loading}
            className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading…' : 'Load recording'}
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {url && (
        <audio controls className="w-full" src={url}>
          Your browser does not support audio playback.
        </audio>
      )}

      {!url && !error && (
        <p className="text-xs text-gray-400">
          Click "Load recording" to stream from Retell — audio is not stored locally.
        </p>
      )}
    </div>
  )
}
