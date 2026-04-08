import { useState } from 'react'

// 全データリセットボタン（確認ダイアログ付き）
export function ResetButton({ onReset }) {
  const [confirm, setConfirm] = useState(false)
  const [resetting, setResetting] = useState(false)

  async function handleReset() {
    setResetting(true)
    try {
      await onReset()
    } finally {
      setResetting(false)
      setConfirm(false)
    }
  }

  if (!confirm) {
    return (
      <button
        onClick={() => setConfirm(true)}
        className="w-full border border-red-800 text-red-500 hover:bg-red-900/30 py-2.5 rounded-lg text-sm font-medium transition-all"
      >
        全データをリセット
      </button>
    )
  }

  return (
    <div className="border border-red-700 bg-red-900/30 rounded-xl p-4 space-y-3">
      <p className="text-sm text-red-300 font-semibold text-center">
        本当にリセットしますか？
      </p>
      <p className="text-xs text-red-400 text-center">
        走行ログ・試験履歴・メッセージ・走行番号がすべて削除されます。<br />
        この操作は元に戻せません。
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => setConfirm(false)}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm font-medium transition-all"
        >
          キャンセル
        </button>
        <button
          onClick={handleReset}
          disabled={resetting}
          className="flex-1 bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-bold transition-all"
        >
          {resetting ? 'リセット中...' : 'リセット実行'}
        </button>
      </div>
    </div>
  )
}
