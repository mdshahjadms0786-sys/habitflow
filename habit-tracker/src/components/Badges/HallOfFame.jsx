import { motion } from 'framer-motion';
import { getEarnedBadges, getTotalBadgesEarned } from '../../utils/badgeUtils';

const HallOfFame = ({ habits }) => {
  if (!habits || habits.length === 0) {
    return null;
  }

  const habitWithBadges = habits
    .map((habit) => ({
      habit,
      badges: getEarnedBadges(habit.currentStreak || 0),
    }))
    .filter((item) => item.badges.length > 0)
    .sort((a, b) => b.badges.length - a.badges.length)
    .slice(0, 3);

  if (habitWithBadges.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
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
          fontSize: '18px',
          fontWeight: '700',
          color: 'var(--text)',
        }}
      >
        🏆 Hall of Fame
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {habitWithBadges.map((item, index) => (
          <motion.div
            key={item.habit.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: index === 0 ? '12px' : '8px',
              borderRadius: '12px',
              backgroundColor: index === 0 ? `${item.badges[0]?.color || '#FFD700'}15` : 'transparent',
              border: index === 0 ? '2px solid' : '1px solid transparent',
              borderColor: index === 0 ? (item.badges[0]?.color || '#FFD700') : 'transparent',
              transform: index === 0 ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            <span style={{ fontSize: index === 0 ? '28px' : '24px' }}>
              {item.habit.icon || '⭐'}
            </span>
            <div style={{ flex: 1 }}>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--text)',
                }}
              >
                {item.habit.name}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {item.badges.map((badge) => (
                <span key={badge.id} style={{ fontSize: '20px' }}>
                  {badge.emoji}
                </span>
              ))}
            </div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
              }}
            >
              ({item.badges.length})
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default HallOfFame;
