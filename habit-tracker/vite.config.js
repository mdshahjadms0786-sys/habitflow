import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'HabitFlow SaaS',
        short_name: 'HabitFlow',
        description: 'Track habits, stay consistent, and level up your life!',
        theme_color: '#1e1e2d',
        background_color: '#12121c',
        display: 'standalone',
        icons: [
          {
            src: './favicon.ico',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: './favicon.ico',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  base: '/',
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-animation': ['framer-motion'],
          'vendor-charts': ['recharts'],
          'vendor-utils': ['date-fns', 'uuid'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'pages-elite': [
            './src/pages/AICoachingPage',
            './src/pages/DreamDiaryPage',
            './src/pages/EliteDashboardPage',
            './src/pages/AIHabitArchitectPage',
            './src/pages/LifeOSDashboardPage',
            './src/pages/PredictiveAIPage',
            './src/pages/SmartInterventionPage',
            './src/pages/MonthlyBehaviorReportPage',
            './src/pages/HabitROIDashboardPage'
          ],
          'pages-analytics': [
            './src/pages/Analytics',
            './src/pages/FocusHistoryPage',
            './src/pages/LifeScorePage',
            './src/pages/LifeAreasPage'
          ]
        }
      }
    }
  }
})