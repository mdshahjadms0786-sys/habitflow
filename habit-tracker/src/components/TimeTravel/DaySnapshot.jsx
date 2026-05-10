import { motion } from 'framer-motion';

const DaySnapshot = ({ snapshot, onClose, style }) => {
  if (!snapshot) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '500px',
        width: '100%',
        ...style
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: 'var(--text)' }}>
          {snapshot.dayName}
        </h2>
        <motion.button whileHover={{ scale: 1.1 }} onClick={onClose} style={{ padding: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '20px' }}>
          ✕
        </motion.button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <div style={{ position: 'relative', width: '120px', height: '120px' }}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border)" strokeWidth="8" />
            <circle cx="60" cy="60" r="54" fill="none" stroke="#534AB7" strokeWidth="8" strokeDasharray={`${(snapshot.completionRate / 100) * 339.3} 339.3`} strokeLinecap="round" transform="rotate(-90 60 60)" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '24px', fontWeight: '700' }}>{snapshot.completionRate}%</span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>complete</span>
          </div>
        </div>
      </div>

      <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--text)', textAlign: 'center' }}>
        {snapshot.narrative}
      </p>

      {snapshot.completedHabits.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#22c55e', marginBottom: '8px' }}>
            ✅ Completed ({snapshot.completedHabits.length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {snapshot.completedHabits.map(h => (
              <span key={h.id} style={{ padding: '4px 10px', backgroundColor: '#dcfce7', borderRadius: '12px', fontSize: '12px' }}>
                {h.icon} {h.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {snapshot.missedHabits.length > 0 && (
        <div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#dc2626', marginBottom: '8px' }}>
            ❌ Missed ({snapshot.missedHabits.length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {snapshot.missedHabits.map(h => (
              <span key={h.id} style={{ padding: '4px 10px', backgroundColor: '#fef2f2', borderRadius: '12px', fontSize: '12px' }}>
                {h.icon} {h.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {snapshot.mood && (
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'var(--bg)', borderRadius: '8px', textAlign: 'center' }}>
          <span style={{ fontSize: '24px' }}>{snapshot.mood.emoji}</span>
          <span style={{ marginLeft: '8px', fontSize: '14px' }}>{snapshot.mood.label}</span>
        </div>
      )}

      <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
        +{snapshot.points} points earned that day
      </div>
    </motion.div>
  );
};

export default DaySnapshot;