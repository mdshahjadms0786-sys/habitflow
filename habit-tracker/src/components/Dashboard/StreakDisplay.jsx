import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useHabits } from '../../hooks/useHabits';
import { useStreakInsurance, INSURANCE_CONFIG } from '../../utils/streakInsuranceUtils';
import { loadPoints, deductPoints, addPoints } from '../../utils/pointsUtils';
import { getConsistencyStats, getStreakHistory } from '../../utils/streakUtils';
import { getTodayISO, formatDate } from '../../utils/dateUtils';
import LeaderboardModal from '../Social/LeaderboardModal';
import toast from 'react-hot-toast';

const StreakDisplay = ({ compact = false }) => {
  const { habits } = useHabits();
  const currentPoints = loadPoints();
  const { insurance, remainingProtection, buyStreakInsurance } = useStreakInsurance(currentPoints);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const stats = useMemo(() => getConsistencyStats(habits || []), [habits]);
  const streakHistory = useMemo(() => getStreakHistory(habits || []), [habits]);

  const canRestore = remainingProtection > 0 && currentPoints >= 50 && stats.streakBroken;

  const handleRestoreStreak = () => {
    if (!stats.brokenStreakDate) return;

    const result = buyStreakInsurance();
    
    if (result.success) {
      deductPoints(50, 'Streak Restore');
      
      habits.forEach(habit => {
        if (habit.completionLog && stats.brokenStreakDate) {
          const brokenDate = stats.brokenStreakDate;
          let checkDate = new Date(brokenDate);
          checkDate.setDate(checkDate.getDate() + 1);
          
          while (checkDate <= new Date()) {
            const dateStr = formatDate(checkDate);
            if (!habit.completionLog[dateStr]) {
              habit.lastCompletedDate = dateStr;
            }
            checkDate.setDate(checkDate.getDate() + 1);
          }
        }
      });
      
      toast.success('🔥 Streak restored! Keep going!');
      setShowRestoreConfirm(false);
    }
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid var(--border)',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>🔥</span>
            <div>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
                Current Streak
              </p>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: 'var(--text)' }}>
                {stats.currentStreak} <span style={{ fontSize: '12px', fontWeight: '400' }}>days</span>
              </p>
            </div>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>
              Best: {stats.longestStreak} days
            </p>
            {stats.consistencyRate > 0 && (
              <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#22c55e' }}>
                {stats.consistencyRate}% consistent
              </p>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid var(--border)',
        marginBottom: '20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '40px' }}>🔥</span>
          <div>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
              Active Streak
            </p>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: stats.currentStreak > 7 ? '#f97316' : 'var(--text)' }}>
              {stats.currentStreak} <span style={{ fontSize: '14px', fontWeight: '400' }}>days</span>
            </p>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '16px',
          backgroundColor: 'var(--bg)',
          borderRadius: '12px',
          padding: '12px 16px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>Best</p>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#f59e0b' }}>
              {stats.longestStreak}
            </p>
          </div>
          <div style={{ width: '1px', backgroundColor: 'var(--border)' }} />
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>Consistency</p>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#22c55e' }}>
              {stats.consistencyRate}%
            </p>
          </div>
        </div>
      </div>

      {streakHistory.length > 1 && (
        <div style={{ 
          display: 'flex', 
          gap: '4px', 
          marginBottom: '16px',
          flexWrap: 'wrap',
        }}>
          {streakHistory.slice(-14).map((day, i) => {
            const isToday = day.date === getTodayISO();
            const isCompleted = day.completed;
            return (
              <div
                key={i}
                title={`${day.date}: ${isCompleted ? '✓' : '✗'}`}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                  backgroundColor: isCompleted ? '#22c55e' : isToday ? 'var(--border)' : '#fef2f2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  color: isCompleted ? '#fff' : 'var(--text-secondary)',
                  border: isToday ? '2px solid #3b82f6' : 'none',
                }}
              >
                {isCompleted ? '✓' : (isToday ? '○' : '')}
              </div>
            );
          })}
        </div>
      )}
 
       {!compact && (
         <motion.button
           whileHover={{ scale: 1.02 }}
           whileTap={{ scale: 0.98 }}
           onClick={() => setShowLeaderboard(true)}
           style={{
             width: '100%',
             marginTop: '12px',
             padding: '10px',
             fontSize: '12px',
             fontWeight: '600',
             color: '#fff',
             backgroundColor: '#8b5cf6',
             border: 'none',
             borderRadius: '8px',
             cursor: 'pointer',
           }}
         >
           🏆 View Leaderboard
         </motion.button>
       )}

       <LeaderboardModal
         isOpen={showLeaderboard}
         onClose={() => setShowLeaderboard(false)}
         currentStreak={stats.currentStreak}
       />

       {stats.isFirstTime && (
        <div style={{
          backgroundColor: '#3b82f610',
          borderRadius: '8px',
          padding: '12px',
          border: '1px solid #3b82f620',
        }}>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text)' }}>
            🎯 <strong>Start your streak!</strong> Complete at least one habit daily to build consistency.
          </p>
        </div>
      )}

      {stats.streakBroken && !showRestoreConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            backgroundColor: '#fef2f2',
            borderRadius: '8px',
            padding: '12px',
            border: '1px solid #fecaca',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              {stats.currentStreak > 0 ? (
                <p style={{ margin: 0, fontSize: '13px', color: '#22c55e' }}>
                  🔥 {stats.currentStreak} day streak — keep going!
                </p>
              ) : (
                <p style={{ margin: 0, fontSize: '13px', color: '#dc2626' }}>
                  ⚠️ Streak broken! You had a {stats.daysSinceBreak} day streak
                </p>
              )}
              <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#991b1b' }}>
                Use Streak Insurance to restore (50 pts + 1 protection)
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowRestoreConfirm(true)}
              disabled={!canRestore}
              style={{
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#fff',
                backgroundColor: canRestore ? '#22c55e' : 'var(--border)',
                border: 'none',
                borderRadius: '6px',
                cursor: canRestore ? 'pointer' : 'not-allowed',
              }}
            >
              🛡️ Restore
            </motion.button>
          </div>
        </motion.div>
      )}

      {showRestoreConfirm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            backgroundColor: '#22c55e10',
            borderRadius: '8px',
            padding: '16px',
            border: '1px solid #22c55e30',
          }}
        >
          <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--text)' }}>
            🔄 Confirm streak restore?
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRestoreStreak}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#fff',
                backgroundColor: '#22c55e',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              ✅ Yes (-50 pts, -1 protection)
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowRestoreConfirm(false)}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text)',
                backgroundColor: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      )}

      <div style={{ 
        display: 'flex', 
        gap: '16px',
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: '1px solid var(--border)',
      }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-secondary)' }}>
            Streak Insurance
          </p>
          <p style={{ margin: '2px 0 0 0', fontSize: '14px', fontWeight: '600', color: remainingProtection > 0 ? '#22c55e' : 'var(--text)' }}>
            🛡️ {remainingProtection} / {INSURANCE_CONFIG.maxProtection} available
          </p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-secondary)' }}>
            Points
          </p>
          <p style={{ margin: '2px 0 0 0', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
            ⭐ {currentPoints}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default StreakDisplay;