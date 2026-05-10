import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '../hooks/useHabits';
import { getTotalBadgesEarned, getEarnedBadges, BADGES } from '../utils/badgeUtils';
import OverallBadgeStats from '../components/Badges/OverallBadgeStats';
import HallOfFame from '../components/Badges/HallOfFame';
import BadgeRow from '../components/Badges/BadgeRow';
import EmptyState from '../components/UI/EmptyState';

const tipCards = [
  {
    icon: '🎯',
    title: 'Stay Consistent',
    description: 'Complete habits daily, even small progress counts toward your streak',
  },
  {
    icon: '🌅',
    title: 'Morning Habits Win',
    description: 'Habits done before noon have 3x higher completion rates',
  },
  {
    icon: '🌱',
    title: 'Start Small',
    description: 'Begin with 2-3 habits. Quality over quantity builds lasting streaks',
  },
];

const Achievements = () => {
  const { habits } = useHabits();
  const navigate = useNavigate();
  const totalBadges = getTotalBadgesEarned(habits);

  if (!habits || habits.length === 0) {
    return (
      <div className="page-container" style={{ padding: '24px' }}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            margin: '0 0 24px 0',
            fontSize: '28px',
            fontWeight: '700',
            color: 'var(--text)',
          }}
        >
          Achievements 🏆
        </motion.h1>
        <EmptyState
          icon="🏆"
          title="Add habits to start earning badges!"
          description="Create your first habit to begin your journey towards achievements."
          action={() => navigate('/')}
          actionLabel="Go to Dashboard"
        />
      </div>
    );
  }

  return (
    <div className="page-container" style={{ padding: '24px' }}>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          margin: '0 0 24px 0',
          fontSize: '28px',
          fontWeight: '700',
          color: 'var(--text)',
        }}
      >
        Achievements 🏆
      </motion.h1>

      <section style={{ marginBottom: '32px' }}>
        <OverallBadgeStats />
      </section>

      <section style={{ marginBottom: '32px' }}>
        <HallOfFame habits={habits} />
      </section>

      {/* Badge Progress Overview */}
      <section style={{ marginBottom: '32px' }}>
        <h2
          style={{
            margin: '0 0 16px 0',
            fontSize: '20px',
            fontWeight: '600',
            color: 'var(--text)',
          }}
        >
          Badge Progress Overview
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {BADGES.map((badge) => {
            const safeHabitsFiltered = (habits || []).filter(h => h != null);
            const earnedByCount = safeHabitsFiltered.filter((h) => (h?.currentStreak || 0) >= badge.requiredDays).length;
            const progressPercent = habits.length > 0 ? (earnedByCount / habits.length) * 100 : 0;
            return (
              <div
                key={badge.id}
                style={{
                  backgroundColor: 'var(--surface)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px' }}>{badge.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
                      {badge.name}
                    </span>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {earnedByCount}/{habits.length} habits earned
                    </p>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: badge.color }}>
                    {badge.requiredDays} days
                  </span>
                </div>
                <div
                  style={{
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--border)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${progressPercent}%`,
                      backgroundColor: badge.color,
                      borderRadius: '4px',
                      transition: 'width 0.3s',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2
          style={{
            margin: '0 0 16px 0',
            fontSize: '20px',
            fontWeight: '600',
            color: 'var(--text)',
          }}
        >
          All Habit Badges
        </h2>
        <div>
          {(habits || []).filter(h => h != null).map((habit) => (
            <BadgeRow key={habit.id} habit={habit} />
          ))}
        </div>
      </section>

      {/* Tips to earn badges faster */}
      <section>
        <h2
          style={{
            margin: '0 0 16px 0',
            fontSize: '20px',
            fontWeight: '600',
            color: 'var(--text)',
          }}
        >
          Tips to earn badges faster
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {tipCards.map((tip, index) => (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                backgroundColor: '#EEEDFE',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <span style={{ fontSize: '24px' }}>{tip.icon}</span>
              <h3
                style={{
                  margin: '8px 0',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#6366f1',
                }}
              >
                {tip.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: '13px',
                  color: '#4c4c9d',
                  lineHeight: '1.4',
                }}
              >
                {tip.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Achievements;
