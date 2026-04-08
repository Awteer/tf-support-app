import { WindArrow } from '../common/WindArrow'

// 観測地点の定義（順序通り）
const LOCATIONS = ['50m', '100m', '150m', '200m', '250m', '300m']

// 全地点の最新風況一覧カード
export function WindOverview({ latestByLocation }) {
  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <h2 className="text-sm font-semibold text-gray-300 mb-3">最新風況サマリー</h2>
      <div className="grid grid-cols-3 gap-3">
        {LOCATIONS.map((loc) => {
          const log = latestByLocation[loc]
          return (
            <div
              key={loc}
              className="bg-gray-900 rounded-lg p-2 flex flex-col items-center gap-1"
            >
              <span className="text-xs text-gray-400 font-medium">{loc}</span>
              <WindArrow
                windSpeed={log?.windSpeed ?? null}
                windDirection={log?.windDirection ?? null}
                size={36}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
