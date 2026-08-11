import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The six source CSVs in src/data are imported with `?raw` and parsed at
// runtime, so they remain untouched read-only inputs bundled at build time.
export default defineConfig({
  plugins: [react()],
})
