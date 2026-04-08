import { useEffect, useState } from 'react'
import { useSessionMeta } from '../hooks/useSessionMeta'
import { useWindLogs } from '../hooks/useWindLogs'
import { useMessage } from '../hooks/useMessage'
import { WindDataInput } from '../components/crew/WindDataInput'
import { TestDisplay } from '../components/crew/TestDisplay'
import { MessageDisplay } from '../components/crew/MessageDisplay'
import { WindLogTable } from '../components/common/WindLogTable'

const TABS = ['試験内容', '風データ入力', '風況ログ']

export function CrewPage() {
  const [tab, setTab] = useState('試験内容')
  const [notifPerm, setNotifPerm] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  )
  const { meta } = useSessionMeta()
  const { logs, addWindLog } = useWindLogs()
  const { latestMessage } = useMessage()

  // 通知許可リクエスト
  async function requestNotification() {
    if (!('Notification' in window)) return
    const perm = await Notification.requestPermission()
    setNotifPerm(perm)
  }

  useEffect(() => {
    if ('Notification' in window) setNotifPerm(Notification.permission)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-24">
      {/* ヘッダー */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div>
          <p className="text-xs text-gray-400">TF運用支援</p>
          <p className="font-bold text-white">風見係</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">走行番号</p>
          <p className="text-2xl font-bold font-mono">#{meta.currentRunNumber}</p>
        </div>
      </header>

      {/* 通知許可バナー */}
      {notifPerm === 'default' && (
        <div className="bg-blue-900/60 border-b border-blue-700 px-4 py-2 flex items-center justify-between gap-2">
          <p className="text-xs text-blue-200">試験指示・メッセージの通知を受け取りますか？</p>
          <button
            onClick={requestNotification}
            className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-md"
          >
            許可する
          </button>
        </div>
      )}

      {/* タブナビ */}
      <nav className="flex overflow-x-auto bg-gray-800 border-b border-gray-700">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-shrink-0 flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
              tab === t
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      <main className="p-4 space-y-4 max-w-xl mx-auto">
        {/* 試験内容 */}
        {tab === '試験内容' && (
          <>
            <TestDisplay currentTest={meta.currentTest} />
            <MessageDisplay message={latestMessage} />
          </>
        )}

        {/* 風データ入力 */}
        {tab === '風データ入力' && (
          <WindDataInput
            currentRun={meta.currentRunNumber}
            onSubmit={addWindLog}
          />
        )}

        {/* 風況ログ */}
        {tab === '風況ログ' && (
          <div className="bg-gray-800 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-gray-300 mb-3">本日の風況ログ</h2>
            <WindLogTable logs={logs} />
          </div>
        )}
      </main>
    </div>
  )
}
