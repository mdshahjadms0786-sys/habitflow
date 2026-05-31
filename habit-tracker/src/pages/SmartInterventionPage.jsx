import { useMemo, useState } from 'react';
import { usePlanContext } from '../context/PlanContext';
import { useHabitContext } from '../context/HabitContext';
import { format, subDays } from 'date-fns';
import toast from 'react-hot-toast';

function SmartInterventionPage() {
  const planCtx = usePlanContext();
  const hasFeature = planCtx.hasFeature;
  const { habits, editHabit } = useHabitContext();
  const [dismissedInterventions, setDismissedInterventions] = useState([]);

  const moveHabitTime = (habit) => {
    const times = ['morning', 'afternoon', 'evening', 'night'];
    const currentIndex = times.indexOf(habit.time);
    const nextTime = times[(currentIndex + 1) % times.length];
    editHabit({ ...habit, time: nextTime });
    toast.success(`Moved "${habit.name}" to ${nextTime}`);
  };

  const adjustDifficulty = (habit) => {
    const difficulties = ['easy', 'medium', 'hard', 'extreme'];
    const currentIndex = difficulties.indexOf(habit.difficulty);
    if (currentIndex > 0) {
      const newDifficulty = difficulties[currentIndex - 1];
      editHabit({ ...habit, difficulty: newDifficulty });
      toast.success(`Adjusted "${habit.name}" to ${newDifficulty}`);
    }
  };

  const interventions = useMemo(() => {
    const analyzeWeeklyPattern = (habit) => {
      const failDays = {};
      for (let i = 0; i < 28; i++) {
        const date = subDays(new Date(), i);
        const dateStr = format(date, 'yyyy-MM-dd');
        if (!habit.completionLog?.[dateStr]) {
          const dayName = format(date, 'EEEE');
          failDays[dayName] = (failDays[dayName] || 0) + 1;
        }
      }
      const entries = Object.entries(failDays);
      const maxFailures = Math.max(...entries.map(([, count]) => count));
      if (maxFailures >= 3) {
        const failDay = entries.find(([, count]) => count === maxFailures)?.[0];
        return { failDays: [failDay], failCount: maxFailures };
      }
      return { failDays: [], failCount: 0 };
    };

    const analyzeStreak = (habit) => {
      const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
      if (!habit.completionLog?.[yesterday] && habit.currentStreak > 0) {
        return {
          risk: true,
          message: `"${habit.name}" streak at risk! You missed yesterday.`
        };
      }
      return { risk: false };
    };

    const detected = [];
    habits.forEach(habit => {
      const weeklyPattern = analyzeWeeklyPattern(habit);
      if (weeklyPattern.failDays.length > 0) {
        detected.push({
          id: `pattern-${habit.id}-${weeklyPattern.failDays[0]}`,
          type: 'pattern',
          habit,
          message: `You failed last ${weeklyPattern.failCount} ${weeklyPattern.failDays[0]}s`,
          suggestion: `Move "${habit.name}" to a different time?`,
          action: () => moveHabitTime(habit),
          pattern: weeklyPattern,
        });
      }

      const streakAnalysis = analyzeStreak(habit);
      if (streakAnalysis.risk) {
        detected.push({
          id: `streak-${habit.id}`,
          type: 'streak',
          habit,
          message: streakAnalysis.message,
          suggestion: 'Use a Streak Freeze to protect your streak!',
          action: () => {
            toast.success('Streak Freeze activated! ⏸️');
          },
        });
      }

      if (habit.difficulty === 'extreme' && habit.currentStreak < 7) {
        detected.push({
          id: `difficulty-${habit.id}`,
          type: 'difficulty',
          habit,
          message: `"${habit.name}" might be too extreme`,
          suggestion: 'Want to adjust difficulty?',
          action: () => adjustDifficulty(habit),
        });
      }
    });
    return detected.filter(item => !dismissedInterventions.includes(item.id));
  }, [habits, editHabit, dismissedInterventions]);

  if (!hasFeature('smartIntervention')) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h2>🚫 Elite Feature</h2>
        <p>This feature is available for Elite users only.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <div>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚨</div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
            Smart Intervention System
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            AI proactively prevents failures before they happen
          </p>
        </div>

        {interventions.length === 0 ? (
          <div style={{
            background: 'var(--surface)',
            padding: '48px',
            borderRadius: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎉</div>
            <h2>No Interventions Needed!</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Your habits are on track. Keep up the great work!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {interventions.map((intervention, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--surface)',
                  padding: '24px',
                  borderRadius: '16px',
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    flexShrink: 0
                  }}>
                    🚨
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      {intervention.habit.name}
                    </div>
                    <div style={{ fontWeight: 600, marginBottom: '8px' }}>
                      {intervention.message}
                    </div>
                    <div style={{
                      padding: '12px',
                      background: 'rgba(186, 117, 23, 0.1)',
                      borderRadius: '8px',
                      marginBottom: '12px'
                    }}>
                      <span style={{ fontSize: '14px' }}>💡 {intervention.suggestion}</span>
                    </div>
                    <button
                      onClick={() => {
                        intervention.action();
                        setDismissedInterventions(prev => [...prev, intervention.id]);
                      }}
                      style={{
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #BA7517, #f59e0b)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Apply Fix
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{
          marginTop: '32px',
          padding: '20px',
          background: 'var(--surface)',
          borderRadius: '12px',
          border: '1px solid var(--border)'
        }}>
          <h3 style={{ marginBottom: '16px' }}>📊 Pattern Analysis</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            The Smart Intervention System analyzes your last 28 days to detect patterns
            and prevent failures before they happen. It automatically:
          </p>
          <ul style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '12px', paddingLeft: '20px' }}>
            <li>Detects recurring failure patterns on specific days</li>
            <li>Monitors streak risks in real-time</li>
            <li>Adjusts habit difficulty for better sustainability</li>
            <li>Suggests optimal timing for each habit</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SmartInterventionPage;
