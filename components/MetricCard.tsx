interface Props {
  label: string
  value: string
  accent?: 'green' | 'blue' | 'default'
}

export default function MetricCard({ label, value, accent = 'default' }: Props) {
  const valueClass =
    accent === 'green' ? 'text-green-600' :
    accent === 'blue'  ? 'text-blue-600' :
    'text-gray-900'

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${valueClass}`}>{value}</p>
    </div>
  )
}
