export const SkeletonLine = ({ width = '100%', height = '16px' }) => (
  <div style={{
    width, height,
    background: 'var(--bg-secondary)',
    borderRadius: '4px',
    animation: 'skeleton-pulse 1.5s ease-in-out infinite'
  }} />
)

export const SkeletonCard = ({ lines = 3 }) => (
  <div style={{
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  }}>
    {Array(lines).fill(0).map((_, i) => (
      <SkeletonLine key={i} width={i === 0 ? '60%' : i === lines-1 ? '40%' : '100%'} />
    ))}
  </div>
)

export const SkeletonHabitCard = () => (
  <div style={{
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  }}>
    <div style={{
      width: '28px', height: '28px',
      borderRadius: '50%',
      background: 'var(--bg-secondary)',
      animation: 'skeleton-pulse 1.5s ease-in-out infinite'
    }} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <SkeletonLine width="60%" height="16px" />
      <SkeletonLine width="30%" height="12px" />
    </div>
  </div>
)