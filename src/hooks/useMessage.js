import { useState, useEffect } from 'react'
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore'
import { db, getTodaySessionId } from '../firebase'

// 追走車→風見係へのメッセージ送受信
export function useMessage() {
  const [latestMessage, setLatestMessage] = useState(null)
  const sessionId = getTodaySessionId()
  const msgRef = doc(db, 'sessions', sessionId, 'meta', 'message')

  useEffect(() => {
    const unsub = onSnapshot(msgRef, (snap) => {
      if (snap.exists()) setLatestMessage(snap.data())
      else setLatestMessage(null)
    })
    return unsub
  }, [sessionId])

  async function sendMessage(text) {
    if (!text.trim()) return
    await setDoc(msgRef, { text: text.trim(), sentAt: serverTimestamp() })
  }

  return { latestMessage, sendMessage }
}
