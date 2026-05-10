import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useHabits } from '../../hooks/useHabits';

const TimeOfDayChart = () => {
  const { habits } = useHabits();

  const hourlyData = useMemo(() => {
    const hourCounts = new Array(24).fill(0);

    habits.forEach(habit => {
      Object.entries(habit.completionLog || {}).forEach(([date, completion]) => {
        if (completion && completion.completedAt) {
          const hour = parseInt(completion.completedAt.split(':')[0], 10);
          if (hour >= 0 && hour < 24) {
            hourCounts[hour]++;
          }
        }
      });
    });

    const maxCount = Math.max(...hourCounts);
    const peakHour = hourCounts.indexOf(maxCount);

    return hourCounts.map((count, hour) => ({
      hour: hour === 0 ? '12AM' : hour < 12 ? `${hour}AM` : hour === 12 ? '12PM' : `${hour - 12}PM`,
      hour24: hour,
      count,
      isPeak: count === maxCount && maxCount > 0,
    }));
  }, [habits]);

  const peakHourLabel = useMemo(() => {
    const peak = hourlyData.find(d => d.isPeak);
    return peak ? `${peak.hour24}:00` : 'N/A';
  }, [hourlyData]);

  return (
    <div style={{ backgroundColor: 'var(--surface)', borderRadius: '12px', padding: '20px' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
        Your Most Productive Hours ⏰
      </h3>

      {hourlyData.every(d => d.count === 0) ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏰</div>
          <p>No completion times tracked yet</p>
          <p style={{ fontSize: '12px' }}>Complete habits to see your productive hours!</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={hourlyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
                tickLine={false}
                axisLine={false}
                interval={2}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {hourlyData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.isPeak ? '#8b5cf6' : '#6366f1'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Peak hour: <strong style={{ color: '#8b5cf6' }}>{peakHourLabel}</strong>
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default TimeOfDayChart;