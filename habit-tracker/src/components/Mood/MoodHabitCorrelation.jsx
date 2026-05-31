import { motion } from 'framer-motion';
import { getMoodHabitCorrelation } from '../../utils/moodUtils';

const MoodHabitCorrelation = ({ moodLog, habits }) => {
  const correlations = getMoodHabitCorrelation(moodLog, habits);
  const hasEnoughData = Object.keys(moodLog || {}).length >= 7;

  if (!hasEnoughData) {
    return (
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid var(--border)',
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: '32px' }}>📊</span>
        <p
          style={{
            margin: '12px 0 0 0',
            fontSize: '14px',
            color: 'var(--text-secondary)',
          }}
        >
          Log your mood for 7 days to see correlations
        </p>
      </div>
    );
  }

  if (correlations.length === 0) {
    return (
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid var(--border)',
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: '32px' }}>🚀</span>
        <p
          style={{
            margin: '12px 0 0 0',
            fontSize: '14px',
            color: 'var(--text-secondary)',
          }}
        >
          Complete habits and log mood to see which habits boost your mood
        </p>
      </div>
    );
  }

  return (
    <div
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
          fontSize: '16px',
          fontWeight: '600',
          color: 'var(--text)',
        }}
      >
        Habits That Boost Your Mood 🚀
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {correlations.map((item, index) => (
          <motion.div
            key={item.habitName}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.habitIcon}</span>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--text)',
                  flex: 1,
                }}
              >
                {item.habitName}
              </span>
              {item.improvement > 0 && (
                <span
                  style={{
                    padding: '2px 8px',
                    backgroundColor: '#E1F5EE',
                    color: '#1D9E75',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600',
                  }}
                >
                  +{item.improvement}% mood boost
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '4px',
                  }}
                >
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    With habit:
                  </span>
                  <span style={{ fontSize: '11px', color: '#1D9E75', fontWeight: '600' }}>
                    {item.avgMoodWithHabit}/5
                  </span>
                </div>
                <div
                  style={{
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--bg-secondary)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${(parseFloat(item.avgMoodWithHabit) / 5) * 100}%`,
                      height: '100%',
                      borderRadius: '4px',
                      backgroundColor: '#1D9E75',
                    }}
                  />
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '4px',
                  }}
                >
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Without:
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                    {item.avgMoodWithoutHabit}/5
                  </span>
                </div>
                <div
                  style={{
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--bg-secondary)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${(parseFloat(item.avgMoodWithoutHabit) / 5) * 100}%`,
                      height: '100%',
                      borderRadius: '4px',
                      backgroundColor: 'var(--border)',
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MoodHabitCorrelation;
