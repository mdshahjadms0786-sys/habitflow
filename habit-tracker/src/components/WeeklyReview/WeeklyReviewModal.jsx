import { motion } from 'framer-motion';
import { format, subDays, endOfWeek } from 'date-fns';
import { getMoodById, MOODS } from '../../utils/moodUtils';

const WeeklyReviewModal = ({ report, onClose }) => {
  if (!report) return null;

  const {
    weekStart,
    weekEnd,
    completionRate,
    totalCompleted,
    totalPossible,
    bestHabit,
    worstHabit,
    averageMood,
    moodEmoji,
    topStreak,
    dailyBreakdown,
    improvements,
    achievements,
  } = report;

  const bestDayIdx = dailyBreakdown.reduce(
    (best, d, i) => (d.percentage > dailyBreakdown[best].percentage ? i : best),
    0
  );

  const moodLabel = averageMood ? getMoodById(Math.round(parseFloat(averageMood)))?.label || 'Okay' : 'No data';

  const handleExport = () => {
    const lines = [
      `Weekly Review: ${weekStart} - ${weekEnd}`,
      `Completion Rate: ${completionRate}% (${totalCompleted}/${totalPossible})`,
      `Best Habit: ${bestHabit.name} (${bestHabit.completedDays}/7 days)`,
      `Needs Work: ${worstHabit.name} (${worstHabit.completedDays}/7 days)`,
      `Average Mood: ${moodLabel}`,
      `Top Streak: ${topStreak.name} (${topStreak.streak} days)`,
      '',
      'Daily Breakdown:',
      ...dailyBreakdown.map((d) => `  ${d.day}: ${d.completed}/${d.total} (${d.percentage}%)`),
      '',
      'Suggestions:',
      ...improvements.map((t) => `  - ${t}`),
      '',
      'Achievements:',
      ...achievements.map((a) => `  - ${a}`),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weekly-review-${weekStart.replace(/ /g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3000,
        padding: '16px',
        overflow: 'auto',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '20px',
          padding: '32px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: 'var(--text)' }}>
              📋 Weekly Review
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
              {weekStart} - {weekEnd}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: '4px 8px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          <div
            style={{
              backgroundColor: 'var(--bg)',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Completion</p>
            <p style={{ margin: '4px 0', fontSize: '28px', fontWeight: '700', color: completionRate >= 70 ? '#22c55e' : '#f59e0b' }}>
              {completionRate}%
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
              {totalCompleted}/{totalPossible} habits
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'var(--bg)',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Avg Mood</p>
            <p style={{ margin: '4px 0', fontSize: '28px' }}>{moodEmoji}</p>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
              {moodLabel}
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'var(--bg)',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Best Streak</p>
            <p style={{ margin: '4px 0', fontSize: '28px', fontWeight: '700', color: '#f97316' }}>
              {topStreak.streak}
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
              {topStreak.icon} {topStreak.name}
            </p>
          </div>
        </div>

        {/* Daily Breakdown */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
            Daily Breakdown
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
            {dailyBreakdown.map((day, i) => (
              <div
                key={day.day}
                style={{
                  textAlign: 'center',
                  padding: '10px 4px',
                  borderRadius: '10px',
                  backgroundColor: i === bestDayIdx ? '#E1F5EE' : 'var(--bg)',
                  border: i === bestDayIdx ? '1px solid #22c55e' : '1px solid transparent',
                }}
              >
                <p style={{ margin: 0, fontSize: '12px', fontWeight: '600', color: 'var(--text)' }}>
                  {day.day}
                </p>
                <p style={{ margin: '4px 0', fontSize: '16px', fontWeight: '700', color: i === bestDayIdx ? '#22c55e' : 'var(--text)' }}>
                  {day.percentage}%
                </p>
                <div
                  style={{
                    height: '4px',
                    borderRadius: '2px',
                    backgroundColor: 'var(--border)',
                    overflow: 'hidden',
                    marginTop: '4px',
                  }}
                >
                  <div
                    style={{
                      width: `${day.percentage}%`,
                      height: '100%',
                      backgroundColor: i === bestDayIdx ? '#22c55e' : 'var(--primary)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          <div
            style={{
              backgroundColor: '#F0FDF4',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid #86EFAC',
            }}
          >
            <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: '#22c55e' }}>
              🏆 Best Habit
            </p>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
              {bestHabit.icon} {bestHabit.name}
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#22c55e' }}>
              {bestHabit.completedDays}/7 days
            </p>
          </div>
          <div
            style={{
              backgroundColor: '#FEF2F2',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid #FCA5A5',
            }}
          >
            <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: '#ef4444' }}>
              📉 Needs Work
            </p>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
              {worstHabit.icon} {worstHabit.name}
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#ef4444' }}>
              {worstHabit.completedDays}/7 days
            </p>
          </div>
        </div>

        {/* Mood Summary */}
        {averageMood && (
          <div
            style={{
              textAlign: 'center',
              padding: '16px',
              backgroundColor: 'var(--bg)',
              borderRadius: '12px',
              marginBottom: '24px',
            }}
          >
            <span style={{ fontSize: '40px' }}>{moodEmoji}</span>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
              You felt <strong style={{ color: 'var(--text)' }}>{moodLabel}</strong> most days this week
            </p>
          </div>
        )}

        {/* AI Suggestions */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
            💡 Suggestions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {improvements.map((tip, i) => (
              <div
                key={i}
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--bg)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: 'var(--text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{i + 1}.</span>
                {tip}
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
              🎯 Achievements
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {achievements.map((a, i) => (
                <span
                  key={i}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#EEEDFE',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#534AB7',
                  }}
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Start Next Week Strong 💪
          </button>
          <button
            onClick={handleExport}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: 'transparent',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Export Report
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WeeklyReviewModal;
