import { motion } from 'framer-motion';
import { useHabits } from '../../hooks/useHabits';
import { getTotalBadgesEarned, getNextBadge, BADGES } from '../../utils/badgeUtils';

const OverallBadgeStats = () => {
  const { habits } = useHabits();

  if (!habits || habits.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              flex: '1 1 150px',
              backgroundColor: 'var(--surface)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid var(--border)',
              minHeight: '80px',
            }}
          >
            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: '0 0 4px 0' }}>
              No data yet
            </p>
          </div>
        ))}
      </div>
    );
  }

  const totalBadges = getTotalBadgesEarned(habits);

  const habitBadgeCounts = habits.map((habit) => ({
    habit,
    count: getTotalBadgesEarned([habit]),
  }));
  const bestHabit = habitBadgeCounts.reduce(
    (best, item) => (item.count > best.count ? item : best),
    { habit: null, count: 0 }
  );

  let nextBadgeInfo = { daysLeft: Infinity, badge: null };
  habits.forEach((habit) => {
    const next = getNextBadge(habit.currentStreak || 0);
    if (next && next.daysLeft < nextBadgeInfo.daysLeft) {
      nextBadgeInfo = next;
    }
  });

  const stats = [
    {
      label: 'Total Badges',
      icon: '🏅',
      value: totalBadges,
      color: '#FFD700',
    },
    {
      label: 'Best Habit',
      icon: '🌟',
      value: bestHabit.habit?.name || 'None',
      color: '#8b5cf6',
    },
    {
      label: 'Next Badge',
      icon: '⏳',
      value: nextBadgeInfo.daysLeft === Infinity ? 'All done!' : `${nextBadgeInfo.daysLeft} days`,
      color: '#14b8a6',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
      }}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          style={{
            flex: '1 1 150px',
            backgroundColor: 'var(--surface)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px' }}>{stat.icon}</span>
            <span
              style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
              }}
            >
              {stat.label}
            </span>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '700',
              color: stat.color,
            }}
          >
            {stat.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default OverallBadgeStats;
