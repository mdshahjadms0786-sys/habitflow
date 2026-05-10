import { motion } from 'framer-motion';
import {
  getAverageMood,
  getBestMoodDay,
  getMoodStreak,
  getLoggedDaysCount,
  getMoodById,
  MOODS,
} from '../../utils/moodUtils';

const MoodInsights = ({ moodLog }) => {
  const avgMood = getAverageMood(moodLog, 7);
  const bestDay = getBestMoodDay(moodLog);
  const moodStreak = getMoodStreak(moodLog);
  const loggedDays = getLoggedDaysCount(moodLog);

  const getMoodEmoji = (score) => {
    if (!score) return '😐';
    const n = parseFloat(score);
    if (n <= 1.5) return '😢';
    if (n <= 2.5) return '😞';
    if (n <= 3.5) return '😐';
    if (n <= 4.5) return '😀';
    return '🤩';
  };

  const getMoodLabel = (score) => {
    if (!score) return 'Okay';
    const n = parseFloat(score);
    if (n <= 1.5) return 'Terrible';
    if (n <= 2.5) return 'Bad';
    if (n <= 3.5) return 'Okay';
    if (n <= 4.5) return 'Good';
    return 'Amazing';
  };

  const getMoodColor = (score) => {
    if (!score) return '#BA7517';
    const n = parseFloat(score);
    if (n <= 1.5) return '#E24B4A';
    if (n <= 2.5) return '#D85A30';
    if (n <= 3.5) return '#BA7517';
    if (n <= 4.5) return '#1D9E75';
    return '#534AB7';
  };

  const insights = [
    {
      emoji: '📊',
      title: "This Week's Mood",
      value: avgMood ? getMoodEmoji(avgMood) : '—',
      subValue: avgMood ? `${avgMood}/5` : 'N/A',
      subLabel: avgMood ? getMoodLabel(avgMood) : 'Not enough data',
      color: avgMood ? getMoodColor(avgMood) : 'var(--text-secondary)',
      barWidth: avgMood ? `${(parseFloat(avgMood) / 5) * 100}%` : '0%',
    },
    {
      emoji: '🌟',
      title: 'Best Day',
      value: bestDay || '—',
      subValue: bestDay ? `You feel best on ${bestDay}!` : 'Need more data',
      subLabel: '',
      color: 'var(--primary)',
    },
    {
      emoji: '🔥',
      title: 'Mood Streak',
      value: moodStreak > 0 ? `${moodStreak}` : '—',
      subValue: moodStreak > 0 ? 'days in a row' : 'Start logging!',
      subLabel: 'Keep logging for better insights!',
      color: '#f97316',
    },
    {
      emoji: '📅',
      title: 'Logged Days',
      value: loggedDays > 0 ? `${loggedDays}` : '—',
      subValue: loggedDays > 0 ? 'days logged' : 'No entries yet',
      subLabel: 'Out of last 30 days',
      color: '#8b5cf6',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
      }}
    >
      {insights.map((insight, index) => (
        <motion.div
          key={insight.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px' }}>{insight.emoji}</span>
            <span
              style={{
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--text-secondary)',
              }}
            >
              {insight.title}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: insight.color,
              }}
            >
              {insight.value}
            </span>
            {insight.subValue && (
              <span
                style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                }}
              >
                {insight.subValue}
              </span>
            )}
          </div>

          {insight.barWidth && (
            <div
              style={{
                marginTop: '8px',
                height: '6px',
                borderRadius: '3px',
                backgroundColor: 'var(--border)',
                overflow: 'hidden',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: insight.barWidth }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                style={{
                  height: '100%',
                  borderRadius: '3px',
                  backgroundColor: insight.color,
                }}
              />
            </div>
          )}

          {insight.subLabel && (
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '11px',
                color: 'var(--text-secondary)',
              }}
            >
              {insight.subLabel}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default MoodInsights;
