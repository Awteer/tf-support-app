import { getWindSpeedColor, DIRECTION_ANGLES, WIND_SPEED_THRESHOLDS } from '../../constants'

const SVG_W = 320
const RUNWAY_X = 110      // 滑走路の左端X
const RUNWAY_W = 80       // 滑走路の幅
const TOP_Y = 30          // 最大距離のY座標
const BOT_Y = 390         // 0m のY座標

// 距離(m) → SVG Y座標（maxDistMを基準に比例配置）
function distToY(distM, maxDistM) {
  return BOT_Y - (distM / maxDistM) * (BOT_Y - TOP_Y)
}

// 風向矢印SVGパス（上向き矢印を基準に回転）
function WindArrowSVG({ cx, cy, windSpeed, windDirection, size = 22 }) {
  const color = getWindSpeedColor(windSpeed)
  const angle = DIRECTION_ANGLES[windDirection] ?? 0
  const half = size / 2

  if (windSpeed == null) {
    return <circle cx={cx} cy={cy} r={5} fill="#4b5563" />
  }

  return (
    <g transform={`translate(${cx},${cy}) rotate(${angle})`}>
      <polygon
        points={`0,${-half} ${half * 0.6},${half * 0.5} 0,${half * 0.15} ${-half * 0.6},${half * 0.5}`}
        fill={color}
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="0.8"
      />
    </g>
  )
}

// 縦型滑走路ビュー（観測地点の距離に応じて矢印を動的配置）
export function RunwayWindView({ latestByLocation }) {
  // latestByLocation のキー（例: "150m", "75m"）を距離数値に変換して並べ替え
  const points = Object.entries(latestByLocation)
    .map(([label, log]) => ({
      label,
      distM: parseInt(label, 10),   // "150m" → 150
      log,
    }))
    .filter((p) => !isNaN(p.distM) && p.distM > 0)
    .sort((a, b) => b.distM - a.distM)  // 大きい順（上から表示）

  // データがない場合はデフォルトスケール（100〜600m）を表示
  const hasData = points.length > 0
  const maxDistM = hasData ? Math.max(points[0].distM, 600) : 600
  const svgH = BOT_Y + 36

  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <h2 className="text-sm font-semibold text-gray-300 mb-2">滑走路 風況ビュー</h2>

      <svg
        viewBox={`0 0 ${SVG_W} ${svgH}`}
        width="100%"
        style={{ maxHeight: 460 }}
      >
        {/* 草地背景 */}
        <rect x={0}             y={TOP_Y} width={RUNWAY_X}                     height={BOT_Y - TOP_Y} fill="#1a3a1a" rx={4} />
        <rect x={RUNWAY_X + RUNWAY_W} y={TOP_Y} width={SVG_W - RUNWAY_X - RUNWAY_W} height={BOT_Y - TOP_Y} fill="#1a3a1a" rx={4} />

        {/* 滑走路本体 */}
        <rect x={RUNWAY_X} y={TOP_Y} width={RUNWAY_W} height={BOT_Y - TOP_Y} fill="#374151" />

        {/* センターライン（破線） */}
        <line
          x1={RUNWAY_X + RUNWAY_W / 2} y1={TOP_Y + 10}
          x2={RUNWAY_X + RUNWAY_W / 2} y2={BOT_Y - 10}
          stroke="white" strokeWidth="2" strokeDasharray="14,10" opacity={0.5}
        />

        {/* 離陸方向マーク（上端） */}
        <text x={RUNWAY_X + RUNWAY_W / 2} y={TOP_Y - 8} textAnchor="middle" fill="#9ca3af" fontSize="10">
          ← 離陸方向
        </text>

        {/* スケール目盛り（最大距離と0mを表示） */}
        <text x={RUNWAY_X - 6} y={TOP_Y + 4} textAnchor="end" fill="#4b5563" fontSize="10">
          {maxDistM}m
        </text>
        <text x={RUNWAY_X - 6} y={BOT_Y + 4} textAnchor="end" fill="#4b5563" fontSize="10">
          0m
        </text>

        {/* データなし表示 */}
        {!hasData && (
          <text
            x={RUNWAY_X + RUNWAY_W / 2}
            y={(TOP_Y + BOT_Y) / 2}
            textAnchor="middle"
            fill="#4b5563"
            fontSize="12"
          >
            風データなし
          </text>
        )}

        {/* 各観測地点（実際の距離に比例したY座標に配置） */}
        {points.map(({ label, distM, log }) => {
          const y = distToY(distM, maxDistM)
          const windSpeed = log?.windSpeed ?? null
          const windDir   = log?.windDirection ?? null
          const color     = getWindSpeedColor(windSpeed)
          const arrowX    = RUNWAY_X - 36

          return (
            <g key={label}>
              {/* 距離ラベル */}
              <text x={RUNWAY_X - 6} y={y + 4} textAnchor="end" fill="#9ca3af" fontSize="11">
                {label}
              </text>

              {/* 滑走路上のマーカー */}
              <circle
                cx={RUNWAY_X + RUNWAY_W / 2}
                cy={y}
                r={4}
                fill={color}
                stroke="white"
                strokeWidth="1"
              />

              {/* 横線（滑走路→矢印をつなぐ） */}
              <line
                x1={RUNWAY_X} y1={y}
                x2={arrowX + 14} y2={y}
                stroke={color} strokeWidth="1" opacity={0.4}
              />

              {/* 風向矢印 */}
              <WindArrowSVG cx={arrowX} cy={y} windSpeed={windSpeed} windDirection={windDir} size={24} />

              {/* 風速テキスト（滑走路右側） */}
              <text
                x={RUNWAY_X + RUNWAY_W + 8}
                y={y + 4}
                fill={color}
                fontSize="11"
                fontWeight="bold"
              >
                {windSpeed != null ? `${windSpeed}` : '--'}
              </text>
            </g>
          )
        })}

        {/* 風速カラー凡例 */}
        {WIND_SPEED_THRESHOLDS.map((t, i) => {
          const prevMax = i === 0 ? 0 : WIND_SPEED_THRESHOLDS[i - 1].max
          const label = t.max === Infinity ? `${prevMax}+` : `${prevMax}〜${t.max}`
          return (
            <g key={i} transform={`translate(${i * 72 + 10}, ${BOT_Y + 20})`}>
              <circle cx={6} cy={-2} r={5} fill={t.color} />
              <text x={14} y={2} fill="#9ca3af" fontSize="10">{label} m/s</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
