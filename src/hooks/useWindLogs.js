import { useState, useEffect } from 'react'
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import { db, getTodaySessionId } from '../firebase'

// 風況ログの読み書き
export function useWindLogs() {
  const [logs, setLogs] = useState([])
  const sessionId = getTodaySessionId()
  const logsRef = collection(db, 'sessions', sessionId, 'windLogs')

  useEffect(() => {
    const q = query(logsRef, orderBy('timestamp', 'asc'))
    const unsub = onSnapshot(q, (snap) => {
      setLogs(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [sessionId])

  async function addWindLog({ runNumber, location, windSpeed, windDirection }) {
    await addDoc(logsRef, {
      runNumber,
      location,
      windSpeed: Number(windSpeed),
      windDirection,
      timestamp: serverTimestamp(),
    })
  }

  // 各地点の最新値を返す
  function getLatestByLocation() {
    const map = {}
    for (const log of logs) {
      map[log.location] = log
    }
    return map
  }

  return { logs, addWindLog, getLatestByLocation }
}
