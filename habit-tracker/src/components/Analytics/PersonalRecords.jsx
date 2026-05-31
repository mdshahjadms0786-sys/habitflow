import { useMemo } from 'react';
import { useHabits } from '../../hooks/useHabits';

const PersonalRecords = () => {
  const { habits } = useHabits();

  const records = useMemo(() => {
    if (!habits || habits.length === 0) {
      return {
        longestStreak: 0,
        bestWeek: 0,
        mostInOneDay: 0,
        currentBestStreak: 0,
      };
    }

    let longestStreak = 0;
    let bestWeek = 0;
    let mostInOneDay = 0;
    let currentBestStreak = 0;

    habits.forEach(habit => {
      longestStreak = Math.max(longestStreak, habit.longestStreak || 0);
      currentBestStreak = Math.max(currentBestStreak, habit.currentStreak || 0);

      const dayCounts = {};
      Object.entries(habit.completionLog || {}).forEach(([date, completed]) => {
        if (completed) {
          dayCounts[date] = (dayCounts[date] || 0) + 1;
        }
      });

      Object.values(dayCounts).forEach(count => {
        mostInOneDay = Math.max(mostInOneDay, count);
      });

      const dates = Object.keys(habit.completionLog || {}).sort();
      for (let i = 0; i < dates.length - 6; i++) {
        const weekDates = dates.slice(i, i + 7);
        const weekCount = weekDates.filter(d => habit.completionLog?.[d]).length;
        bestWeek = Math.max(bestWeek, weekCount);
      }
    });

    return {
      longestStreak,
      bestWeek,
      mostInOneDay,
      currentBestStreak,
    };
  }, [habits]);

  return (
    <div style={{ backgroundColor: 'var(--surface)', borderRadius: '12px', padding: '20px' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
        Personal Records 🏆
      </h3>

      {(!habits || habits.length === 0) ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
          <p>Create habits to set personal records!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          <div style={{ backgroundColor: 'var(--bg)', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>🔥</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)' }}>{records.longestStreak}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Best Streak</div>
          </div>
          <div style={{ backgroundColor: 'var(--bg)', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>📅</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)' }}>{records.bestWeek}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Best Week</div>
          </div>
          <div style={{ backgroundColor: 'var(--bg)', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>⚡</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)' }}>{records.mostInOneDay}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Most in 1 Day</div>
          </div>
          <div style={{ backgroundColor: 'var(--bg)', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>💪</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)' }}>{records.currentBestStreak}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Current Streak</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalRecords;