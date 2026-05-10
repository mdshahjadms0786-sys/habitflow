import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabits } from '../../hooks/useHabits';
import { getTodayISO, formatISODate, getDaysInMonth } from '../../utils/dateUtils';

const categoryColors = {
  Health: '#14b8a6',
  Work: '#3b82f6',
  Personal: '#8b5cf6',
  Fitness: '#f97316',
  Learning: '#f59e0b',
};

const completionColors = {
  100: '#1D9E75',
  75: '#9FE1CB',
  50: '#FAC775',
  25: '#F7C1C1',
  0: '#E5E7EB',
};

const getCompletionColor = (percentage) => {
  if (percentage === 100) return completionColors[100];
  if (percentage >= 75) return completionColors[75];
  if (percentage >= 50) return completionColors[50];
  if (percentage > 0) return completionColors[25];
  return completionColors[0];
};

const HabitCalendar = ({ selectedHabitId, onDayClick }) => {
  const { habits } = useHabits();
  const [currentDate, setCurrentDate] = useState(new Date());

  const habitsToShow = useMemo(() => {
    if (selectedHabitId) {
      return habits.filter(h => h.id === selectedHabitId);
    }
    return habits;
  }, [habits, selectedHabitId]);

  const monthDays = useMemo(() => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    return getDaysInMonth(date);
  }, [currentDate]);

  const today = getTodayISO();

  const getDayData = (day) => {
    const dateStr = formatISODate(day);
    const dayCompletion = { completed: 0, total: habitsToShow.length };

    habitsToShow.forEach(habit => {
      const completion = habit.completionLog?.[dateStr];
      if (completion) {
        dayCompletion.completed++;
      }
    });

    if (habitsToShow.length === 0) {
      dayCompletion.percentage = 0;
    } else {
      dayCompletion.percentage = Math.round((dayCompletion.completed / habitsToShow.length) * 100);
    }

    dayCompletion.habits = habitsToShow.map(habit => ({
      id: habit.id,
      name: habit.name,
      icon: habit.icon,
      completed: !!habit.completionLog?.[dateStr],
      category: habit.category,
    }));

    return dayCompletion;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div style={{ backgroundColor: 'var(--surface)', borderRadius: '12px', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToPreviousMonth}
          style={{
            padding: '8px 16px',
            backgroundColor: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            cursor: 'pointer',
            color: 'var(--text)',
          }}
        >
          ← Prev
        </motion.button>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: 'var(--text)' }}>
          {monthName}
        </h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToNextMonth}
          style={{
            padding: '8px 16px',
            backgroundColor: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            cursor: 'pointer',
            color: 'var(--text)',
          }}
        >
          Next →
        </motion.button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            style={{
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              padding: '8px 0',
            }}
          >
            {day}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {monthDays.map((day, index) => {
          const dateStr = day ? formatISODate(day) : null;
          const dayData = day ? getDayData(day) : null;
          const isToday = day && dateStr === today;
          const isFuture = day && new Date(day) > new Date(today);

          return (
            <motion.div
              key={index}
              whileHover={day && !isFuture ? { scale: 1.05 } : {}}
              onClick={() => day && !isFuture && onDayClick(day, dayData)}
              style={{
                aspectRatio: '1',
                minHeight: '50px',
                backgroundColor: day ? getCompletionColor(dayData?.percentage || 0) : 'transparent',
                borderRadius: '8px',
                padding: '4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                cursor: day && !isFuture ? 'pointer' : 'default',
                border: isToday ? '2px solid #8b5cf6' : 'none',
                opacity: isFuture ? 0.3 : 1,
              }}
            >
              {day && (
                <>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: dayData?.percentage >= 50 ? '#fff' : 'var(--text)' }}>
                    {day.getDate()}
                  </span>
                  <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '2px' }}>
                    {habitsToShow.slice(0, 4).map(habit => (
                      <span
                        key={habit.id}
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: dayData?.habits?.find(h => h.id === habit.id)?.completed
                            ? categoryColors[habit.category] || '#8b5cf6'
                            : 'rgba(0,0,0,0.2)',
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '20px', flexWrap: 'wrap' }}>
        {[
          { label: '100%', color: completionColors[100] },
          { label: '75-99%', color: completionColors[75] },
          { label: '50-74%', color: completionColors[50] },
          { label: '1-49%', color: completionColors[25] },
          { label: '0%', color: completionColors[0] },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: item.color }} />
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitCalendar;