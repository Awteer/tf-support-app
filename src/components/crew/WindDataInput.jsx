import { useState } from 'react'
import { LOCATIONS } from '../../constants'

const DIRECTIONS_8 = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
const DIRECTIONS_16 = [
  'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
]

// 風データ入力フォーム（風見係専用）
export function WindDataInput({ currentRun, onSubmit }) {
  const [locationText, setLocationText] = useState('50')  // 数値文字列（単位:m）
  const [windSpeed, setWindSpeed]     = useState('')
  const [windDirection, setWindDirection] = useState('N')
  const [use16, setUse16]             = useState(false)
  const [submitting, setSubmitting]   = useState(false)
  const [submitted, setSubmitted]     = useState(false)

  const directions = use16 ? DIRECTIONS_16 : DIRECTIONS_8

  // クイック選択ボタン → テキスト欄を更新
  function handleQuickSelect(loc) {
    setLocationText(loc.replace('m', ''))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const num = Number(locationText)
    if (!windSpeed || isNaN(Number(windSpeed)) || !locationText || isNaN(num) || num <= 0) return
    const location = `${num}m`
    setSubmitting(true)
    await onSubmit({ runNumber: currentRun, location, windSpeed, windDirection })
    setSubmitting(false)
    setSubmitted(true)
    setWindSpeed('')
    setTimeout(() => setSubmitted(false), 2500)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-4 space-y-4">
      <h2 className="text-sm font-semibold text-gray-300">風データ入力</h2>
      <p className="text-xs text-gray-500">走行 #{currentRun} に記録されます</p>

      {/* 観測地点：クイック選択 ＋ 自由入力 */}
      <div>
        <label className="text-xs text-gray-400 block mb-2">観測地点</label>
        {/* クイック選択ボタン */}
        <div className="grid grid-cols-3 gap-1.5 mb-2">
          {LOCATIONS.map((loc) => {
            const val = loc.replace('m', '')
            return (
              <button
                key={loc}
                type="button"
                onClick={() => handleQuickSelect(loc)}
                className={`py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  locationText === val
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {loc}
              </button>
            )
          })}
        </div>
        {/* 自由数値入力 */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            step="1"
            value={locationText}
            onChange={(e) => setLocationText(e.target.value)}
            placeholder="任意の距離"
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white text-center focus:outline-none focus:border-blue-500"
          />
          <span className="text-sm text-gray-400 font-medium">m</span>
        </div>
      </div>

      {/* 風速 */}
      <div>
        <label className="text-xs text-gray-400 block mb-1">風速 (m/s)</label>
        <input
          type="number"
          step="0.1"
          min="0"
          value={windSpeed}
          onChange={(e) => setWindSpeed(e.target.value)}
          placeholder="例: 2.5"
          required
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-xl font-bold text-white text-center focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* 風向 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-gray-400">風向</label>
          <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={use16}
              onChange={(e) => setUse16(e.target.checked)}
              className="w-3 h-3"
            />
            16方位
          </label>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {directions.map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => setWindDirection(dir)}
              className={`py-1.5 rounded-md text-xs font-medium transition-all ${
                windDirection === dir
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {dir}
            </button>
          ))}
        </div>
      </div>

      {/* 送信ボタン */}
      <button
        type="submit"
        disabled={submitting || !windSpeed || !locationText}
        className={`w-full py-3.5 rounded-xl font-bold text-lg transition-all active:scale-95 ${
          submitted
            ? 'bg-green-700 text-green-200'
            : 'bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50'
        }`}
      >
        {submitting ? '送信中...' : submitted ? '送信しました ✓' : '送信'}
      </button>
    </form>
  )
}
