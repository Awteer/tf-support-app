import { useState } from 'react'
import { TEST_TYPES } from '../../hooks/useTestParams'

// 試験種別選択・送信パネル（追走車・操作者専用）
export function TestControlPanel({ params, currentRun, onSend, currentTest }) {
  const [selected, setSelected] = useState(TEST_TYPES[0])
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)

  async function handleSend() {
    if (!selected) return
    setSending(true)
    setError(null)
    try {
      await onSend(selected, params[selected] ?? {})
    } catch (e) {
      // エラー内容を画面に表示してデバッグできるようにする
      setError(e.message ?? String(e))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-gray-800 rounded-xl p-4 space-y-4">
      <h2 className="text-sm font-semibold text-gray-300">試験指示送信</h2>

      {/* 試験種別ボタン */}
      <div className="grid grid-cols-2 gap-2">
        {TEST_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setSelected(type)}
            className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all border ${
              selected === type
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* 選択中のパラメータプレビュー */}
      {selected && (
        <div className="bg-gray-900 rounded-lg p-3 text-xs space-y-1 text-gray-300">
          <p>
            <span className="text-gray-500">プロペラ回転数：</span>
            {params[selected]?.propellerRpm || '未設定'}
          </p>
          <p>
            <span className="text-gray-500">機体速度：</span>
            {params[selected]?.aircraftSpeed || '未設定'}
          </p>
          {params[selected]?.notes && (
            <p>
              <span className="text-gray-500">注意：</span>
              {params[selected].notes}
            </p>
          )}
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div className="bg-red-900/50 border border-red-600 rounded-lg p-3 text-xs text-red-300 break-all">
          <span className="font-bold">エラー：</span>{error}
        </div>
      )}

      {/* 送信ボタン */}
      <button
        onClick={handleSend}
        disabled={sending}
        className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 active:scale-95 text-white font-bold py-3 rounded-lg transition-all"
      >
        {sending ? '送信中...' : `走行 #${currentRun} に送信`}
      </button>

      {/* 現在送信中の試験 */}
      {currentTest && (
        <div className="border border-green-700 rounded-lg p-3 text-xs text-green-400">
          <span className="font-semibold">送信済み：</span> {currentTest.testType}（走行#{currentTest.runNumber}）
        </div>
      )}
    </div>
  )
}
