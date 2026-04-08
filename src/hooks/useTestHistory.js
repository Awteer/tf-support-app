import { useState, useEffect } from 'react'
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore'
import { db, getTodaySessionId } from '../firebase'

// 試験送信履歴の取得
export function useTestHistory() {
  const [history, setHistory] = useState([])
  const sessionId = getTodaySessionId()

  useEffect(() => {
    const ref = collection(db, 'sessions', sessionId, 'testHistory')
    const q = query(ref, orderBy('sentAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setHistory(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [sessionId])

  return { history }
}
