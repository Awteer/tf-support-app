import { useState } from 'react'
import { TEST_TYPES } from '../../hooks/useTestParams'

// 試験パラメータ編集（追走車・操作者専用）
export function TestParamEditor({ params, onUpdate }) {
  const [selected, setSelected] = useState(TEST_TYPES[0])
  const [draft, setDraft] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function handleSelectType(type) {
    setSelected(type)
    setDraft({})
    setSaved(false)
  }

  function currentVal(key) {
    return draft[key] !== undefined ? draft[key] : params[selected]?.[key] ?? ''
  }

  async function handleSave() {
    setSaving(true)
    const merged = {
      propellerRpm: currentVal('propellerRpm'),
      aircraftSpeed: currentVal('aircraftSpeed'),
      notes: currentVal('notes'),
    }
    await onUpdate(selected, merged)
    setSaving(false)
    setSaved(true)
    setDraft({})
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-gray-800 rounded-xl p-4 space-y-4">
      <h2 className="text-sm font-semibold text-gray-300">試験パラメータ編集</h2>

      {/* 試験種別タブ */}
      <div className="flex flex-wrap gap-1.5">
        {TEST_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => handleSelectType(type)}
            className={`text-xs px-2.5 py-1 rounded-md transition-all ${
              selected === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* 入力フォーム */}
      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-400 block mb-1">プロペラ回転数</label>
          <input
            type="text"
            value={currentVal('propellerRpm')}
            onChange={(e) => setDraft((d) => ({ ...d, propellerRpm: e.target.value }))}
            placeholder="例: 1200 rpm"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">機体速度</label>
          <input
            type="text"
            value={currentVal('aircraftSpeed')}
            onChange={(e) => setDraft((d) => ({ ...d, aircraftSpeed: e.target.value }))}
            placeholder="例: 35 km/h"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">注意事項</label>
          <textarea
            value={currentVal('notes')}
            onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
            rows={3}
            placeholder="注意事項を入力..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all ${
          saved
            ? 'bg-green-700 text-green-200'
            : 'bg-blue-600 hover:bg-blue-500 text-white'
        } disabled:opacity-50`}
      >
        {saving ? '保存中...' : saved ? '保存しました ✓' : '保存'}
      </button>
    </div>
  )
}
