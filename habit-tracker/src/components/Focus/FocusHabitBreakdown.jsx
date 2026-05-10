import { motion } from 'framer-motion';
import { getHabitFocusBreakdown, formatMinutes } from '../../utils/focusHistoryUtils';

const FocusHabitBreakdown = ({ sessions }) => {
  const breakdown = getHabitFocusBreakdown(sessions).slice(0, 5);
  const hasData = breakdown.length > 0;
  const maxMinutes = hasData ? breakdown[0].totalMinutes : 0;

  if (!hasData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid var(--border)'
        }}
      >
        <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
          Most Focused Habits 🏆
        </h3>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
          Start focusing on habits to see breakdown
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid var(--border)'
      }}
    >
      <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
        Most Focused Habits 🏆
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {breakdown.map((habit, index) => {
          const isFirst = index === 0;
          const barWidth = maxMinutes > 0 ? (habit.totalMinutes / maxMinutes) * 100 : 0;
          return (
            <div key={habit.habitId}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>{habit.habitIcon}</span>
                  <span style={{ fontSize: '13px', color: 'var(--text)', fontWeight: isFirst ? '600' : '400' }}>
                    {habit.habitName}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text)', fontWeight: '500' }}>
                    {formatMinutes(habit.totalMinutes)}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {habit.sessionCount} session{habit.sessionCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div style={{ height: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${barWidth}%`,
                    height: '100%',
                    backgroundColor: isFirst ? '#f59e0b' : '#534AB7',
                    borderRadius: '3px',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default FocusHabitBreakdown;