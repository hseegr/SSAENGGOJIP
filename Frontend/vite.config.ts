// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // ← 이거 추가!

const viteConfig = defineConfig({
  base: '/',
  server: {
    port: 3000,
  },
  preview: {
    port: 3010,
  },
  css: {
    devSourcemap: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // ✅ alias 설정 추가
    },
  },
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
})

export default viteConfig
