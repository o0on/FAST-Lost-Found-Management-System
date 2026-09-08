import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function getEnvDefines() {
  const envPath = path.resolve(process.cwd(), '.env')
  const defines = {}
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [k, ...v] = trimmed.split('=')
        if (k && k.trim().startsWith('VITE_')) {
          const val = v.join('=').trim()
          defines[`import.meta.env.${k.trim()}`] = JSON.stringify(val)
        }
      }
    }
  }
  return defines
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  define: getEnvDefines(),
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})

