import { motion } from 'framer-motion';
import { MOODS } from '../../utils/moodUtils';

const MoodSelector = ({ onSelect, currentMood }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
      }}
    >
      {MOODS.map((mood) => {
        const isSelected = currentMood === mood.id;
        return (
          <motion.button
            key={mood.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(mood.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '8px',
              backgroundColor: isSelected ? mood.bgColor : 'transparent',
              border: isSelected ? `2px solid ${mood.color}` : '2px solid transparent',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              filter: isSelected ? 'none' : 'grayscale(0.5)',
              opacity: isSelected ? 1 : 0.6,
              transform: isSelected ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            <span style={{ fontSize: '32px' }}>{mood.emoji}</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '500',
                color: isSelected ? mood.color : 'var(--text-secondary)',
              }}
            >
              {mood.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default MoodSelector;
