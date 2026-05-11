import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePlanContext } from '../context/PlanContext';
import { useHabitContext } from '../context/HabitContext';
import { useMoodContext } from '../context/MoodContext';

const LIFE_AREAS = [
  { id: 'health', name: 'Health & Fitness', icon: '💪', color: '#22c55e' },
  { id: 'career', name: 'Career & Work', icon: '💼', color: '#3b82f6' },
  { id: 'finance', name: 'Finance', icon: '💰', color: '#f59e0b' },
  { id: 'relationships', name: 'Relationships', icon: '❤️', color: '#ec4899' },
  { id: 'mindfulness', name: 'Mindfulness', icon: '🧘', color: '#8b5cf6' },
  { id: 'learning', name: 'Learning', icon: '📚', color: '#06b6d4' },
  { id: 'fun', name: 'Fun & Recreation', icon: '🎮', color: '#f97316' },
  { id: 'spirituality', name: 'Spirituality', icon: '✨', color: '#a855f7' },
];

function LifeOSDashboardPage() {
  const planCtx = usePlanContext();
  const hasFeature = planCtx.hasFeature;
  const { habits } = useHabitContext();
  const { moodLog } = useMoodContext();
  const [lifeOSScore, setLifeOSScore] = useState(0);
  const [areaScores, setAreaScores] = useState({});
  const [priorityActions, setPriorityActions] = useState([]);
  const [weeklyTrend, setWeeklyTrend] = useState([]);

  if (!hasFeature('lifeOSDashboard')) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h2>🚫 Elite Feature</h2>
        <p>This feature is available for Elite users only.</p>
      </div>
    );
  }

  useEffect(() => {
    calculateScores();
  }, [habits, moodLog]);

  const calculateScores = () => {
    const scores = {};
    const totalHabits = habits.length;
    
    LIFE_AREAS.forEach(area => {
      const areaHabits = habits.filter(h => h.category === area.id);
      if (areaHabits.length === 0) {
        scores[area.id] = { score: 0, habits: 0, completed: 0 };
      } else {
        const completed = areaHabits.filter(h => h.completionLog?.[new Date().toISOString().split('T')[0]]).length;
        const score = Math.round((completed / areaHabits.length) * 100);
        scores[area.id] = { score, habits: areaHabits.length, completed };
      }
    });

    setAreaScores(scores);
    
    const totalScore = Object.values(scores).reduce((sum, s) => sum + s.score, 0);
    const avgScore = totalHabits > 0 ? Math.round(totalScore / LIFE_AREAS.length) : 0;
    setLifeOSScore(avgScore);

    const actions = [];
    const today = new Date().toISOString().split('T')[0];
    habits.forEach(habit => {
      if (!habit.completionLog?.[today]) {
        actions.push({ habit, area: LIFE_AREAS.find(a => a.id === habit.category) });
      }
    });
    setPriorityActions(actions.slice(0, 3));

    const trend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayCompleted = habits.filter(h => h.completionLog?.[dateStr]).length;
      const total = habits.length || 1;
      trend.push({ date: date.getDay(), score: Math.round((dayCompleted / total) * 100) });
    }
    setWeeklyTrend(trend);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🖥️</div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
            Life OS Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Your complete life overview in one screen
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #BA7517, #f59e0b)',
            padding: '32px',
            borderRadius: '24px',
            color: 'white',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
              Life OS Score
            </div>
            <div style={{ fontSize: '72px', fontWeight: 800, lineHeight: 1 }}>
              {lifeOSScore}
              <span style={{ fontSize: '24px', opacity: 0.8 }}>/100</span>
            </div>
            <div style={{ marginTop: '16px', fontSize: '14px', opacity: 0.9 }}>
              {habits.length} active habits tracked
            </div>
          </div>

          <div style={{
            background: 'var(--surface)',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid var(--border)'
          }}>
            <h3 style={{ marginBottom: '16px' }}>📊 Weekly Trend</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '100px' }}>
              {weeklyTrend.map((day, idx) => (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '100%',
                    height: `${day.score}%`,
                    background: getScoreColor(day.score),
                    borderRadius: '4px',
                    minHeight: '10px'
                  }} />
                  <span style={{ fontSize: '10px', marginTop: '4px', color: 'var(--text-secondary)' }}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'][day.date]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h2 style={{ marginBottom: '24px' }}>8 Life Areas</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {LIFE_AREAS.map((area) => {
            const data = areaScores[area.id] || { score: 0, habits: 0, completed: 0 };
            return (
              <motion.div
                key={area.id}
                whileHover={{ scale: 1.02 }}
                style={{
                  background: 'var(--surface)',
                  padding: '20px',
                  borderRadius: '16px',
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '28px' }}>{area.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{area.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {data.habits} habits
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    flex: 1,
                    height: '8px',
                    background: 'var(--border)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${data.score}%`,
                      height: '100%',
                      background: area.color,
                      borderRadius: '4px'
                    }} />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '18px', color: area.color }}>
                    {data.score}%
                  </span>
                </div>
                {data.completed > 0 && (
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                    {data.completed}/{data.habits} completed today
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {priorityActions.length > 0 && (
          <div style={{
            background: 'rgba(186, 117, 23, 0.1)',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #BA7517'
          }}>
            <h3 style={{ marginBottom: '16px' }}>🎯 Priority Actions Today</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {priorityActions.map((action, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: 'var(--surface)',
                    borderRadius: '12px'
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{action.area?.icon || '📌'}</span>
                  <span style={{ fontWeight: 500 }}>{action.habit.name}</span>
                  <span style={{
                    marginLeft: 'auto',
                    padding: '4px 12px',
                    background: '#BA7517',
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 600
                  }}>
                    Do Now
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default LifeOSDashboardPage;