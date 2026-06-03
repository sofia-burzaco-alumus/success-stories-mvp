'use client'

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const COLORS: Record<string, string> = {
  Positive: '#22c55e',
  Neutral:  '#94a3b8',
  Negative: '#ef4444',
  Unknown:  '#e2e8f0',
}

interface Props {
  data: { sentiment: string; count: number }[]
}

export default function SentimentChart({ data }: Props) {
  if (data.length === 0) return <p className="text-sm text-gray-400 text-center py-8">No data</p>

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="sentiment"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ sentiment, percent }) =>
            `${sentiment} ${(percent * 100).toFixed(0)}%`
          }
          labelLine={false}
        >
          {data.map(entry => (
            <Cell
              key={entry.sentiment}
              fill={COLORS[entry.sentiment] ?? '#cbd5e1'}
            />
          ))}
        </Pie>
        <Tooltip formatter={(v: number) => [v, 'Calls']} />
      </PieChart>
    </ResponsiveContainer>
  )
}
