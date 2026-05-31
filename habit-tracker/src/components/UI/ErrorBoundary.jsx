import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          padding: '2rem',
          textAlign: 'center',
          background: 'var(--bg)',
          color: 'var(--text)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>😔</div>
          <h2 style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--text)' }}>
            Oops! Something went wrong
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '300px' }}>
            Don't worry — your data is safe. 
            Try reloading the app.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: '#534AB7',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '15px',
              cursor: 'pointer',
              marginBottom: '12px'
            }}
          >
            🔄 Reload App
          </button>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              background: 'transparent',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary;