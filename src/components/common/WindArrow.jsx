// 風速に応じた色を返す
export function windSpeedColor(speed) {
  if (speed === null || speed === undefined) return '#94a3b8' // gray
  if (speed < 1) return '#60a5fa'  // blue: 静穏
  if (speed < 3) return '#4ade80'  // green: 弱風
  if (speed < 5) return '#facc15'  // yellow: 並風
  if (speed < 7) return '#fb923c'  // orange: 強風
  return '#f87171'                  // red: 暴風
}

// 風向→矢印の回転角度（矢印は風が吹いてくる方向を指す）
const DIRECTION_ANGLES = {
  N: 180, NNE: 202.5, NE: 225, ENE: 247.5,
  E: 270, ESE: 292.5, SE: 315, SSE: 337.5,
  S: 0, SSW: 22.5, SW: 45, WSW: 67.5,
  W: 90, WNW: 112.5, NW: 135, NNW: 157.5,
}

// 矢印＋カラービジュアルコンポーネント
export function WindArrow({ windSpeed, windDirection, size = 48 }) {
  const color = windSpeedColor(windSpeed)
  const angle = DIRECTION_ANGLES[windDirection] ?? 0

  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        style={{ transform: `rotate(${angle}deg)`, transition: 'transform 0.4s' }}
      >
        {/* 矢印（上向き＝南風）を基準に回転 */}
        <polygon
          points="24,4 34,38 24,30 14,38"
          fill={color}
          stroke="white"
          strokeWidth="1.5"
        />
      </svg>
      <span
        className="text-xs font-bold px-1.5 py-0.5 rounded"
        style={{ color, border: `1.5px solid ${color}` }}
      >
        {windSpeed != null ? `${windSpeed} m/s` : '---'}
      </span>
      <span className="text-xs text-gray-500">{windDirection ?? '---'}</span>
    </div>
  )
}
