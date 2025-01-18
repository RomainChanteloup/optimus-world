import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    server: {
      port: 3000,
      host: true
    },
    base: command === 'build' ? '/optimus-world/' : '/'
  }

  return config
})