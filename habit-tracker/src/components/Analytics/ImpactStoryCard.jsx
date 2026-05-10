import { motion } from 'framer-motion';
import { generateImpactStory } from '../../utils/impactStoryUtils';

const ImpactStoryCard = ({ habits, style }) => {
  const { story, impacts, days } = generateImpactStory(habits);

  const handleShare = () => {
    navigator.clipboard.writeText(story);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '20px',
        backgroundColor: 'var(--surface)',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        ...style
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Your Impact Story 📖</h2>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Since Day 1</span>
      </div>

      {impacts.length === 0 ? (
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Start tracking habits to see your impact!</p>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            {impacts.map((impact, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'var(--bg)', borderRadius: '8px' }}>
                <span style={{ fontSize: '24px' }}>{impact.emoji}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>{impact.value}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{impact.detail}</div>
                </div>
              </div>
            ))}
          </div>
          
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '16px' }}>
            "Every habit counts. Every day matters."
          </p>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShare}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '13px',
              backgroundColor: 'var(--bg)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            📋 Share Your Story
          </motion.button>
        </>
      )}
    </motion.div>
  );
};

export default ImpactStoryCard;