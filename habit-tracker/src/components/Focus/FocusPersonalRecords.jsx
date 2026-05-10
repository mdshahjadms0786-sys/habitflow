import { motion } from 'framer-motion';
import { getPersonalRecords, formatMinutes } from '../../utils/focusHistoryUtils';

const FocusPersonalRecords = ({ sessions }) => {
  const records = getPersonalRecords(sessions);

  const cards = [
    {
      icon: '🌟',
      value: records.bestDay ? `${formatMinutes(records.bestDay.totalMinutes)}` : '--',
      label: 'Best Day',
      sub: records.bestDay?.dayName || 'No data yet',
      color: '#f59e0b'
    },
    {
      icon: '⏱️',
      value: records.longestSession ? `${records.longestSession.duration}m` : '--',
      label: 'Longest Session',
      sub: records.longestSession?.habitName || 'No data yet',
      color: '#534AB7'
    },
    {
      icon: '🎯',
      value: formatMinutes(records.totalAllTime),
      label: 'Total Focus',
      sub: `${records.totalSessions} sessions`,
      color: '#22c55e'
    },
    {
      icon: '🔢',
      value: records.totalSessions.toString(),
      label: 'Total Sessions',
      sub: 'all time',
      color: '#3b82f6'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid var(--border)'
      }}
    >
      <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
        Personal Records 🏆
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px'
      }}>
        {cards.map((card, index) => (
          <div
            key={index}
            style={{
              backgroundColor: 'var(--bg)',
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <span style={{ fontSize: '20px', marginBottom: '4px' }}>{card.icon}</span>
            <span style={{ fontSize: '16px', fontWeight: '700', color: card.color }}>
              {card.value}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {card.label}
            </span>
            <span style={{ fontSize: '9px', color: 'var(--text-secondary)', opacity: 0.8 }}>
              {card.sub}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default FocusPersonalRecords;