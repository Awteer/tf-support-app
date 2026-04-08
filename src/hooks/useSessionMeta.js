import { useState, useEffect } from 'react'
import {
  doc,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  getDocs,
  writeBatch,
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
        const data = snap.data()
        // currentRunNumberが欠落している場合は1にフォールバック
        setMeta({
          currentRunNumber: Number(data.currentRunNumber) || 1,
          currentTest: data.currentTest ?? null,
        })
      }
    })
    return unsub
  }, [sessionId])

  // 走行番号をインクリメント（ドキュメントがなければ新規作成）
  async function incrementRun() {
    const next = (Number(meta.currentRunNumber) || 1) + 1
    await setDoc(metaRef, { currentRunNumber: next }, { merge: true })
  }

  // 試験種別を送信（追走車・操作者）
  async function sendTest(testType, params) {
    const runNumber = Number(meta.currentRunNumber) || 1
    const base = {
      testType,
      propellerRpm: params.propellerRpm ?? '',
      aircraftSpeed: params.aircraftSpeed ?? '',
      notes: params.notes ?? '',
      runNumber,
    }
    await setDoc(
      metaRef,
      {
        currentRunNumber: runNumber,
        currentTest: { ...base, sentAt: serverTimestamp() },
      },
      { merge: true }
    )
    const histRef = doc(db, 'sessions', sessionId, 'testHistory', `${Date.now()}`)
    await setDoc(histRef, { ...base, sentAt: serverTimestamp() })
  }

  // 全データリセット（走行ログ・試験履歴・メタ情報・メッセージ）
  async function resetAll() {
    const batch = writeBatch(db)

    // windLogs を全削除
    const windSnap = await getDocs(collection(db, 'sessions', sessionId, 'windLogs'))
    windSnap.docs.forEach((d) => batch.delete(d.ref))

    // testHistory を全削除
    const histSnap = await getDocs(collection(db, 'sessions', sessionId, 'testHistory'))
    histSnap.docs.forEach((d) => batch.delete(d.ref))

    // meta/main をリセット
    batch.set(doc(db, 'sessions', sessionId, 'meta', 'main'), {
      currentRunNumber: 1,
      currentTest: null,
    })

    // メッセージをクリア
    batch.delete(doc(db, 'sessions', sessionId, 'meta', 'message'))

    await batch.commit()
  }

  return { meta, incrementRun, sendTest, resetAll }
}
