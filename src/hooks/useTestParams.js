import { useState, useEffect } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

export const TEST_TYPES = [
  '走行試験',
  '早めの走行試験',
  'ジャンプ試験',
  '短距離試験',
  '中距離試験',
  '長距離試験',
]

// デフォルトパラメータ
const defaultParams = {
  propellerRpm: '',
  aircraftSpeed: '',
  notes: '',
}

// 試験パラメータ（シーズンを通じて永続化）
export function useTestParams() {
  const [params, setParams] = useState(
    () => Object.fromEntries(TEST_TYPES.map((t) => [t, { ...defaultParams }]))
  )

  useEffect(() => {
    const unsubs = TEST_TYPES.map((testType) => {
      const ref = doc(db, 'testParams', testType)
      return onSnapshot(ref, (snap) => {
        if (snap.exists()) {
          setParams((prev) => ({ ...prev, [testType]: snap.data() }))
        }
      })
    })
    return () => unsubs.forEach((u) => u())
  }, [])

  async function updateParams(testType, newParams) {
    const ref = doc(db, 'testParams', testType)
    await setDoc(ref, newParams, { merge: true })
  }

  return { params, updateParams }
}
