import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from "@sentry/react";
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { HabitProvider } from './context/HabitContext'
import { PlanProvider } from './context/PlanContext'
import { PointsProvider } from './context/PointsContext'
import { MoodProvider } from './context/MoodContext'
import { TimerProvider } from './context/TimerContext'
import ErrorBoundary from './components/UI/ErrorBoundary'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  sendDefaultPii: true,
  environment: import.meta.env.VITE_APP_ENV || "development",
  integrations: [],
  tracesSampleRate: 0.1,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <PlanProvider>
          <HabitProvider>
            <PointsProvider>
              <MoodProvider>
                <TimerProvider>
                  <App />
                </TimerProvider>
              </MoodProvider>
            </PointsProvider>
          </HabitProvider>
        </PlanProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
