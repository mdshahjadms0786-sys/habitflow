import { motion } from 'framer-motion';
import { DIFFICULTY_LEVELS, getDifficultyStats } from '../../utils/difficultyUtils';

const DifficultyAnalyticsCard = ({ habits }) => {
  const stats = getDifficultyStats(habits);
  const total = habits?.length || 0;
  
  const getScoreLabel = (score) => {
    if (score <= 30) return 'Taking it easy 😌';
    if (score <= 60) return 'Balanced approach ⚖️';
    if (score <= 80) return 'Challenge seeker 💪';
    return 'Extreme warrior 💀';
  };
  
  const getScoreEmoji = (score) => {
    if (score <= 30) return '😌';
    if (score <= 60) return '⚖️';
    if (score <= 80) return '💪';
    return '💀';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid var(--border)',
      }}
    >
      <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
        Difficulty Balance 💪
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {Object.values(DIFFICULTY_LEVELS).map((level) => {
          const count = stats[level.id] || 0;
          const width = total > 0 ? (count / total) * 100 : 0;
          
          return (
            <div key={level.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '16px', width: '24px', textAlign: 'center' }}>
                {level.emoji}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text)', width: '50px' }}>
                {level.label}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', width: '20px', textAlign: 'right' }}>
                {count}
              </span>
              <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${width}%`,
                    height: '100%',
                    backgroundColor: level.color,
                    borderRadius: '4px',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <div style={{ 
        marginTop: '16px', 
        paddingTop: '12px', 
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Difficulty Score</span>
          <p style={{ margin: '2px 0 0 0', fontSize: '18px', fontWeight: '700', color: 'var(--text)' }}>
            {stats.difficultyScore}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '24px' }}>{getScoreEmoji(stats.difficultyScore)}</span>
          <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
            {getScoreLabel(stats.difficultyScore)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default DifficultyAnalyticsCard;