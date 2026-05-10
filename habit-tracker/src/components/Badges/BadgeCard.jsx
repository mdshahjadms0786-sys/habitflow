import { motion } from 'framer-motion';

const styles = `
  @keyframes shimmer {
    0% { background-position: -100% 0; }
    100% { background-position: 200% 0; }
  }

  .badge-card-earned {
    position: relative;
    overflow: hidden;
  }

  .badge-card-earned::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 100%
    );
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
`;

const BadgeCard = ({ badge, earned, daysLeft }) => {
  return (
    <>
      <style>{styles}</style>
      <motion.div
        whileHover={earned ? { scale: 1.05 } : {}}
        style={{
          width: '80px',
          height: '100px',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          padding: '8px',
          border: earned ? '2px solid' : '1px dashed #ccc',
          borderColor: earned ? badge.color : '#ccc',
          backgroundColor: earned ? `${badge.color}15` : 'var(--surface)',
          opacity: earned ? 1 : 0.4,
          filter: earned ? 'none' : 'grayscale(100%)',
          cursor: earned ? 'pointer' : 'default',
          transition: 'all 0.2s',
        }}
        className={earned ? 'badge-card-earned' : ''}
      >
        <span style={{ fontSize: '48px' }}>{badge.emoji}</span>
        {earned ? (
          <span
            style={{
              fontSize: '10px',
              fontWeight: '600',
              color: badge.color,
              textAlign: 'center',
              lineHeight: '1.2',
            }}
          >
            {badge.name}
          </span>
        ) : (
          <span
            style={{
              fontSize: '10px',
              color: 'var(--text-secondary)',
              textAlign: 'center',
            }}
          >
            {daysLeft} days to go
          </span>
        )}
      </motion.div>
    </>
  );
};

export default BadgeCard;
