import { useState, useMemo } from 'react';
import { useHabits } from '../../hooks/useHabits';

const HabitComparison = () => {
  const { habits } = useHabits();
  const [habit1Id, setHabit1Id] = useState('');
  const [habit2Id, setHabit2Id] = useState('');

  const habit1 = habits.find(h => h.id === habit1Id);
  const habit2 = habits.find(h => h.id === habit2Id);

  const stats1 = useMemo(() => {
    if (!habit1) return null;

    const completionValues = Object.values(habit1.completionLog || {});
    const completedCount = completionValues.filter(c => c).length;
    const currentStreak = habit1.currentStreak || 0;
    const longestStreak = habit1.longestStreak || 0;

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });
    const last7Completed = last7Days.filter(d => habit1.completionLog?.[d]).length;

    return { completedCount, currentStreak, longestStreak, last7Completed };
  }, [habit1]);

  const stats2 = useMemo(() => {
    if (!habit2) return null;

    const completionValues = Object.values(habit2.completionLog || {});
    const completedCount = completionValues.filter(c => c).length;
    const currentStreak = habit2.currentStreak || 0;
    const longestStreak = habit2.longestStreak || 0;

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });
    const last7Completed = last7Days.filter(d => habit2.completionLog?.[d]).length;

    return { completedCount, currentStreak, longestStreak, last7Completed };
  }, [habit2]);

  const maxValue = useMemo(() => {
    const values = [
      stats1?.completedCount || 0,
      stats2?.completedCount || 0,
      stats1?.longestStreak || 0,
      stats2?.longestStreak || 0,
    ];
    return Math.max(...values) || 1;
  }, [stats1, stats2]);

  if (habits.length < 2) {
    return (
      <div style={{ backgroundColor: 'var(--surface)', borderRadius: '12px', padding: '20px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
          Compare Habits 🔄
        </h3>
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔄</div>
          <p>Need at least 2 habits to compare</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--surface)', borderRadius: '12px', padding: '20px' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
        Compare Habits 🔄
      </h3>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <select
          value={habit1Id}
          onChange={(e) => setHabit1Id(e.target.value)}
          style={{
            flex: 1,
            padding: '12px',
            fontSize: '14px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg)',
            color: 'var(--text)',
          }}
        >
          <option value="">Select habit 1</option>
          {habits.map(h => (
            <option key={h.id} value={h.id} disabled={h.id === habit2Id}>
              {h.icon} {h.name}
            </option>
          ))}
        </select>
        <select
          value={habit2Id}
          onChange={(e) => setHabit2Id(e.target.value)}
          style={{
            flex: 1,
            padding: '12px',
            fontSize: '14px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg)',
            color: 'var(--text)',
          }}
        >
          <option value="">Select habit 2</option>
          {habits.map(h => (
            <option key={h.id} value={h.id} disabled={h.id === habit1Id}>
              {h.icon} {h.name}
            </option>
          ))}
        </select>
      </div>

      {(!habit1 || !habit2) ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          <p>Select two habits to compare</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { label: 'Total Completions', v1: stats1.completedCount, v2: stats2.completedCount },
            { label: 'Current Streak', v1: stats1.currentStreak, v2: stats2.currentStreak },
            { label: 'Best Streak', v1: stats1.longestStreak, v2: stats2.longestStreak },
            { label: 'Last 7 Days', v1: stats1.last7Completed, v2: stats2.last7Completed },
          ].map(stat => (
            <div key={stat.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: 'var(--text)' }}>{stat.label}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', width: '60px', color: 'var(--text-secondary)' }}>
                    {habit1?.icon} {stat.v1}
                  </span>
                  <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--border)', borderRadius: '4px' }}>
                    <div
                      style={{
                        width: `${(stat.v1 / maxValue) * 100}%`,
                        height: '100%',
                        backgroundColor: '#6366f1',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', width: '60px', color: 'var(--text-secondary)', textAlign: 'right' }}>
                    {stat.v2} {habit2?.icon}
                  </span>
                  <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--border)', borderRadius: '4px' }}>
                    <div
                      style={{
                        width: `${(stat.v2 / maxValue) * 100}%`,
                        height: '100%',
                        backgroundColor: '#8b5cf6',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HabitComparison;