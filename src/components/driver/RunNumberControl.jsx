// 走行番号管理（追走車・操作者専用）
export function RunNumberControl({ currentRun, onIncrement }) {
  return (
    <div className="bg-gray-800 rounded-xl p-4 flex items-center justify-between gap-4">
      <div>
        <p className="text-xs text-gray-400 mb-1">現在の走行番号</p>
        <p className="text-4xl font-bold text-white font-mono">#{currentRun}</p>
      </div>
      <button
        onClick={onIncrement}
        className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all"
      >
        次の走行 +1
      </button>
    </div>
  )
}
