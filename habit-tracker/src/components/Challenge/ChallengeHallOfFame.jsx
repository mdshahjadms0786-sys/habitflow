import { motion } from 'framer-motion';
import { getPastChallenges, CHALLENGE_TEMPLATES } from '../../utils/challengeUtils';

const ChallengeHallOfFame = () => {
  const pastChallenges = getPastChallenges();
  const currentYear = new Date().getFullYear();
  const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return (
    <div>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>
        🏆 Hall of Fame ({currentYear})
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {CHALLENGE_TEMPLATES.map((template) => {
          const key = `${template.month}-${currentYear}`;
          const completed = pastChallenges[key];
          
          return (
            <motion.div
              key={template.month}
              whileHover={{ scale: completed ? 1.02 : 1 }}
              style={{
                padding: '12px 8px',
                background: completed ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255,255,255,0.05)',
                border: completed ? '1px solid #22c55e' : '1px solid var(--border)',
                borderRadius: '10px',
                textAlign: 'center',
                opacity: completed ? 1 : 0.5,
              }}
            >
              <span style={{ fontSize: '24px', display: 'block', marginBottom: '4px' }}>
                {completed ? template.badge : '🔒'}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: completed ? 'var(--text)' : 'var(--text-secondary)' }}>
                {monthNames[template.month]}
              </span>
              {completed && (
                <p style={{ margin: '4px 0 0', fontSize: '10px', color: '#22c55e' }}>
                  ✓
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ChallengeHallOfFame;