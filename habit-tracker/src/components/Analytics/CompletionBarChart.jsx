import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { subDays, format } from 'date-fns';

export const CompletionBarChart = ({ habits }) => {
  const data = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayName = format(date, 'EEE');

      const completedCount = habits.filter(
        (h) => h.completionLog?.[dateStr]
      ).length;
      const totalCount = habits.length;
      const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      return {
        name: dayName,
        date: dateStr,
        percentage,
        completed: completedCount,
        total: totalCount,
      };
    });

    return last7Days;
  }, [habits]);

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

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
        Last 7 Days Completion
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? '#334155' : '#e2e8f0'}
          />
          <XAxis
            dataKey="name"
            stroke={isDark ? '#94a3b8' : '#64748b'}
            fontSize={12}
          />
          <YAxis
            stroke={isDark ? '#94a3b8' : '#64748b'}
            fontSize={12}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value, name) => {
              if (name === 'percentage') return [`${value}%`, 'Completion'];
              return [value, name];
            }}
          />
          <Bar
            dataKey="percentage"
            fill="var(--primary)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CompletionBarChart;
