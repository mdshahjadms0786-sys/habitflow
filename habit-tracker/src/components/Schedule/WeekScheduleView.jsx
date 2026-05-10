import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { DAY_NAMES, DAY_LABELS, getDayName } from '../../utils/schedulerUtils';

const WeekScheduleView = ({ schedule, habits = [] }) => {
  const today = getDayName(new Date());
  const todayIndex = DAY_NAMES.indexOf(today);

  const getDateForDay = (dayIndex) => {
    const current = new Date();
    const diff = dayIndex - todayIndex;
    const date = new Date(current);
    date.setDate(date.getDate() + diff);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (timeStr) => {
    const [hours] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}${ampm}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '8px',
        overflowX: 'auto'
      }}
    >
      {DAY_NAMES.map((day, index) => {
        const daySchedule = schedule[day] || [];
        const isToday = day === today;

        return (
          <div
            key={day}
            style={{
              minWidth: '100px',
              backgroundColor: isToday ? '#EEEDFE' : 'var(--surface)',
              borderRadius: '12px',
              border: isToday ? '2px solid #534AB7' : '1px solid var(--border)',
              padding: '12px'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: isToday ? '#534AB7' : 'var(--text)' }}>
                {DAY_LABELS[index]}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {getDateForDay(index)}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {daySchedule.length === 0 ? (
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                  No habits
                </div>
              ) : (
                daySchedule.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '6px 8px',
                      backgroundColor: 'var(--bg)',
                      borderRadius: '6px',
                      fontSize: '11px'
                    }}
                  >
                    <div style={{ color: 'var(--text-secondary)' }}>{formatTime(item.time)}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>{item.icon}</span>
                      <span style={{ color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.habitName}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
};

export default WeekScheduleView;