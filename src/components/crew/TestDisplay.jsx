import { useEffect, useRef } from 'react'

// 試験内容の大画面表示（風見係専用）
export function TestDisplay({ currentTest }) {
  const prevTestTypeRef = useRef(null)

  useEffect(() => {
    if (!currentTest) return

    // 試験種別が変わった場合にブラウザ通知を送る
    if (
      currentTest.testType !== prevTestTypeRef.current &&
      'Notification' in window
    ) {
      if (Notification.permission === 'granted') {
        new Notification('試験内容が更新されました', {
          body: `${currentTest.testType}（走行 #${currentTest.runNumber}）`,
          icon: '/favicon.ico',
          tag: 'test-update', // 重複通知を防ぐ
        })
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((perm) => {
          if (perm === 'granted') {
            new Notification('試験内容が更新されました', {
              body: `${currentTest.testType}（走行 #${currentTest.runNumber}）`,
              tag: 'test-update',
            })
          }
        })
      }
    }
    prevTestTypeRef.current = currentTest.testType
  }, [currentTest?.testType, currentTest?.runNumber])

  if (!currentTest) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 text-center space-y-2">
        <p className="text-gray-400 text-sm">試験指示待機中</p>
        <p className="text-gray-600 text-xs">追走車からの指示をお待ちください</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden border border-blue-700/50">
      {/* 試験種別（大きく表示） */}
      <div className="bg-blue-900/50 px-4 py-5 text-center">
        <p className="text-xs text-blue-300 mb-1">現在の試験種別</p>
        <p className="text-3xl font-extrabold text-white tracking-wide">
          {currentTest.testType}
        </p>
        <p className="text-xs text-blue-400 mt-1">走行 #{currentTest.runNumber}</p>
      </div>

      {/* パラメータ詳細 */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-900 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">プロペラ回転数</p>
            <p className="text-xl font-bold text-yellow-400">
              {currentTest.propellerRpm || '---'}
            </p>
          </div>
          <div className="bg-gray-900 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">機体速度</p>
            <p className="text-xl font-bold text-yellow-400">
              {currentTest.aircraftSpeed || '---'}
            </p>
          </div>
        </div>

        {currentTest.notes && (
          <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3">
            <p className="text-xs text-red-400 mb-1 font-semibold">⚠ 注意事項</p>
            <p className="text-sm text-red-200 whitespace-pre-wrap">{currentTest.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
