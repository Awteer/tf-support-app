import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Firebaseプロジェクト設定（.envファイルに値を設定してください）
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
// データベースIDが 'default'（括弧なし）のため明示的に指定
export const db = getFirestore(app, 'default')

// 本日の日付をセッションIDとして使用（日次リセット）
export function getTodaySessionId() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
