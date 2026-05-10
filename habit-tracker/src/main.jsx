import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { HabitProvider } from './context/HabitContext'
import { MoodProvider } from './context/MoodContext'
import { TimerProvider } from './context/TimerContext'
import ErrorBoundary from './components/UI/ErrorBoundary'
import { applyTheme, getCurrentTheme } from './utils/themeUtils'
import './index.css'

applyTheme(getCurrentTheme());

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <AuthProvider>
      <HabitProvider>
        <MoodProvider>
          <TimerProvider>
            <App />
          </TimerProvider>
        </MoodProvider>
      </HabitProvider>
    </AuthProvider>
  </ErrorBoundary>
)

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('SW registered'))
      .catch(err => console.log('SW failed:', err))
  })
} else if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations()
    .then((registrations) => registrations.forEach((registration) => registration.unregister()))
    .catch(err => console.log('SW unregister failed:', err))

  caches.keys()
    .then((cacheNames) => cacheNames.forEach((cacheName) => caches.delete(cacheName)))
    .catch(err => console.log('Cache cleanup failed:', err))
}
