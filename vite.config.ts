import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        background: resolve(__dirname, 'src/background.ts'),
      },
      output: {
        entryFileNames: (info) => {
          if (info.name === 'background') {
            return 'background.js'
          }
          return "assets/[name]-[hash].js"
        }, // 输出文件名配置
      }
    },
  },
  plugins: [preact()],
})
