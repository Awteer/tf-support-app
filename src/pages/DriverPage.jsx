import { useState } from 'react'
import { useSessionMeta } from '../hooks/useSessionMeta'
import { useWindLogs } from '../hooks/useWindLogs'
import { useTestParams } from '../hooks/useTestParams'
import { useTestHistory } from '../hooks/useTestHistory'
import { RunNumberControl } from '../components/driver/RunNumberControl'
import { TestControlPanel } from '../components/driver/TestControlPanel'
import { TestParamEditor } from '../components/driver/TestParamEditor'
import { WindOverview } from '../components/driver/WindOverview'
import { WindSpeedChart } from '../components/common/WindSpeedChart'
import { WindLogTable } from '../components/common/WindLogTable'

const TABS = ['ダッシュボード', '試験指示', '風況ログ', 'パラメータ編集']

export function DriverPage() {
  const [tab, setTab] = useState('ダッシュボード')
  const { meta, incrementRun, sendTest } = useSessionMeta()
  const { logs, getLatestByLocation } = useWindLogs()
  const { params, updateParams } = useTestParams()
  const { history } = useTestHistory()

  const latestByLocation = getLatestByLocation()

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-24">
      {/* ヘッダー */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div>
          <p className="text-xs text-gray-400">TF運用支援</p>
          <p className="font-bold text-white">追走車</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">走行番号</p>
          <p className="text-2xl font-bold font-mono">#{meta.currentRunNumber}</p>
        </div>
      </header>

      {/* タブナビ */}
      <nav className="flex overflow-x-auto bg-gray-800 border-b border-gray-700">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
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
        {/* ダッシュボード */}
        {tab === 'ダッシュボード' && (
          <>
            <RunNumberControl
              currentRun={meta.currentRunNumber}
              onIncrement={incrementRun}
            />
            <WindOverview latestByLocation={latestByLocation} />

            {/* 現在の試験種別 */}
            {meta.currentTest && (
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">現在の試験種別</p>
                <p className="text-2xl font-bold text-green-400">
                  {meta.currentTest.testType}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  走行#{meta.currentTest.runNumber}
                </p>
              </div>
            )}

            {/* 試験履歴 */}
            <div className="bg-gray-800 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-gray-300 mb-2">試験送信履歴</h2>
              {history.length === 0 ? (
                <p className="text-gray-500 text-sm">履歴なし</p>
              ) : (
                <ul className="space-y-1">
                  {history.slice(0, 10).map((h) => (
                    <li key={h.id} className="text-sm flex gap-2 text-gray-300">
                      <span className="font-mono text-gray-500">#{h.runNumber}</span>
                      <span>{h.testType}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {/* 試験指示 */}
        {tab === '試験指示' && (
          <TestControlPanel
            params={params}
            currentRun={meta.currentRunNumber}
            onSend={sendTest}
            currentTest={meta.currentTest}
          />
        )}

        {/* 風況ログ */}
        {tab === '風況ログ' && (
          <>
            <div className="bg-gray-800 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-gray-300 mb-3">走行別 風速グラフ</h2>
              <WindSpeedChart logs={logs} />
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-gray-300 mb-3">蓄積ログ</h2>
              <WindLogTable logs={logs} />
            </div>
          </>
        )}

        {/* パラメータ編集 */}
        {tab === 'パラメータ編集' && (
          <TestParamEditor params={params} onUpdate={updateParams} />
        )}
      </main>
    </div>
  )
}
