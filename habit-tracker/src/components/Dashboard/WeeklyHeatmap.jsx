import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from 'date-fns';

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

export const WeeklyHeatmap = ({ habits }) => {
  const weekData = useMemo(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return weekDays.map((day) => {
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
        dayName: format(day, 'EEE'),
        dayNumber: format(day, 'd'),
        completedCount,
        totalHabits,
        percentage,
        isToday: isToday(day),
        intensity,
      };
    });
  }, [habits]);

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const colors = isDark ? darkIntensityColors : intensityColors;

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
        This Week
      </h3>
      <div
        style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'space-between',
        }}
      >
        {weekData.map((day, index) => {
            let cellContent = '';
            if (day.totalHabits === 0) {
              cellContent = '';
            } else if (day.completedCount === day.totalHabits) {
              cellContent = '✓';
            } else if (day.completedCount > 0) {
              cellContent = `${Math.round(day.percentage)}%`;
            }
            
            const isFullyCompleted = day.completedCount === day.totalHabits && day.totalHabits > 0;
            const isPartial = day.completedCount > 0 && day.completedCount < day.totalHabits;
            
            return (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  flex: 1,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    backgroundColor: isFullyCompleted ? '#22c55e' : isPartial ? '#eab308' : 'var(--bg-secondary)',
                    borderRadius: '8px',
                    border: day.isToday ? '3px solid #8b5cf6' : '2px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: day.completedCount === day.totalHabits ? '14px' : '10px',
                    fontWeight: '600',
                    color: isFullyCompleted ? '#ffffff' : isPartial ? '#ffffff' : 'var(--text-secondary)',
                  }}
                  title={`${day.dayName} ${day.dayNumber}: ${day.completedCount}/${day.totalHabits} habits completed`}
                >
                  {cellContent}
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    color: day.isToday ? '#8b5cf6' : 'var(--text-secondary)',
                    fontWeight: day.isToday ? '600' : '500',
                  }}
                >
                  {day.dayName}
                </span>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
};

export default WeeklyHeatmap;
