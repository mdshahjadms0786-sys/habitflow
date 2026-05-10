import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWeeklyCoachingPrompt, saveCoachingSession, generateFallbackCoaching, COACH_PERSONALITIES, getCoachPersonality, saveCoachPersonality, getWeekCoachingStats } from '../../utils/aiCoachingUtils';
import { useMoodContext } from '../../context/MoodContext';
import { useHabitContext } from '../../context/HabitContext';
import toast from 'react-hot-toast';
import { loadPoints, addPoints as addPointsUtil } from '../../utils/pointsUtils';

const CoachingSessionModal = ({ isOpen, onClose, habits, onSessionSaved }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [rating, setRating] = useState(0);
  const [nextWeekFocus, setNextWeekFocus] = useState('');
  const [personality, setPersonality] = useState(getCoachPersonality());
  const [expandedCards, setExpandedCards] = useState({});
  const { moodLog } = useMoodContext();
  const { ollamaModel } = useHabitContext();
  
  const stats = getWeekCoachingStats(habits);
  
  const getBestHabit = () => {
    if (!habits || habits.length === 0) return null;
    const habitStats = habits.map(h => {
      let weekCompletions = 0;
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        if (h.completionLog?.[dateStr]?.completed) weekCompletions++;
      }
      return { name: h.name, completions: weekCompletions, rate: Math.round((weekCompletions / 7) * 100) };
    });
    return habitStats.sort((a, b) => b.rate - a.rate)[0];
  };
  
  const getWorstHabit = () => {
    if (!habits || habits.length === 0) return null;
    const habitStats = habits.map(h => {
      let weekCompletions = 0;
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        if (h.completionLog?.[dateStr]?.completed) weekCompletions++;
      }
      return { name: h.name, completions: weekCompletions, rate: Math.round((weekCompletions / 7) * 100) };
    });
    return habitStats.sort((a, b) => a.rate - b.rate)[0];
  };
  
  const getCurrentStreak = () => {
    if (!habits || habits.length === 0) return 0;
    return Math.max(...habits.map(h => h.currentStreak || 0));
  };
  
  const getWeekMoodAverage = () => {
    const moodValues = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      if (moodLog[dateStr]) {
        const mood = moodLog[dateStr];
        moodValues.push(typeof mood === 'number' ? mood : mood?.score || 0);
      }
    }
    if (moodValues.length === 0) return null;
    return (moodValues.reduce((a, b) => a + b, 0) / moodValues.length).toFixed(1);
  };
  
  const bestHabit = getBestHabit();
  const worstHabit = getWorstHabit();
  const currentStreak = getCurrentStreak();
  const weekMood = getWeekMoodAverage();
  
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setAiResponse('');
      setRating(0);
      setNextWeekFocus('');
    }
  }, [isOpen]);
  
  const handleStartAnalysis = async () => {
    setStep(2);
    setIsLoading(true);
    
    try {
      const prompt = getWeeklyCoachingPrompt(habits, moodLog, stats);
      
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: ollamaModel || 'llama3',
          prompt,
          stream: false
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setAiResponse(data.response);
      } else {
        setAiResponse(generateFallbackCoaching(habits, stats));
      }
    } catch (error) {
      console.log('Ollama not available, using fallback');
      setAiResponse(generateFallbackCoaching(habits, stats));
    }
    
    setIsLoading(false);
  };
  
  const handleSaveSession = () => {
    if (rating === 0) {
      toast.error('Please rate the session');
      return;
    }
    
    saveCoachingSession({
      date: new Date().toISOString(),
      weekData: stats,
      aiResponse,
      userRating: rating,
      nextWeekFocus,
      personality
    });
    
    addPointsUtil('coachingSession') || 0;
    const currentPoints = loadPoints();
    localStorage.setItem('ht_points', currentPoints + 50);
    
    toast.success('Coaching session saved! +50 pts 🤖');
    if (onSessionSaved) onSessionSaved();
    onClose();
  };
  
  const parseResponse = (text) => {
    const sections = {
      whatYouDidWell: '',
      areasToImprove: '',
      yourPlan: '',
      keyInsight: ''
    };
    
    const patterns = [
      { key: 'whatYouDidWell', patterns: ['what you did well', 'wins', 'did well', 'good job', 'great', 'excellent'] },
      { key: 'areasToImprove', patterns: ['areas to improve', 'needs improvement', 'improve', 'work on', 'focus on'] },
      { key: 'yourPlan', patterns: ['your plan', 'plan for next', 'next week', 'action steps', 'steps to take'] },
      { key: 'keyInsight', patterns: ['key insight', 'insight', 'takeaway', 'remember'] }
    ];
    
    const lines = text.split('\n');
    let currentKey = null;
    
    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      
      for (const p of patterns) {
        if (p.patterns.some(pat => lowerLine.includes(pat))) {
          currentKey = p.key;
          sections[currentKey] += line + '\n';
          return;
        }
      }
      
      if (currentKey && line.trim()) {
        sections[currentKey] += line + '\n';
      }
    });
    
    return sections;
  };
  
  const parsed = aiResponse ? parseResponse(aiResponse) : null;
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '24px',
          padding: '32px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>
            Weekly Coaching 🤖
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            ✕
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {Object.entries(COACH_PERSONALITIES).map(([key, p]) => (
            <button
              key={key}
              onClick={() => { setPersonality(key); saveCoachPersonality(key); }}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: personality === key ? '2px solid var(--primary)' : '1px solid var(--border)',
                backgroundColor: personality === key ? 'var(--primary-light)' : 'var(--bg)',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: personality === key ? '600' : '400'
              }}
            >
              {p.icon} {p.name}
            </button>
          ))}
        </div>
        
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '48px',
                  fontWeight: '700',
                  color: 'var(--primary)',
                  border: '8px solid var(--primary)'
                }}>
                  {stats.percentage}%
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>Today's overall completion</p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
                <div style={{ backgroundColor: 'var(--bg)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700' }}>{stats.completed}/{stats.total}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>This Week</div>
                </div>
                <div style={{ backgroundColor: 'var(--bg)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700' }}>🔥 {currentStreak}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Streak</div>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
                <div style={{ backgroundColor: '#22c55e1a', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#22c55e' }}>Best Habit ⬆</div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>{bestHabit?.name || 'N/A'}</div>
                  <div style={{ fontSize: '12px', color: '#22c55e' }}>{bestHabit?.rate || 0}%</div>
                </div>
                <div style={{ backgroundColor: '#f59e0b1a', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#f59e0b' }}>Needs Work ⬇</div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>{worstHabit?.name || 'N/A'}</div>
                  <div style={{ fontSize: '12px', color: '#f59e0b' }}>{worstHabit?.rate || 0}%</div>
                </div>
              </div>
              
              <div style={{ backgroundColor: 'var(--bg)', padding: '16px', borderRadius: '12px', textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Mood Average This Week</div>
                <div style={{ fontSize: '24px', fontWeight: '700' }}>{weekMood ? `${weekMood}/5` : 'N/A'}</div>
              </div>
               
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartAnalysis}
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                Share with AI Coach →
              </motion.button>
            </motion.div>
          )}
          
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
                  <p>Your AI coach is analyzing your week...</p>
                  <div style={{ 
                    width: '200px', 
                    height: '4px', 
                    backgroundColor: 'var(--border)', 
                    margin: '20px auto',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <motion.div
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      style={{
                        width: '50%',
                        height: '100%',
                        backgroundColor: 'var(--primary)'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
                    <motion.div
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      style={{ height: '60px', backgroundColor: 'var(--bg)', borderRadius: '8px' }}
                    />
                    <motion.div
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                      style={{ height: '60px', backgroundColor: 'var(--bg)', borderRadius: '8px' }}
                    />
                    <motion.div
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                      style={{ height: '60px', backgroundColor: 'var(--bg)', borderRadius: '8px' }}
                    />
                  </div>
                </div>
              ) : parsed ? (
                <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                  {parsed.whatYouDidWell && (
                    <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#22c55e1a', borderRadius: '12px', borderLeft: '4px solid #22c55e' }}>
                      <h4 style={{ color: '#22c55e', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>✅ What you did well</h4>
                      <p style={{ fontSize: '14px', whiteSpace: 'pre-line' }}>{parsed.whatYouDidWell}</p>
                    </div>
                  )}
                  {parsed.areasToImprove && (
                    <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#3b82f61a', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
                      <h4 style={{ color: '#3b82f6', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>📈 Areas to improve</h4>
                      <p style={{ fontSize: '14px', whiteSpace: 'pre-line' }}>{parsed.areasToImprove}</p>
                    </div>
                  )}
                  {parsed.yourPlan && (
                    <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#a855f71a', borderRadius: '12px', borderLeft: '4px solid #a855f7' }}>
                      <h4 style={{ color: '#a855f7', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>🎯 Your plan for next week</h4>
                      <p style={{ fontSize: '14px', whiteSpace: 'pre-line' }}>{parsed.yourPlan}</p>
                    </div>
                  )}
                  {parsed.keyInsight && (
                    <div style={{ 
                      marginBottom: '16px', 
                      padding: '16px', 
                      backgroundColor: '#f59e0b1a', 
                      borderRadius: '12px',
                      borderLeft: '4px solid #f59e0b'
                    }}>
                      <h4 style={{ color: '#f59e0b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>💡 Key insight</h4>
                      <p style={{ fontSize: '14px' }}>{parsed.keyInsight}</p>
                    </div>
                  )}
                </div>
              ) : null}
              
              {!isLoading && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(3)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '16px',
                    fontWeight: '600',
                    backgroundColor: 'var(--primary)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    marginTop: '20px'
                  }}
                >
                  Rate & Save Session →
                </motion.button>
              )}
            </motion.div>
          )}
          
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <p style={{ marginBottom: '16px' }}>How helpful was this session?</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '32px',
                        cursor: 'pointer'
                      }}
                    >
                      {star <= rating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Set Next Week's Focus:
                </label>
                <textarea
                  value={nextWeekFocus}
                  onChange={(e) => setNextWeekFocus(e.target.value)}
                  placeholder="What do you want to focus on next week?"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--text)',
                    fontSize: '14px',
                    minHeight: '80px',
                    resize: 'none'
                  }}
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveSession}
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                Save Session ✓
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default CoachingSessionModal;