import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { subDays, format } from 'date-fns';

export const StreakLineChart = ({ habits }) => {
  const data = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayName = format(date, 'MMM d');

      const dayData = { date: dateStr, name: dayName };

      habits.forEach((habit) => {
        if (habit.completionLog?.[dateStr]) {
          dayData[habit.id] = (dayData[habit.id] || 0) + 1;
        }
      });

      return dayData;
    });

    return last30Days;
  }, [habits]);

  const habitColors = useMemo(() => {
    const colors = {};
    habits.forEach((habit) => {
      colors[habit.id] = habit.color || '#6366f1';
    });
    return colors;
  }, [habits]);

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  if (habits.length === 0) {
    return (
      <div
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '16px',
          height: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
        }}
      >
        No habits to display
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '16px',
        height: '300px',
      }}
    >
      <h3
        style={{
          margin: '0 0 16px 0',
          fontSize: '14px',
          fontWeight: '600',
          color: 'var(--text)',
        }}
      >
        30-Day Completion History
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? '#334155' : '#e2e8f0'}
          />
          <XAxis
            dataKey="name"
            stroke={isDark ? '#94a3b8' : '#64748b'}
            fontSize={10}
            interval={4}
          />
          <YAxis
            stroke={isDark ? '#94a3b8' : '#64748b'}
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          {habits.slice(0, 5).map((habit) => (
            <Line
              key={habit.id}
              type="monotone"
              dataKey={habit.id}
              name={habit.name}
              stroke={habitColors[habit.id]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StreakLineChart;
