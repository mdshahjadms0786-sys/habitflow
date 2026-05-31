import * as Sentry from '@sentry/react'

const logger = {
  info: (msg, data) => {
    if (import.meta.env.DEV) console.log('[INFO]', msg, data)
  },
  error: (msg, error) => {
    console.error('[ERROR]', msg, error)
    if (import.meta.env.PROD) {
      Sentry.captureException(error, { extra: { msg } })
    }
  },
  warn: (msg, data) => {
    if (import.meta.env.DEV) console.warn('[WARN]', msg, data)
  },
}

export default logger
