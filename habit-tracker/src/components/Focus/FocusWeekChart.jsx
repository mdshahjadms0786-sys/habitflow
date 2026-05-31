import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getWeekFocusStats, formatMinutes } from '../../utils/focusHistoryUtils';
import { format } from 'date-fns';

const FocusWeekChart = ({ sessions }) => {
  const weekStats = getWeekFocusStats(sessions);
  const today = format(new Date(), 'yyyy-MM-dd');
  const hasData = weekStats.some(d => d.totalMinutes > 0);

  const data = weekStats.map(day => ({
    ...day,
    minutes: day.totalMinutes,
    displayMinutes: formatMinutes(day.totalMinutes),
    isToday: day.date === today
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '12px'
        }}>
          <p style={{ margin: 0, fontWeight: '600', color: 'var(--text)' }}>
            {data.dayName}: {data.displayMinutes}
          </p>
          <p style={{ margin: '2px 0 0 0', color: 'var(--text-secondary)' }}>
            {data.sessionCount} session{data.sessionCount !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!hasData) {
    return (
      <div style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid var(--border)',
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
          This Week's Focus Time ⏱️
        </h3>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
          No focus sessions yet
        </p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'var(--surface)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid var(--border)'
    }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
        This Week's Focus Time ⏱️
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <XAxis
            dataKey="dayName"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
            tickFormatter={(val) => `${val}m`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.isToday ? '#7c3aed' : '#534AB7'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FocusWeekChart;