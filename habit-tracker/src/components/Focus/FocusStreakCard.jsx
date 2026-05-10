import { motion } from 'framer-motion';
import { getFocusStreak, getLast7DaysDots, formatMinutes } from '../../utils/focusHistoryUtils';

const FocusStreakCard = ({ sessions }) => {
  const streak = getFocusStreak(sessions);
  const last7Days = getLast7DaysDots(sessions);
  
  const getMotivationalMessage = () => {
    if (streak === 0) return "Begin your journey 🌱";
    if (streak <= 3) return "Great start! Keep going 💪";
    if (streak <= 7) return "Building momentum! 🔥";
    return "You're on fire! 🚀";
  };

  const getBestStreak = () => {
    if (!sessions || sessions.length === 0) return 0;
    const dates = [...new Set(sessions.map(s => s.date))].sort();
    let best = 0;
    let current = 0;
    let prevDate = null;
    
    dates.forEach(date => {
      const d = new Date(date);
      if (prevDate) {
        const diff = Math.floor((d - new Date(prevDate)) / (1000 * 60 * 60 * 24));
        if (diff === 1) {
          current++;
        } else {
          current = 1;
        }
      } else {
        current = 1;
      }
      best = Math.max(best, current);
      prevDate = date;
    });
    
    return best;
  };

  const bestStreak = getBestStreak();

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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        {streak > 0 ? (
          <span style={{ fontSize: '32px' }}>🔥</span>
        ) : (
          <span style={{ fontSize: '32px' }}>🌱</span>
        )}
        
        <span style={{ fontSize: '36px', fontWeight: '700', color: streak > 0 ? '#f97316' : 'var(--text)', marginTop: '4px' }}>
          {streak}
        </span>
        
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          day focus streak
        </span>
        
        <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
          Best: {bestStreak} days
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
        {last7Days.map((day, index) => (
          <div
            key={index}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: day.hasSession ? '#534AB7' : 'var(--bg-secondary)',
              border: '1px solid',
              borderColor: day.hasSession ? '#534AB7' : 'var(--border)'
            }}
            title={day.date}
          />
        ))}
      </div>

      <p style={{ margin: '12px 0 0 0', fontSize: '13px', color: 'var(--text)', textAlign: 'center', fontWeight: '500' }}>
        {getMotivationalMessage()}
      </p>
    </motion.div>
  );
};

export default FocusStreakCard;