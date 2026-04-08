import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // SPAルーティング（/driver, /crew）のためにフォールバックを有効化
  server: {
    historyApiFallback: true,
  },
})
