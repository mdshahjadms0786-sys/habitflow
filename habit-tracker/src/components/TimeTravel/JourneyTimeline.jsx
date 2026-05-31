import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getJourneyMilestones } from '../../utils/timeTravelUtils';

const JourneyTimeline = ({ habits, onSelectDate, style }) => {
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    setMilestones(getJourneyMilestones(habits));
  }, [habits]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        gap: '16px',
        overflowX: 'auto',
        padding: '16px 0',
        ...style
      }}
    >
      {milestones.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Start tracking habits to see your journey milestones
        </div>
      ) : (
        milestones.map((milestone, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            onClick={() => onSelectDate(milestone.date)}
            style={{
              minWidth: '120px',
              padding: '16px',
              backgroundColor: 'var(--surface)',
              borderRadius: '12px',
              border: '2px solid #534AB7',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>⭐</div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text)' }}>{milestone.title}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>{milestone.date}</div>
          </motion.div>
        ))
      )}
    </motion.div>
  );
};

export default JourneyTimeline;