import { motion } from 'framer-motion';
import BadgeCard from './BadgeCard';
import { getEarnedBadges, getNextBadge, BADGES } from '../../utils/badgeUtils';

const BadgeRow = ({ habit }) => {
  const currentStreak = habit.currentStreak || 0;
  const earnedBadges = getEarnedBadges(currentStreak);
  const nextBadgeInfo = getNextBadge(currentStreak);
  const earnedIds = new Set(earnedBadges.map((b) => b.id));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '12px 0',
        borderBottom: '1px solid var(--border)',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '120px' }}>
        <span style={{ fontSize: '24px' }}>{habit.icon || '⭐'}</span>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>{habit.name}</span>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          overflowX: 'auto',
        }}
      >
        {BADGES.map((badge) => {
          const earned = earnedIds.has(badge.id);
          const daysLeft = earned ? 0 : nextBadgeInfo?.badge?.id === badge.id ? nextBadgeInfo.daysLeft : badge.requiredDays - currentStreak;
          return (
            <div key={badge.id} title={earned ? badge.name : `${daysLeft} days until ${badge.name}`}>
              <BadgeCard badge={badge} earned={earned} daysLeft={daysLeft} />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default BadgeRow;
