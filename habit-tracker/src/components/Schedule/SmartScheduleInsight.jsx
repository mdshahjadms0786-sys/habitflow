import { motion } from 'framer-motion';

const SmartScheduleInsight = ({ optimalData, onApply }) => {
  if (!optimalData || optimalData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: '20px',
          backgroundColor: 'var(--surface)',
          borderRadius: '12px',
          border: '1px solid var(--border)'
        }}
      >
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
          Insights 📊
        </h3>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
          Complete some habits to see your optimal schedule times!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '20px',
        backgroundColor: 'var(--surface)',
        borderRadius: '12px',
        border: '1px solid var(--border)'
      }}
    >
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
        Based on your patterns:
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        {optimalData.slice(0, 5).map((opt) => (
          <div
            key={opt.habitId}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              backgroundColor: 'var(--bg)',
              borderRadius: '8px'
            }}
          >
            <span style={{ fontSize: '18px' }}>{opt.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', color: 'var(--text)', fontWeight: '500' }}>
                {opt.habitName}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Best at {opt.optimalHour}:00 {opt.confidence > 0 && `(${opt.confidence}% completion)`}
              </div>
            </div>
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onApply}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '14px',
          fontWeight: '600',
          backgroundColor: '#534AB7',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Apply Smart Schedule
      </motion.button>
    </motion.div>
  );
};

export default SmartScheduleInsight;