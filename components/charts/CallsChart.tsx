'use client'

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { format, parseISO } from 'date-fns'

interface Props {
  data: { date: string; count: number }[]
}

export default function CallsChart({ data }: Props) {
  if (data.length === 0) return <p className="text-sm text-gray-400 text-center py-8">No data</p>

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="date"
          tickFormatter={d => format(parseISO(d), 'MMM d')}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
        />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
        <Tooltip
          labelFormatter={d => format(parseISO(d as string), 'MMM d, yyyy')}
          formatter={(v: number) => [v, 'Calls']}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
