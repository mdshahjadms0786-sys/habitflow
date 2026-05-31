import { motion } from 'framer-motion';

const statCards = [
  { key: 'today', label: 'Today', format: (value) => `${value.completed}/${value.total}`, icon: '📅' },
  { key: 'completion', label: 'Completion', format: (value) => `${value}%`, icon: '✅' },
  { key: 'streak', label: 'Best Streak', format: (value) => `${value} days`, icon: '🔥' },
  { key: 'total', label: 'Total Habits', format: (value) => value, icon: '📝' },
];

export const StatsBar = ({ completedToday, totalToday, completionPercentage, bestStreak }) => {
  const stats = [
    { key: 'today', value: { completed: completedToday, total: totalToday } },
    { key: 'completion', value: completionPercentage },
    { key: 'streak', value: bestStreak },
    { key: 'total', value: totalToday },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}
    >
      {stats.map((stat, index) => {
        const config = statCards.find((s) => s.key === stat.key);
        return (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '24px' }}>{config.icon}</span>
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  fontWeight: '500',
                }}
              >
                {config.label}
              </p>
              <p
                style={{
                  margin: '4px 0 0 0',
                  fontSize: '24px',
                  fontWeight: '700',
                  color: 'var(--text)',
                }}
              >
                {typeof config.format === 'function' ? config.format(stat.value) : stat.value}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsBar;
