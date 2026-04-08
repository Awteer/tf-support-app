import { windSpeedColor } from './WindArrow'

function formatTime(ts) {
  if (!ts) return '--:--'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
}

// 風況ログ一覧テーブル
export function WindLogTable({ logs }) {
  const sorted = [...logs].sort((a, b) => {
    const ta = a.timestamp?.seconds ?? 0
    const tb = b.timestamp?.seconds ?? 0
    return tb - ta
  })

  if (sorted.length === 0) {
    return (
      <div className="text-gray-400 text-sm text-center py-6">
        ログがありません
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            <th className="text-left py-2 px-2">走行</th>
            <th className="text-left py-2 px-2">時刻</th>
            <th className="text-left py-2 px-2">地点</th>
            <th className="text-left py-2 px-2">風速</th>
            <th className="text-left py-2 px-2">風向</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((log) => (
            <tr key={log.id} className="border-b border-gray-800 hover:bg-gray-800/50">
              <td className="py-1.5 px-2 font-mono">#{log.runNumber}</td>
              <td className="py-1.5 px-2 font-mono text-gray-400">{formatTime(log.timestamp)}</td>
              <td className="py-1.5 px-2">{log.location}</td>
              <td
                className="py-1.5 px-2 font-bold"
                style={{ color: windSpeedColor(log.windSpeed) }}
              >
                {log.windSpeed} m/s
              </td>
              <td className="py-1.5 px-2">{log.windDirection}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
