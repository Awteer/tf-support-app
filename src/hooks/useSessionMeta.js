import { useState, useEffect } from 'react'
import {
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db, getTodaySessionId } from '../firebase'

// セッションメタデータ（走行番号・現在の試験種別）の管理
export function useSessionMeta() {
  const [meta, setMeta] = useState({ currentRunNumber: 1, currentTest: null })
  const sessionId = getTodaySessionId()
  const metaRef = doc(db, 'sessions', sessionId, 'meta', 'main')

  useEffect(() => {
    const unsub = onSnapshot(metaRef, (snap) => {
      if (snap.exists()) {
        setMeta(snap.data())
      }
      // ドキュメントが存在しない場合はデフォルト値のまま待機
      // （初回書き込み時に自動生成される）
    })
    return unsub
  }, [sessionId])

  // 走行番号をインクリメント（ドキュメントがなければ新規作成）
  async function incrementRun() {
    await setDoc(
      metaRef,
      { currentRunNumber: meta.currentRunNumber + 1 },
      { merge: true }
    )
  }

  // 試験種別を送信（追走車・操作者）
  async function sendTest(testType, params) {
    // serverTimestamp()は1つの書き込みに1インスタンス必要なため分けて生成
    const base = {
      testType,
      propellerRpm: params.propellerRpm ?? '',
      aircraftSpeed: params.aircraftSpeed ?? '',
      notes: params.notes ?? '',
      runNumber: meta.currentRunNumber,
    }

    // メタデータ更新（merge:true でrunNumberを保持しつつcurrentTestを更新）
    await setDoc(
      metaRef,
      { currentTest: { ...base, sentAt: serverTimestamp() } },
      { merge: true }
    )

    // 履歴に追記（serverTimestamp()を別途生成）
    const histRef = doc(
      db,
      'sessions',
      sessionId,
      'testHistory',
      `${Date.now()}`
    )
    await setDoc(histRef, { ...base, sentAt: serverTimestamp() })
  }

  return { meta, incrementRun, sendTest }
}
