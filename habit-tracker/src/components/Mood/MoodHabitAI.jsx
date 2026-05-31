import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useMoodContext } from '../../context/MoodContext';
import { useHabits } from '../../hooks/useHabits';
import { getMoodInsights } from '../../utils/moodHabitAI';
import { predictCompletionLikelihood } from '../../utils/moodHabitAI';

const MoodHabitAI = () => {
  const { moodLog } = useMoodContext();
  const { habits } = useHabits();

  const insights = useMemo(() => {
    return getMoodInsights(habits, moodLog || {});
  }, [habits, moodLog]);

  const todayPrediction = useMemo(() => {
    if (habits.length === 0) return null;
    const randomHabit = habits[Math.floor(Math.random() * habits.length)];
    return predictCompletionLikelihood(randomHabit, moodLog || {});
  }, [habits, moodLog]);

  if (!moodLog || Object.keys(moodLog).length < 3) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '24px' }}>🤖</span>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
            AI Mood Insights
          </h3>
        </div>
        
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
          📊 Track your mood for 7+ days to unlock personalized AI insights about how your emotions affect habit completion!
        </p>

        <div style={{ 
          marginTop: '12px', 
          padding: '12px', 
          backgroundColor: 'var(--bg)', 
          borderRadius: '8px',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '24px' }}>🔒</span>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
            {moodLog ? Object.keys(moodLog).length : 0} / 7 days tracked
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid var(--border)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <span style={{ fontSize: '24px' }}>🤖</span>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
          AI Mood Insights
        </h3>
        <span style={{ 
          marginLeft: 'auto', 
          fontSize: '10px', 
          padding: '4px 8px', 
          backgroundColor: insights.recommendation.confidence === 'high' ? '#22c55e20' : 'var(--bg)',
          color: insights.recommendation.confidence === 'high' ? '#22c55e' : 'var(--text-secondary)',
          borderRadius: '4px',
        }}>
          {insights.recommendation.confidence} confidence
        </span>
      </div>

      <div style={{ 
        backgroundColor: 'var(--bg)', 
        borderRadius: '8px', 
        padding: '16px',
        marginBottom: '16px',
      }}>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text)' }}>
          {insights.recommendation.emoji} {insights.recommendation.message}
        </p>
        {insights.recommendation.advice && (
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
            💡 {insights.recommendation.advice}
          </p>
        )}
      </div>

      {todayPrediction && (
        <div style={{ 
          backgroundColor: '#8b5cf620', 
          borderRadius: '8px', 
          padding: '12px',
          border: '1px solid #8b5cf630',
        }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
            Today's Prediction:
          </p>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text)' }}>
            {todayPrediction.emoji} {todayPrediction.message}
          </p>
          {todayPrediction.basedOn && (
            <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#8b5cf6' }}>
              Based on: {todayPrediction.basedOn}
            </p>
          )}
        </div>
      )}

      {insights.correlation && Object.keys(insights.correlation).length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
            Habit-Mood Patterns:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {Object.values(insights.correlation).slice(0, 3).map((habit) => (
              <div 
                key={habit.habitName}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  fontSize: '12px',
                  color: 'var(--text)',
                }}
              >
                <span>{habit.habitIcon}</span>
                <span style={{ flex: 1 }}>{habit.habitName}</span>
                {habit.correlation?.bestMood && (
                  <span style={{ 
                    fontSize: '10px', 
                    padding: '2px 6px', 
                    backgroundColor: '#22c55e20', 
                    color: '#22c55e',
                    borderRadius: '4px',
                  }}>
                    {habit.correlation.bestMood.emoji} {habit.correlation.bestMood.percentage}%
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-secondary)' }}>
        📊 {moodLog ? Object.keys(moodLog).length : 0} days tracked
      </div>
    </motion.div>
  );
};

export default MoodHabitAI;