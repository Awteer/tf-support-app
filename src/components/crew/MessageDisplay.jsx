import { useEffect, useRef } from 'react'

function formatTime(ts) {
  if (!ts) return ''
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// 追走車からのメッセージ表示（風見係専用）
export function MessageDisplay({ message }) {
  const prevTextRef = useRef(null)

  useEffect(() => {
    if (!message) return
    if (message.text === prevTextRef.current) return

    // 新着メッセージ時にブラウザ通知
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('追走車からメッセージ', {
        body: message.text,
        tag: 'driver-message',
      })
    }
    prevTextRef.current = message.text
  }, [message?.text])

  if (!message) {
    return (
      <div className="bg-gray-800 rounded-xl p-4 text-center text-gray-500 text-sm">
        メッセージなし
      </div>
    )
  }

  return (
    <div className="bg-orange-900/40 border border-orange-600/60 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-orange-400 font-semibold">追走車からのメッセージ</p>
        <p className="text-xs text-gray-500">{formatTime(message.sentAt)}</p>
      </div>
      <p className="text-xl font-bold text-white whitespace-pre-wrap">{message.text}</p>
    </div>
  )
}
