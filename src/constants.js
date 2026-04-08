// 風速カラー閾値（ここを変更することで全体の色が変わります）
export const WIND_SPEED_THRESHOLDS = [
  { max: 1,        color: '#60a5fa', label: '弱風' },   // 青:  0〜1 m/s 未満
  { max: 2,        color: '#facc15', label: '中風' },   // 黄:  1〜2 m/s 未満
  { max: Infinity, color: '#f87171', label: '強風' },   // 赤:  2 m/s 以上
]

// 風速に応じた色を返す
export function getWindSpeedColor(speed) {
  if (speed == null || speed === '') return '#94a3b8' // グレー（未計測）
  const s = Number(speed)
  for (const t of WIND_SPEED_THRESHOLDS) {
    if (s < t.max) return t.color
  }
  return WIND_SPEED_THRESHOLDS.at(-1).color
}

// 風向→角度（矢印が向く先：風が吹いていく方向）
export const DIRECTION_ANGLES = {
  N: 180, NNE: 202.5, NE: 225, ENE: 247.5,
  E: 270,  ESE: 292.5, SE: 315, SSE: 337.5,
  S: 0,   SSW: 22.5,  SW: 45,  WSW: 67.5,
  W: 90,  WNW: 112.5, NW: 135, NNW: 157.5,
}

// 観測地点クイック選択リスト
export const LOCATIONS = ['100m', '200m', '300m', '400m', '500m', '600m']
