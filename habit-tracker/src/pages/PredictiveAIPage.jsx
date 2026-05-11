import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePlanContext } from '../context/PlanContext';
import { useHabitContext } from '../context/HabitContext';
import { format } from 'date-fns';

function PredictiveAIPage() {
  const planCtx = usePlanContext();
  const hasFeature = planCtx.hasFeature;
  const { habits } = useHabitContext();
  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [riskHabits, setRiskHabits] = useState([]);

  if (!hasFeature('predictiveAI')) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h2>🚫 Elite Feature</h2>
        <p>This feature is available for Elite users only.</p>
      </div>
    );
  }

  useEffect(() => {
    generatePrediction();
    analyzeHistory();
    detectRisks();
  }, [habits]);

  const generatePrediction = () => {
    const today = new Date().toISOString().split('T')[0];
    const completedToday = habits.filter(h => h.completionLog?.[today]).length;
    const totalHabits = habits.length || 1;
    const baseRate = Math.round((completedToday / totalHabits) * 100);
    
    const completionRate = habits.reduce((acc, habit) => {
      const days = Object.keys(habit.completionLog || {}).length;
      const streak = habit.currentStreak || 0;
      return acc + (streak > 0 ? Math.min(days / 7, 1) : 0);
    }, 0) / (habits.length || 1);

    const confidence = Math.round(70 + (completionRate * 30));
    const predictedScore = Math.round(baseRate * (confidence / 100));

    setPrediction({
      predicted: predictedScore,
      confidence,
      total: totalHabits,
      completed: completedToday,
      date: format(new Date(), 'EEEE, MMM d'),
    });
  };

  const analyzeHistory = () => {
    const weekHistory = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const completed = habits.filter(h => h.completionLog?.[dateStr]).length;
      weekHistory.push({
        date: format(date, 'EEE'),
        completed,
        total: habits.length,
      });
    }
    setHistory(weekHistory);
  };

  const detectRisks = () => {
    const risks = [];
    const dayOfWeek = new Date().getDay();
    
    habits.forEach(habit => {
      const weekdayFailures = {};
      for (let i = 0; i < 28; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
        if (!habit.completionLog?.[date.toISOString().split('T')[0]]) {
          weekdayFailures[dayName] = (weekdayFailures[dayName] || 0) + 1;
        }
      }
      
      const maxFailures = Math.max(...Object.values(weekdayFailures));
      if (maxFailures >= 3) {
        const riskDay = Object.entries(weekdayFailures).find(([, count]) => count === maxFailures)?.[0];
        risks.push({ habit, riskDay, failures: maxFailures });
      }
    });
    
    setRiskHabits(risks);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔮</div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
            Predictive AI Engine
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            AI predicts your daily success every morning
          </p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #BA7517, #f59e0b)',
          padding: '40px',
          borderRadius: '24px',
          color: 'white',
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
            {prediction?.date} Prediction
          </div>
          <div style={{ fontSize: '64px', fontWeight: 800 }}>
            {prediction?.completed || 0}/{prediction?.total || 0}
          </div>
          <div style={{ fontSize: '18px', opacity: 0.9, marginTop: '8px' }}>
            habits predicted to complete today
          </div>
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '12px',
            display: 'inline-block'
          }}>
            <span style={{ fontSize: '14px', opacity: 0.9 }}>AI Confidence: </span>
            <span style={{ fontWeight: 700, fontSize: '24px' }}>{prediction?.confidence}%</span>
          </div>
        </div>

        <div style={{
          background: 'var(--surface)',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          marginBottom: '32px'
        }}>
          <h3 style={{ marginBottom: '16px' }}>📈 7-Day Pattern</h3>
          <div style={{ display: 'flex', gap: '12px', height: '120px', alignItems: 'flex-end' }}>
            {history.map((day, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '100%',
                  height: `${(day.completed / (day.total || 1)) * 100}%`,
                  background: day.completed === day.total ? '#22c55e' : '#BA7517',
                  borderRadius: '8px 8px 0 0',
                  minHeight: '20px'
                }} />
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{day.date}</span>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{day.completed}/{day.total}</span>
              </div>
            ))}
          </div>
        </div>

        {riskHabits.length > 0 && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #ef4444'
          }}>
            <h3 style={{ marginBottom: '16px', color: '#ef4444' }}>⚠️ Risk Habits Detected</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {riskHabits.map((risk, idx) => (
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
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    ⚠️
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{risk.habit.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Fails consistently on {risk.riskDay}s ({risk.failures}x in 4 weeks)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{
          marginTop: '24px',
          padding: '20px',
          background: 'var(--surface)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            🔮 Predictions improve with more data. Keep tracking your habits!
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default PredictiveAIPage;