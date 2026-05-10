import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useHabitContext } from '../context/HabitContext';
import { useMoodContext } from '../context/MoodContext';
import AICoachChat from '../components/AICoach/AICoachChat';
import WeeklyInsightCard from '../components/AICoach/WeeklyInsightCard';
import OllamaSetup from '../components/AICoach/OllamaSetup';
import { checkOllamaStatus } from '../utils/ollamaService';
import { getWeekCompletions } from '../utils/streakUtils';
import { getTodayISO } from '../utils/dateUtils';
import LockedFeature from '../components/UI/LockedFeature';

const models = ['llama3', 'mistral', 'llama2', 'phi'];

const AICoachPage = () => {
  const { habits } = useHabitContext();
  const { moodLog } = useMoodContext();
  const [ollamaStatus, setOllamaStatus] = useState({ isRunning: false, models: [] });
  const [selectedModel, setSelectedModel] = useState('llama3');
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('ht_ollama_model');
    if (saved && models.includes(saved)) {
      setSelectedModel(saved);
    }
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    setIsCheckingStatus(true);
    const status = await checkOllamaStatus();
    setOllamaStatus(status);
    setIsCheckingStatus(false);
  };

  const handleModelChange = (e) => {
    const model = e.target.value;
    setSelectedModel(model);
    localStorage.setItem('ht_ollama_model', model);
  };

  const safeHabits = (habits || []).filter(h => h != null);
  const today = getTodayISO();

  let completedThisWeek = 0;
  let totalPossible = 0;
  safeHabits.forEach(h => {
    const wc = getWeekCompletions(h.completionLog || {});
    Object.values(wc).forEach(v => { if (v) completedThisWeek++; });
    totalPossible += 7;
  });
  const completionPct = totalPossible > 0 ? Math.round((completedThisWeek / totalPossible) * 100) : 0;

  const moodValues = Object.values(moodLog || {});
  const avgMood = moodValues.length > 0 
    ? (moodValues.reduce((a, b) => a + b, 0) / moodValues.length).toFixed(1)
    : 0;
  const moodLabel = avgMood >= 4 ? '😊 Great' : avgMood >= 3 ? '😐 Okay' : avgMood > 0 ? '😔 Low' : '—';

  const bestHabit = safeHabits.reduce((best, h) => 
    ((h?.currentStreak || 0) > (best?.currentStreak || 0) ? h : best), null);

  const daysTracked = Object.keys(moodLog || {}).length;

  return (
    <LockedFeature featureName="aiCoach" requiredPlan="pro">
      <div style={{ padding: '24px', paddingBottom: '80px' }}>
        <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '24px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>🤖</span>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: 'var(--text)' }}>
              AI Coach
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <select
              value={selectedModel}
              onChange={handleModelChange}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                color: 'var(--text)',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              {models.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: ollamaStatus.isRunning ? '#22c55e' : '#ef4444' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {ollamaStatus.isRunning ? 'Ollama Connected' : 'Ollama Offline'}
              </span>
            </div>
          </div>
        </div>
      </motion.header>

      {!ollamaStatus.isRunning ? (
        <OllamaSetup onCheckAgain={checkStatus} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
          {/* Main */}
          <div>
            <WeeklyInsightCard habits={safeHabits} moodLog={moodLog || {}} />
            <div style={{ marginTop: '24px' }}>
              <AICoachChat habits={safeHabits} moodLog={moodLog || {}} ollamaModel={selectedModel} />
            </div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {/* Stats Card */}
            <div style={{ backgroundColor: 'var(--surface)', borderRadius: '16px', padding: '20px', border: '1px solid var(--border)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
                📊 Your Stats
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>This week completion</p>
                  <p style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: 'var(--text)' }}>{completionPct}%</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Average mood</p>
                  <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>{moodLabel}</p>
                </div>
                {bestHabit && (
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Best habit</p>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: 'var(--text)' }}>
                      {bestHabit.icon} {bestHabit.name}
                      <span style={{ color: 'var(--text-secondary)', fontWeight: '400' }}> ({bestHabit.currentStreak} days)</span>
                    </p>
                  </div>
                )}
                <div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Total habits</p>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--text)' }}>{safeHabits.length}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Days tracked</p>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--text)' }}>{daysTracked}</p>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div style={{ backgroundColor: 'var(--surface)', borderRadius: '16px', padding: '20px', border: '1px solid var(--border)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
                💡 Tips
              </h3>
              <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Ask specific questions for better answers</li>
                <li style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Check in daily for accurate insights</li>
                <li style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Use quick buttons for instant analysis</li>
              </ul>
            </div>
          </motion.div>
        </div>
      )}
      </div>
    </LockedFeature>
  );
};

export default AICoachPage;