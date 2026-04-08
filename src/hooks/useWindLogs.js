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

  // 指定走行番号の各地点最新値を返す（省略時は全走行の最新値）
  function getLatestByLocation(runNumber) {
    const filtered = runNumber != null
      ? logs.filter((l) => l.runNumber === runNumber)
      : logs
    const map = {}
    for (const log of filtered) {
      map[log.location] = log
    }
    return map
  }

  return { logs, addWindLog, getLatestByLocation }
}
