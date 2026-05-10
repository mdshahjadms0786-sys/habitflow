import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, getDay } from 'date-fns';

const intensityColors = {
  0: 'var(--bg-secondary)',
  1: '#c6e48b',
  2: '#7bc96f',
  3: '#238636',
  4: '#1e6e2e',
};

const darkIntensityColors = {
  0: '#161b22',
  1: '#0e4429',
  2: '#006d32',
  3: '#26a641',
  4: '#39d353',
};

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const MonthlyHeatmap = ({ habits }) => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const colors = isDark ? darkIntensityColors : intensityColors;

  const heatmapData = useMemo(() => {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const firstDayOfMonth = getDay(monthStart);
    const paddedDays = Array.from({ length: firstDayOfMonth }, (_, i) => ({
      date: null,
      day: i + 1,
      empty: true,
    }));

    const daysWithData = allDays.map((day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const completedCount = habits.filter(
        (h) => h.completionLog?.[dateStr]
      ).length;
      const totalHabits = habits.length;
      const percentage = totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0;

      let intensity = 0;
      if (percentage > 0) intensity = 1;
      if (percentage >= 25) intensity = 2;
      if (percentage >= 50) intensity = 3;
      if (percentage >= 75) intensity = 4;

      return {
        date: dateStr,
        day: day.getDate(),
        empty: false,
        completedCount,
        totalHabits,
        percentage,
        intensity,
        isToday: format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'),
      };
    });

    return [...paddedDays, ...daysWithData];
  }, [habits]);

  const weeks = useMemo(() => {
    const result = [];
    let week = [];

    heatmapData.forEach((day, index) => {
      week.push(day);
      if (week.length === 7 || index === heatmapData.length - 1) {
        result.push(week);
        week = [];
      }
    });

    return result;
  }, [heatmapData]);

  return (
    <div
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '16px',
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
        {format(new Date(), 'MMMM yyyy')}
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
        {dayLabels.map((day) => (
          <div
            key={day}
            style={{
              textAlign: 'center',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              fontWeight: '500',
            }}
          >
            {day}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {week.map((day, dayIndex) => {
              if (day.empty) {
                return <div key={dayIndex} style={{ aspectRatio: '1' }} />;
              }

              return (
                <motion.div
                  key={dayIndex}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (weekIndex * 7 + dayIndex) * 0.02 }}
                  style={{
                    aspectRatio: '1',
                    backgroundColor: colors[day.intensity],
                    borderRadius: '4px',
                    border: day.isToday ? '2px solid var(--primary)' : '1px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '500',
                    color: day.intensity > 2 ? '#ffffff' : 'var(--text)',
                    cursor: 'pointer',
                  }}
                  title={
                    day.completedCount > 0
                      ? `${day.completedCount}/${day.totalHabits} habits completed`
                      : 'No completions'
                  }
                >
                  {day.day}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '12px',
          fontSize: '10px',
          color: 'var(--text-secondary)',
        }}
      >
        <span>Less</span>
        <div style={{ display: 'flex', gap: '2px' }}>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: colors[level],
                borderRadius: '2px',
              }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default MonthlyHeatmap;
