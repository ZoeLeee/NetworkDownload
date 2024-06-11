import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false, 
    minify: false, 
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
      },
      output: {
        entryFileNames: (info) => {
          return "assets/[name].js"
        }, // 输出文件名配置
  
      }
    },
  },
  plugins: [react()],
})


