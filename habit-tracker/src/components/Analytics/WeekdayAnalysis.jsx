import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useHabits } from '../../hooks/useHabits';

const WeekdayAnalysis = () => {
  const { habits } = useHabits();

  const weekdayData = useMemo(() => {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dayStats = dayNames.map(day => ({ day, total: 0, completed: 0 }));

    habits.forEach(habit => {
      Object.entries(habit.completionLog || {}).forEach(([date, completed]) => {
        if (completed) {
          const dayIndex = new Date(date).getDay();
          const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
          dayStats[adjustedIndex].completed++;
        }
        dayStats.forEach((_, i) => dayStats[i].total++);
      });
    });

    return dayStats.map(d => ({
      ...d,
      percentage: d.total > 0 ? Math.round((d.completed / d.total) * 100) : 0,
    }));
  }, [habits]);

  const bestDay = useMemo(() => {
    const max = Math.max(...weekdayData.map(d => d.percentage));
    return weekdayData.find(d => d.percentage === max)?.day || null;
  }, [weekdayData]);

  const worstDay = useMemo(() => {
    const min = Math.min(...weekdayData.map(d => d.percentage));
    return weekdayData.find(d => d.percentage === min)?.day || null;
  }, [weekdayData]);

  return (
    <div style={{ backgroundColor: 'var(--surface)', borderRadius: '12px', padding: '20px' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
        Best Days of Week 📅
      </h3>

      {weekdayData.every(d => d.total === 0) ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
          <p>No data yet</p>
          <p style={{ fontSize: '12px' }}>Start tracking to see your best days!</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekdayData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
                tickLine={false}
                axisLine={false}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value) => [`${value}%`, 'Completion']}
              />
              <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                {weekdayData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      entry.day === bestDay
                        ? '#22c55e'
                        : entry.day === worstDay
                        ? '#ef4444'
                        : '#6366f1'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '12px', fontSize: '12px' }}>
            <span style={{ color: '#22c55e' }}>Best: {bestDay}</span>
            <span style={{ color: '#ef4444' }}>Worst: {worstDay}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default WeekdayAnalysis;