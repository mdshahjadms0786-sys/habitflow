export const ERROR_TYPES = {
  STORAGE_FULL: 'storage_full',
  NETWORK_ERROR: 'network_error',
  PARSE_ERROR: 'parse_error',
  API_ERROR: 'api_error',
  UNKNOWN: 'unknown'
}

export const ERROR_MESSAGES = {
  storage_full: 'Storage is full. Please export and clear some data.',
  network_error: 'Network error. Check your connection.',
  parse_error: 'Data error. Some data may be corrupted.',
  api_error: 'Service unavailable. Try again later.',
  unknown: 'Something went wrong. Please try again.'
}

export const handleError = (error, type = 'unknown') => {
  console.error(`[HabitFlow Error] ${type}:`, error)
  return {
    type,
    message: ERROR_MESSAGES[type] || ERROR_MESSAGES.unknown,
    timestamp: new Date().toISOString(),
    original: error?.message || String(error)
  }
}

export const safeLocalStorage = {
  get: (key, fallback = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : fallback
    } catch(e) {
      handleError(e, 'parse_error')
      return fallback
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch(e) {
      if (e.name === 'QuotaExceededError') {
        handleError(e, 'storage_full')
        return false
      }
      handleError(e, 'unknown')
      return false
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch(e) {
      handleError(e, 'unknown')
      return false
    }
  }
}

export const withErrorHandling = async (fn, errorType = 'unknown') => {
  try {
    return await fn()
  } catch(e) {
    return { error: handleError(e, errorType), data: null }
  }
}