import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      injectRegister: null, // We manually inject in AdminDashboard
      includeAssets: ['favicon.ico', 'logo.jpg', 'apple-touch-icon.png'],
      manifest: false, // Disable auto-inject into index.html
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg}']
      }
    })
  ],
})
