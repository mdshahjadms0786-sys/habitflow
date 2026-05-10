import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DaySnapshot from '../components/TimeTravel/DaySnapshot';
import JourneyTimeline from '../components/TimeTravel/JourneyTimeline';
import { getDaySnapshot, getJourneyMilestones } from '../utils/timeTravelUtils';
import { useHabits } from '../hooks/useHabits';
import { useMoodContext } from '../context/MoodContext';

const TimelinePage = () => {
  const { habits } = useHabits();
  const { moodLog } = useMoodContext();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date().toISOString().split('T')[0];
  
  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const result = [];
    for (let i = 0; i < firstDay; i++) {
      result.push(null);
    }
    for (let d = 1; d <= days; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      result.push(dateStr);
    }
    return result;
  }, [currentMonth]);

  const handleDayClick = (dateStr) => {
    if (dateStr && dateStr <= today) {
      const snapshot = getDaySnapshot(habits, moodLog, dateStr);
      setSelectedSnapshot(snapshot);
    }
  };

  const completionColor = (dateStr) => {
    if (!dateStr || dateStr > today) return 'var(--border)';
    const snapshot = getDaySnapshot(habits, moodLog, dateStr);
    if (snapshot.completionRate === 100) return '#22c55e';
    if (snapshot.completionRate >= 70) return '#84cc16';
    if (snapshot.completionRate >= 30) return '#f59e0b';
    return '#dc2626';
  };

  const totalDays = habits.reduce((sum, h) => {
    if (!h.completionLog) return sum;
    return sum + Object.keys(h.completionLog).length;
  }, 0);

  const journeyStart = useMemo(() => {
    if (habits.length === 0) return null;
    const sorted = [...habits].sort((a, b) => new Date(a.createdAt || '9999') - new Date(b.createdAt || '9999'));
    return sorted[0]?.createdAt?.split('T')[0] || null;
  }, [habits]);

  return (
    <div className="page-container" style={{ padding: '24px', paddingBottom: '80px' }}>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '24px' }}
      >
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--text)' }}>
          Your Journey 🕰️
        </h1>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
          {totalDays} days of habit tracking • Started {journeyStart || 'recently'}
        </p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '24px' }}
      >
        <JourneyTimeline habits={habits} onSelectDate={handleDayClick} />
      </motion.div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} style={{ padding: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px' }}>◀</button>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} style={{ padding: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px' }}>▶</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '24px' }}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)', padding: '8px' }}>{d}</div>
        ))}
        {daysInMonth.map((dateStr, i) => (
          <div
            key={i}
            onClick={() => handleDayClick(dateStr)}
            style={{
              aspectRatio: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: dateStr ? completionColor(dateStr) : 'transparent',
              borderRadius: '8px',
              fontSize: '12px',
              cursor: dateStr && dateStr <= today ? 'pointer' : 'default',
              color: dateStr && dateStr <= today ? '#fff' : 'var(--text-secondary)',
              opacity: dateStr ? 1 : 0
            }}
          >
            {dateStr ? parseInt(dateStr.split('-')[2]) : ''}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedSnapshot && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }} onClick={() => setSelectedSnapshot(null)}>
            <DaySnapshot snapshot={selectedSnapshot} onClose={() => setSelectedSnapshot(null)} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimelinePage;