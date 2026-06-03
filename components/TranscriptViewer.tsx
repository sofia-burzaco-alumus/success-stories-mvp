import type { TranscriptTurn } from '@/lib/types'

export default function TranscriptViewer({ transcript }: { transcript: TranscriptTurn[] }) {
  return (
    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
      {transcript.map((turn, i) => (
        <div
          key={i}
          className={`flex gap-3 ${turn.role === 'agent' ? '' : 'flex-row-reverse'}`}
        >
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
            turn.role === 'agent'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {turn.role === 'agent' ? 'A' : 'P'}
          </div>
          <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
            turn.role === 'agent'
              ? 'bg-blue-50 text-blue-900 rounded-tl-sm'
              : 'bg-gray-100 text-gray-800 rounded-tr-sm'
          }`}>
            {turn.content}
          </div>
        </div>
      ))}
    </div>
  )
}
