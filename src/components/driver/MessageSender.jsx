import { useState } from 'react'

// 追走車→風見係へのメッセージ送信コンポーネント
export function MessageSender({ onSend, lastMessage }) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSend() {
    if (!text.trim()) return
    setSending(true)
    try {
      await onSend(text)
      setText('')
      setSent(true)
      setTimeout(() => setSent(false), 2000)
    } finally {
      setSending(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="bg-gray-800 rounded-xl p-4 space-y-3">
      <h2 className="text-sm font-semibold text-gray-300">メッセージ送信（→ 風見係）</h2>

      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="風見係へのメッセージを入力..."
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSend}
          disabled={sending || !text.trim()}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 ${
            sent
              ? 'bg-green-700 text-green-200'
              : 'bg-orange-600 hover:bg-orange-500 text-white disabled:opacity-50'
          }`}
        >
          {sending ? '...' : sent ? '✓' : '送信'}
        </button>
      </div>

      {/* 直近送信メッセージ */}
      {lastMessage && (
        <div className="text-xs text-gray-500 truncate">
          送信済み：「{lastMessage.text}」
        </div>
      )}
    </div>
  )
}
