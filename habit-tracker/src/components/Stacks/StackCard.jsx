import { motion } from 'framer-motion';

const StackCard = ({ stack, habits, onEdit, onDelete, onComplete }) => {
  const stackHabits = habits.filter(h => stack.habitIds.includes(h.id));
  const today = new Date().toISOString().split('T')[0];
  const todayCompleted = stackHabits.filter(h => h.completionLog?.[today]?.completed).length;
  const totalHabits = stackHabits.length;
  const percentage = totalHabits > 0 ? Math.round((todayCompleted / totalHabits) * 100) : 0;
  
  const typeLabels = {
    morning: '🌅 Morning',
    evening: '🌙 Evening',
    workout: '💪 Workout',
    work: '💻 Work',
    custom: '📋 Custom'
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '16px',
        border: `4px solid ${stack.color}`,
        overflow: 'hidden'
      }}
    >
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ fontSize: '32px' }}>{stack.icon}</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>{stack.name}</h3>
            <span style={{ fontSize: '12px', color: stack.color, fontWeight: '500' }}>
              {typeLabels[stack.type] || stack.type}
            </span>
          </div>
          <button
            onClick={onEdit}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', opacity: 0.5 }}
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', opacity: 0.5 }}
          >
            🗑️
          </button>
        </div>
        
        {stack.description && (
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            {stack.description}
          </p>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {stackHabits.map((habit, idx) => {
            const isCompleted = habit.completionLog?.[today]?.completed;
            return (
              <div
                key={habit.id || idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  backgroundColor: 'var(--bg)',
                  borderRadius: '8px'
                }}
              >
                <span style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  backgroundColor: isCompleted ? '#22c55e' : 'var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  color: '#fff'
                }}>
                  {idx + 1}
                </span>
                <span style={{ fontSize: '20px' }}>{habit.icon || '✅'}</span>
                <span style={{ flex: 1, fontSize: '14px', fontWeight: '500' }}>
                  {typeof habit === 'string' ? habit : habit.name}
                </span>
                <span style={{ fontSize: isCompleted ? '18px' : '18px', opacity: isCompleted ? 1 : 0.3 }}>
                  {isCompleted ? '✅' : '⭕'}
                </span>
              </div>
            );
          })}
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px' }}>{todayCompleted}/{totalHabits} complete</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: stack.color }}>{percentage}%</span>
          </div>
          <div style={{ height: '8px', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: stack.color, borderRadius: '4px' }} />
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            🔥 {stack.currentStreak || 0} days streak
          </div>
          {percentage < 100 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
              style={{
                padding: '10px 20px',
                backgroundColor: stack.color,
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Complete Stack
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StackCard;