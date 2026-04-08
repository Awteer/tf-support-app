import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DriverPage } from './pages/DriverPage'
import { CrewPage } from './pages/CrewPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/driver" element={<DriverPage />} />
        <Route path="/crew" element={<CrewPage />} />
        {/* ルートへのアクセスはドライバーページへ */}
        <Route path="/" element={<Navigate to="/driver" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center gap-4">
      <p className="text-2xl font-bold">ページが見つかりません</p>
      <div className="flex gap-4">
        <a href="/driver" className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500">
          追走車ページ (/driver)
        </a>
        <a href="/crew" className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-500">
          風見係ページ (/crew)
        </a>
      </div>
    </div>
  )
}
