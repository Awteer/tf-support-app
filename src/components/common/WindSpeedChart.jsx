import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// 観測地点ごとの色
const LOCATION_COLORS = {
  '50m': '#60a5fa',
  '100m': '#4ade80',
  '150m': '#facc15',
  '200m': '#fb923c',
  '250m': '#f87171',
  '300m': '#c084fc',
}

// 風速時系列グラフ
export function WindSpeedChart({ logs }) {
  // 走行番号をX軸にして、地点ごとの風速をプロット
  const runNumbers = [...new Set(logs.map((l) => l.runNumber))].sort((a, b) => a - b)
  const locations = [...new Set(logs.map((l) => l.location))]

  const data = runNumbers.map((run) => {
    const entry = { run: `#${run}` }
    for (const loc of locations) {
      const log = logs.filter((l) => l.runNumber === run && l.location === loc).at(-1)
      entry[loc] = log?.windSpeed ?? null
    }
    return entry
  })

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
        風速データがありません
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="run" tick={{ fill: '#94a3b8', fontSize: 12 }} />
        <YAxis
          unit=" m/s"
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          domain={[0, 'auto']}
        />
        <Tooltip
          contentStyle={{ background: '#1e293b', border: 'none', color: '#f1f5f9' }}
          formatter={(v, name) => [`${v} m/s`, name]}
        />
        <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
        {locations.map((loc) => (
          <Line
            key={loc}
            type="monotone"
            dataKey={loc}
            stroke={LOCATION_COLORS[loc] ?? '#94a3b8'}
            strokeWidth={2}
            dot={{ r: 3 }}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
