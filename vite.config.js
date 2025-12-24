import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 如果部署到 GitHub Pages，仓库名不是 username.github.io，需要设置 base
// 例如：仓库名是 204tom，则 base 应该是 '/204tom/'
const base = process.env.NODE_ENV === 'production' ? '/204tom/' : '/'

export default defineConfig({
  base: base,
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})

