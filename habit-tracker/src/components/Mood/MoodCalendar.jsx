import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, subDays, parseISO } from 'date-fns';
import { useMoodContext } from '../../context/MoodContext';
import { MOODS, getMoodById } from '../../utils/moodUtils';
import { getTodayISO } from '../../utils/dateUtils';

const MOOD_COLORS = {
  0: '#E5E7EB',
  1: '#E24B4A',
  2: '#D85A30',
  3: '#BA7517',
  4: '#1D9E75',
  5: '#534AB7',
};

const MOOD_LABELS = {
  0: 'No Mood',
  1: 'Terrible',
  2: 'Bad',
  3: 'Okay',
  4: 'Good',
  5: 'Amazing',
};

const MoodCalendar = () => {
  const { moodLog } = useMoodContext();
  const [hoveredDate, setHoveredDate] = useState(null);
  const todayISO = getTodayISO();

  const days = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const moodId = (moodLog || {})[dateStr] || 0;
    days.push({
      date: dateStr,
      dayNum: format(date, 'd'),
      dayName: format(date, 'EEE'),
      moodId,
      isToday: dateStr === todayISO,
    });
  }

  const handleMouseEnter = (dateStr, moodId) => {
    setHoveredDate({ date: dateStr, moodId });
  };

  const handleMouseLeave = () => {
    setHoveredDate(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid var(--border)',
      }}
    >
      <h3
        style={{
          margin: '0 0 16px 0',
          fontSize: '16px',
          fontWeight: '600',
          color: 'var(--text)',
          textAlign: 'center',
        }}
      >
        Mood History 📅
      </h3>

      {hoveredDate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: 'center',
            marginBottom: '12px',
            padding: '8px 12px',
            backgroundColor: 'var(--bg)',
            borderRadius: '8px',
            fontSize: '13px',
            color: 'var(--text-secondary)',
          }}
        >
          <span style={{ fontWeight: '600', color: 'var(--text)' }}>
            {format(parseISO(hoveredDate.date), 'MMM d, yyyy')}
          </span>
          {' — '}
          <span style={{ color: MOOD_COLORS[hoveredDate.moodId] }}>
            {hoveredDate.moodId > 0
              ? `${getMoodById(hoveredDate.moodId)?.emoji} ${MOOD_LABELS[hoveredDate.moodId]}`
              : 'No mood logged'}
          </span>
        </motion.div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
          justifyContent: 'center',
          maxWidth: '350px',
          margin: '0 auto',
        }}
      >
        {days.map((day) => (
          <motion.div
            key={day.date}
            whileHover={{ scale: 1.2 }}
            onMouseEnter={() => handleMouseEnter(day.date, day.moodId)}
            onMouseLeave={handleMouseLeave}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: MOOD_COLORS[day.moodId],
              border: day.isToday ? '2px solid #534AB7' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              margin: '0 auto',
            }}
          >
            <span
              style={{
                fontSize: '10px',
                fontWeight: day.isToday ? '700' : '500',
                color: day.moodId > 0 ? '#ffffff' : 'var(--text-secondary)',
              }}
            >
              {day.dayNum}
            </span>
          </motion.div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginTop: '20px',
          flexWrap: 'wrap',
        }}
      >
        {[1, 2, 3, 4, 5].map((id) => {
          const mood = getMoodById(id);
          return (
            <div
              key={id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                color: 'var(--text-secondary)',
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: MOOD_COLORS[id],
                }}
              />
              <span>
                {mood?.emoji} {mood?.label}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default MoodCalendar;
