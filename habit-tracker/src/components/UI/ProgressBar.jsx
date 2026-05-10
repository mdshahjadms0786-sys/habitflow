import { motion } from 'framer-motion';

export const ProgressBar = ({ progress, color = '#6366f1', height = '8px', showLabel = false }) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '4px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
          }}
        >
          <span>Progress</span>
          <span>{clampedProgress}%</span>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height,
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            height: '100%',
            backgroundColor: color,
            borderRadius: '4px',
          }}
        />
      </div>
    </div>
  );
};

export const WeeklyProgressBar = ({ completions, color = '#6366f1' }) => {
  const completedCount = completions.filter((c) => c.completed).length;
  const progress = (completedCount / 7) * 100;

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '4px',
          fontSize: '12px',
          color: 'var(--text-secondary)',
        }}
      >
        <span>This Week</span>
        <span>{completedCount}/7 days</span>
      </div>
      <div
        style={{
          display: 'flex',
          gap: '2px',
          height: '8px',
        }}
      >
        {completions.map((day, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            style={{
              flex: 1,
              backgroundColor: day.completed ? color : 'var(--bg-secondary)',
              borderRadius: '2px',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
