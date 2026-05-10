import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabits } from '../hooks/useHabits';
import HabitCalendar from '../components/Calendar/HabitCalendar';
import { formatISODate, getDaysInMonth } from '../utils/dateUtils';

const CalendarPage = () => {
  const { habits } = useHabits();
  const [selectedHabitId, setSelectedHabitId] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayData, setDayData] = useState(null);

  const currentDate = new Date();
  const today = formatISODate(new Date());

  const handleDayClick = (day, data) => {
    setSelectedDay(day);
    setDayData(data);
  };

  const monthStats = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(new Date(year, month, 1));

    let totalCompletions = 0;
    let maxCompletions = 0;
    let perfectDays = 0;
    let missedDays = 0;

    const habitsToCheck = selectedHabitId ? habits.filter(h => h.id === selectedHabitId) : habits;

    daysInMonth.forEach(day => {
      if (!day) return;
      const dateStr = formatISODate(day);
      if (new Date(dateStr) > new Date(today)) return;

      let dayCompleted = 0;
      habitsToCheck.forEach(habit => {
        if (habit.completionLog?.[dateStr]) {
          dayCompleted++;
        }
      });

      totalCompletions += dayCompleted;
      maxCompletions += habitsToCheck.length;

      if (habitsToCheck.length > 0) {
        const percent = dayCompleted / habitsToCheck.length;
        if (percent === 1) perfectDays++;
        if (percent === 0) missedDays++;
      }
    });

    const completionRate = maxCompletions > 0 ? Math.round((totalCompletions / maxCompletions) * 100) : 0;

    return {
      completionRate,
      perfectDays,
      missedDays,
    };
  }, [habits, selectedHabitId, currentDate, today]);

  return (
    <div className="page-container" style={{ padding: '24px', paddingBottom: '80px' }}>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '24px' }}
      >
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--text)' }}>
          Habit Calendar 📅
        </h1>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Visualize your progress over time
        </p>
      </motion.header>

      <div style={{ marginBottom: '20px' }}>
        <select
          value={selectedHabitId || ''}
          onChange={(e) => setSelectedHabitId(e.target.value || null)}
          style={{
            padding: '12px 16px',
            fontSize: '14px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            color: 'var(--text)',
            width: '100%',
            maxWidth: '300px',
          }}
        >
          <option value="">All Habits</option>
          {habits.map(habit => (
            <option key={habit.id} value={habit.id}>
              {habit.icon} {habit.name}
            </option>
          ))}
        </select>
      </div>

      <HabitCalendar
        selectedHabitId={selectedHabitId}
        onDayClick={handleDayClick}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginTop: '20px' }}>
        <div style={{ backgroundColor: 'var(--surface)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text)' }}>{monthStats.completionRate}%</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Monthly Rate</div>
        </div>
        <div style={{ backgroundColor: 'var(--surface)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#22c55e' }}>{monthStats.perfectDays}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Perfect Days</div>
        </div>
        <div style={{ backgroundColor: 'var(--surface)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>❌</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>{monthStats.missedDays}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Missed Days</div>
        </div>
      </div>

      <AnimatePresence>
        {selectedDay && dayData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px',
            }}
            onClick={() => setSelectedDay(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              style={{
                backgroundColor: 'var(--surface)',
                borderRadius: '16px',
                padding: '24px',
                maxWidth: '400px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: 'var(--text)' }}>
                  {formatISODate(selectedDay)}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setSelectedDay(null)}
                  style={{
                    padding: '8px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '20px',
                  }}
                >
                  ✕
                </motion.button>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {dayData.completed}/{dayData.habits.length} habits completed ({dayData.percentage}%)
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {dayData.habits?.map(habit => (
                  <div
                    key={habit.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: habit.completed ? 'rgba(34,197,94,0.1)' : 'var(--bg)',
                      borderRadius: '8px',
                      border: `1px solid ${habit.completed ? '#22c55e' : 'var(--border)'}`,
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{habit.icon}</span>
                    <span style={{ flex: 1, color: 'var(--text)', textDecoration: habit.completed ? 'line-through' : 'none' }}>
                      {habit.name}
                    </span>
                    <span>{habit.completed ? '✅' : '⬜'}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarPage;