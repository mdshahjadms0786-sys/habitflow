import { motion } from 'framer-motion';
import { DIFFICULTY_LEVELS } from '../../utils/difficultyUtils';

const DifficultySelector = ({ value = 'medium', onChange }) => {
  const options = Object.values(DIFFICULTY_LEVELS);
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
      {options.map((level) => {
        const isSelected = value === level.id;
        
        return (
          <motion.button
            key={level.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(level.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 12px',
              backgroundColor: isSelected ? level.bgColor : 'var(--bg)',
              border: `2px solid ${isSelected ? level.color : 'var(--border)'}`,
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: '32px' }}>{level.emoji}</span>
            <span style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: isSelected ? level.color : 'var(--text)' 
            }}>
              {level.label}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <span style={{ fontSize: '12px', fontWeight: '500', color: level.color }}>
                +{level.points} pts
              </span>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                +{level.streakBonus}/day streak
              </span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              {level.description}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default DifficultySelector;