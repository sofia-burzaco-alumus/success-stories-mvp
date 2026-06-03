'use client'

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

interface Props {
  data: { service: string; count: number }[]
}

export default function ServiceTypeChart({ data }: Props) {
  if (data.length === 0) return <p className="text-sm text-gray-400 text-center py-8">No data</p>

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="service"
          width={120}
          tick={{ fontSize: 11, fill: '#64748b' }}
        />
        <Tooltip formatter={(v: number) => [v, 'Calls']} />
        <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
