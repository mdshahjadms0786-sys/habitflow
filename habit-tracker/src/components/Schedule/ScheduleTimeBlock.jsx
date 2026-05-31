import { motion } from 'framer-motion';

const ScheduleTimeBlock = ({ time, habit, isCompleted, isCurrent, onComplete }) => {
  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes || '00'} ${ampm}`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        height: '56px',
        padding: '0 16px',
        backgroundColor: isCurrent ? '#EEEDFE' : isCompleted ? '#dcfce7' : 'var(--surface)',
        borderRadius: '8px',
        border: isCurrent ? '2px solid #534AB7' : '1px solid var(--border)',
        marginBottom: '8px',
        cursor: 'pointer'
      }}
    >
      <div style={{ fontSize: '14px', color: isCompleted ? '#16a34a' : 'var(--text-secondary)', minWidth: '70px' }}>
        {formatTime(time)}
      </div>
      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '18px' }}>{habit.icon}</span>
        <span style={{ 
          fontSize: '14px', 
          color: 'var(--text)',
          textDecoration: isCompleted ? 'line-through' : 'none'
        }}>
          {habit.name}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          ~{habit.duration || 30} min
        </span>
        {isCurrent && (
          <span style={{ 
            padding: '2px 8px', 
            backgroundColor: '#534AB7', 
            color: '#fff', 
            borderRadius: '10px',
            fontSize: '10px',
            fontWeight: '600'
          }}>
            Now
          </span>
        )}
        {isCompleted && (
          <span style={{ color: '#16a34a', fontSize: '16px' }}>✓</span>
        )}
        {!isCompleted && onComplete && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onComplete}
            style={{
              padding: '4px 12px',
              fontSize: '12px',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Done
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default ScheduleTimeBlock;