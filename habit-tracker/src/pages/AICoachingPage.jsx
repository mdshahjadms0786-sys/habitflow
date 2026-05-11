import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabitContext } from '../context/HabitContext';
import { useMoodContext } from '../context/MoodContext';
import { hasFeature } from '../utils/planUtils';
import { checkOllamaStatus, streamCompletion } from '../utils/ollamaService';
import { 
  COACH_PERSONALITIES, 
  getCoachPersonality, 
  saveCoachPersonality, 
  loadCoachingSessions,
  saveCoachingSession,
  getWeekCoachingStats,
  analyzeProgressTrend,
  generateFallbackCoaching
} from '../utils/aiCoachingUtils';
import { getTodayISO } from '../utils/dateUtils';
import { getWeekCompletions } from '../utils/streakUtils';
import { toast } from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const PERSONALITY_KEYS = Object.keys(COACH_PERSONALITIES);

const getEliteSystemPrompt = (personality) => {
  const personalities = {
    strict: `You are a strict, no-nonsense behavioral coach.
Be direct and honest about failures. 
Push the user to their limits.
No sugarcoating. Give hard truths.
Reference: David Goggins style coaching.`,
    
    motivational: `You are an enthusiastic motivational coach.
Celebrate wins, big and small.
Use energy and excitement.
Find the positive in every situation.
Reference: Tony Robbins style coaching.`,
    
    analytical: `You are a data-driven behavioral scientist.
Reference specific numbers and patterns.
Use psychological research and studies.
Cite: BJ Fogg, James Clear, Charles Duhigg.
Be precise and evidence-based.`,
    
    gentle: `You are a compassionate and empathetic life coach.
Create a safe, non-judgmental space.
Focus on understanding, not performance.
Use trauma-informed coaching principles.
Be warm, patient, and encouraging.`
  };
  
  return `${personalities[personality]}

YOUR COACHING STRUCTURE (always follow this):

## ✅ What You Did Well This Week
[2-3 specific wins based on data]

## 📈 Areas That Need Attention  
[2-3 specific improvements with reasons]

## 🔍 Pattern I Noticed
[1 key behavioral pattern from the data]

## 🎯 Your Strategic Plan For Next Week
[3 specific, actionable steps]

## 💡 Key Insight
[1 profound insight about their habits/behavior]

Keep total response under 400 words.
Be specific — reference actual habit names and numbers.
End with one powerful closing statement.`;
};

const buildEliteContext = (habits, moodLog) => {
  const safeHabits = (habits || []).filter(h => h != null);
  const today = getTodayISO();
  
  const getWeeklyRate = (habit) => {
    const wc = getWeekCompletions(habit.completionLog || {});
    const completed = Object.values(wc).filter(v => v).length;
    return Math.round((completed / 7) * 100);
  };
  
  const getLast4WeeksRate = (habit) => {
    const rates = [];
    for (let w = 0; w < 4; w++) {
      let weekCompleted = 0;
      let weekTotal = 0;
      for (let d = 0; d < 7; d++) {
        const date = new Date();
        date.setDate(date.getDate() - (w * 7 + d));
        const dateStr = date.toISOString().split('T')[0];
        if (habit.completionLog?.[dateStr]) {
          weekCompleted++;
        }
        weekTotal++;
      }
      rates.push(weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0);
    }
    return rates;
  };
  
  const getAverageMood = (ml) => {
    const values = Object.values(ml || {}).filter(v => typeof v === 'number');
    return values.length > 0 
      ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
      : 'N/A';
  };
  
  const findWeakDays = (h) => {
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    const dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    safeHabits.forEach(habit => {
      Object.keys(habit.completionLog || {}).forEach(dateStr => {
        const day = new Date(dateStr).getDay();
        dayCounts[day]++;
      });
    });
    const max = Math.max(...dayCounts);
    return dayCounts.map((count, idx) => ({ day: dayLabels[idx], count })).sort((a, b) => a.count - b.count).slice(0, 2).map(d => d.day);
  };
  
  const findStrongDays = (h) => {
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    const dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    safeHabits.forEach(habit => {
      Object.keys(habit.completionLog || {}).forEach(dateStr => {
        const day = new Date(dateStr).getDay();
        dayCounts[day]++;
      });
    });
    return dayCounts.map((count, idx) => ({ day: dayLabels[idx], count })).sort((a, b) => b.count - a.count).slice(0, 2).map(d => d.day);
  };
  
  const last4Weeks = safeHabits.length > 0 
    ? getLast4WeeksRate(safeHabits[0]).reverse()
    : [0, 0, 0, 0];
  
  const trend = last4Weeks.length >= 2 
    ? last4Weeks[last4Weeks.length - 1] - last4Weeks[0]
    : 0;
  
  const weakDays = findWeakDays(safeHabits);
  const strongDays = findStrongDays(safeHabits);
  const avgMood = getAverageMood(moodLog);
  
  return `
COMPLETE USER DATA FOR COACHING:

=== 4-WEEK PERFORMANCE ===
Week 1: ${last4Weeks[0]}% completion
Week 2: ${last4Weeks[1]}% completion
Week 3: ${last4Weeks[2]}% completion  
Week 4 (this week): ${last4Weeks[3]}% completion
Trend: ${trend > 0 ? 'Improving ↑' : trend < 0 ? 'Declining ↓' : 'Stable →'}

=== HABIT DETAILS ===
${safeHabits.map(h => `
- ${h.name}: 
  Category: ${h.category || 'General'}
  Difficulty: ${h.difficulty || 'Medium'}
  Current streak: ${h.currentStreak || 0} days
  This week: ${getWeeklyRate(h)}%
  Best streak ever: ${h.longestStreak || 0} days
`).join('')}

=== PATTERNS DETECTED ===
Strongest days: ${strongDays.join(', ')}
Weakest days: ${weakDays.join(', ')}
Mood average: ${avgMood}/5

=== COMPLETION DATA ===
Total habits: ${safeHabits.length}
  `;
};

const callEliteAI = async (context, personality, onChunk, onDone, onError) => {
  const model = localStorage.getItem('ht_ollama_model') || 'llama3';
  const systemPrompt = getEliteSystemPrompt(personality);
  
  const fullPrompt = `${systemPrompt}

${context}

Begin your coaching session now:`;

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: fullPrompt,
        stream: true,
        options: {
          temperature: 0.7,
          top_p: 0.9
        }
      })
    });
    
    if (!response.ok) throw new Error('Ollama offline');
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(Boolean);
      
      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.response) onChunk(json.response);
          if (json.done) onDone();
        } catch {}
      }
    }
  } catch (error) {
    onError(error);
  }
};

const generateEliteFallback = (context, habits, personality, onChunk, onDone) => {
  const safeHabits = (habits || []).filter(h => h != null);
  
  let weeklyCompleted = 0;
  let weeklyTotal = 0;
  safeHabits.forEach(h => {
    const wc = getWeekCompletions(h.completionLog || {});
    Object.values(wc).forEach(v => { if (v) weeklyCompleted++; });
    weeklyTotal += 7;
  });
  const avgRate = weeklyTotal > 0 ? Math.round((weeklyCompleted / weeklyTotal) * 100) : 50;
  
  const fallbacks = {
    strict: `## ✅ What You Did Well
You showed up. That's the minimum — but it counts.
Your ${avgRate}% completion shows you're trying.

## 📈 Areas That Need Attention
${avgRate < 70 ? "Your completion rate is below acceptable. No excuses." : "Push for 90%+ next week."}

## 🔍 Pattern I Noticed  
${avgRate < 50 ? "Declining trend. Unacceptable. Fix it now." : "You're doing enough to not fall behind."}

## 🎯 Strategic Plan For Next Week
1. Complete your top 3 habits EVERY single day — no exceptions
2. Schedule habits like meetings — block the time
3. Track every miss — understand why, then eliminate it

## 💡 Key Insight
Discipline is doing it when you don't feel like it.
**Do the work.**`,

    motivational: `## ✅ What You Did Well
Amazing work this week! You showed up with ${avgRate}% completion!
Every step forward counts — even this data shows progress!

## 📈 Areas To Level Up
I see so much potential in you!
Let's channel that energy into next week being even better.

## 🔍 Pattern I Noticed
You keep showing up — that's what matters most.

## 🎯 Your Winning Plan For Next Week
1. Celebrate every single habit you complete — build positive momentum
2. Start your day with your EASIEST habit for instant confidence
3. Tell someone your habit goal — accountability multiplies results

## 💡 Key Insight
**You've got this — let's make next week LEGENDARY! 🚀**`,

    analytical: `## ✅ What You Did Well
Completion rate: ${avgRate}% — ${avgRate > 70 ? 'above average (benchmark: 65%)' : 'approaching baseline'}

## 📈 Areas That Need Attention
${avgRate < 80 ? `Gap to target: ${80 - avgRate}% improvement needed` : 'Optimization phase'}

## 🔍 Pattern I Noticed
Research shows habit consistency follows a formation curve.

## 🎯 Data-Driven Plan For Next Week
1. Apply implementation intentions: "When X happens, I will do Y"
2. Reduce friction for lowest-performing habits
3. Use habit stacking with highest-performing habits as anchors

## 💡 Key Insight
**Optimize the system, not the willpower.**`,

    gentle: `## ✅ What You Did Well
I want you to truly acknowledge something: you showed up this week.
With ${avgRate}% completion, you did your best — and that matters deeply.

## 📈 Areas To Nurture
Some habits need a little more love and attention.
That's not failure — it's information about what needs care.

## 🔍 Pattern I Noticed
Every day you show up is a win. Be proud of that.

## 🎯 A Gentle Plan For Next Week
1. Choose self-compassion first — harsh self-talk reduces performance
2. Focus on 1-2 habits that bring you joy, not obligation
3. Rest is productive — schedule recovery as intentionally as habits

## 💡 Key Insight
Be as kind to yourself as you would be to someone you love.
**Progress is progress, no matter how small. 💚**`
  };
  
  const response = fallbacks[personality] || fallbacks.motivational;
  
  const words = response.split(' ');
  let i = 0;
  const interval = setInterval(() => {
    if (i < words.length) {
      onChunk(words[i] + ' ');
      i++;
    } else {
      clearInterval(interval);
      onDone();
    }
  }, 30);
};

const UpgradePrompt = () => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
    <h2 style={{ margin: '0 0 12px 0', color: 'var(--text)' }}>AI Life Coach Pro</h2>
    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
      Upgrade to Elite to access advanced AI coaching sessions!
    </p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        padding: '12px 24px',
        borderRadius: '24px',
        backgroundColor: '#BA7517',
        color: '#ffffff',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
      }}
      onClick={() => window.location.href = '/settings?upgrade=elite'}
    >
      Upgrade to Elite 👑
    </motion.button>
  </div>
);

const CoachingSessionModal = ({ isOpen, onClose, habits, onSessionSaved, personality }) => {
  const [step, setStep] = useState(1);
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [focus, setFocus] = useState('');
  const [sections, setSections] = useState({});
  const { moodLog } = useMoodContext();
  const [ollamaStatus, setOllamaStatus] = useState({ isRunning: false });
  
  useEffect(() => {
    if (isOpen) {
      checkOllamaStatus().then(setOllamaStatus);
    }
  }, [isOpen]);
  
  const weeklyStats = getWeekCoachingStats(habits || []);
  
  useEffect(() => {
    if (step === 2 && isOpen) {
      runAIAnalysis();
    }
  }, [step, isOpen]);
  
  const runAIAnalysis = async () => {
    setIsLoading(true);
    setAiResponse('');
    setSections({});
    
    const context = buildEliteContext(habits, moodLog);
    const pers = personality || getCoachPersonality();
    
    try {
      await callEliteAI(
        context,
        pers,
        (chunk) => {
          setAiResponse(prev => prev + chunk);
          parseSections(prev + chunk);
        },
        () => {
          setIsLoading(false);
          setStep(3);
        },
        (error) => {
          console.error('AI error:', error);
          generateEliteFallback(context, habits, pers, (chunk) => {
            setAiResponse(prev => prev + chunk);
            parseSections(prev + chunk);
          }, () => {
            setIsLoading(false);
            setStep(3);
          });
        }
      );
    } catch {
      generateEliteFallback(context, habits, pers, (chunk) => {
        setAiResponse(prev => prev + chunk);
        parseSections(prev + chunk);
      }, () => {
        setIsLoading(false);
        setStep(3);
      });
    }
  };
  
  const parseSections = (response) => {
    const sectionRegex = /## (✅|📈|🔍|🎯|💡) ([^\n]+)\n([\s\S]*?)(?=## |$)/g;
    const parsed = {};
    let match;
    while ((match = sectionRegex.exec(response)) !== null) {
      parsed[match[2].trim()] = match[3].trim();
    }
    setSections(parsed);
  };
  
  const saveSession = () => {
    const session = {
      date: new Date().toISOString(),
      weekData: {
        percentage: weeklyStats.percentage,
        completed: weeklyStats.completed,
        total: weeklyStats.total
      },
      aiResponse,
      personality: personality || getCoachPersonality(),
      userRating: rating,
      nextWeekFocus: focus
    };
    
    saveCoachingSession(session);
    
    const currentPoints = parseInt(localStorage.getItem('ht_points') || '0');
    localStorage.setItem('ht_points', (currentPoints + 100).toString());
    window.dispatchEvent(new CustomEvent('pointsUpdated'));
    
    toast.success('Coaching session complete! +100 pts 👑');
    onSessionSaved?.();
    onClose();
  };
  
  const handleClose = () => {
    setStep(1);
    setAiResponse('');
    setRating(5);
    setFocus('');
    setSections({});
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '20px',
          padding: '24px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
            {step === 1 && '📊 Your Week In Review'}
            {step === 2 && '🧠 AI Deep Analysis'}
            {step === 3 && '⭐ Rate & Set Focus'}
          </h2>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✕</button>
        </div>
        
        {step === 1 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ 
                width: '120px', 
                height: '120px', 
                borderRadius: '50%', 
                background: `conic-gradient(var(--primary) ${weeklyStats.percentage * 3.6}deg, var(--border) 0deg)`,
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ 
                  width: '100px', 
                  height: '100px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}>
                  <span style={{ fontSize: '28px', fontWeight: '700' }}>{weeklyStats.percentage}%</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>completion</span>
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '12px' }}>Habit Breakdown</h4>
              <div style={{ fontSize: '12px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Habit</th>
                      <th style={{ textAlign: 'center', padding: '8px' }}>Days</th>
                      <th style={{ textAlign: 'center', padding: '8px' }}>Streak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(habits || []).slice(0, 5).map((h, i) => {
                      const wc = getWeekCompletions(h.completionLog || {});
                      const days = Object.values(wc).filter(v => v).length;
                      return (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '8px' }}>{h.icon} {h.name}</td>
                          <td style={{ textAlign: 'center', padding: '8px' }}>{days}/7</td>
                          <td style={{ textAlign: 'center', padding: '8px' }}>{h.currentStreak || 0}d</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep(2)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #BA7517, #f59e0b)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Send to AI Coach →
            </motion.button>
          </div>
        )}
        
        {step === 2 && (
          <div>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              {isLoading ? (
                <>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
                    {[0, 1, 2].map(i => (
                      <motion.span
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3], translateY: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                        style={{ fontSize: '24px' }}
                      >
                        ●
                      </motion.span>
                    ))}
                  </div>
                  <p style={{ color: 'var(--text-secondary)' }}>Your Coach is analyzing...</p>
                </>
              ) : (
                <div style={{ textAlign: 'left', whiteSpace: 'pre-line', fontSize: '14px', lineHeight: 1.6 }}>
                  {Object.entries(sections).map(([title, content]) => (
                    <div key={title} style={{ 
                      marginBottom: '16px', 
                      padding: '12px', 
                      borderRadius: '8px',
                      backgroundColor: title.includes('Well') ? 'rgba(34, 197, 94, 0.1)' :
                        title.includes('Attention') ? 'rgba(59, 130, 246, 0.1)' :
                        title.includes('Pattern') ? 'rgba(139, 92, 246, 0.1)' :
                        title.includes('Plan') ? 'rgba(245, 158, 11, 0.1)' :
                        'rgba(186, 117, 23, 0.1)',
                      border: '1px solid var(--border)'
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>{title}</div>
                      <div>{content}</div>
                    </div>
                  ))}
                  {aiResponse && Object.keys(sections).length === 0 && (
                    <div style={{ whiteSpace: 'pre-line' }}>{aiResponse}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '12px' }}>Rate this session</h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    style={{ 
                      fontSize: '28px', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer',
                      opacity: star <= rating ? 1 : 0.3
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>What will you focus on next week?</h4>
              <textarea
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                placeholder="e.g., Improve meditation consistency..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
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
              onClick={saveSession}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #BA7517, #f59e0b)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Save Session ✓
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const AICoachingPage = () => {
  const { habits } = useHabitContext();
  const { moodLog } = useMoodContext();
  const [showModal, setShowModal] = useState(false);
  const [personality, setPersonality] = useState(getCoachPersonality());
  const [sessions, setSessions] = useState([]);
  const [expandedSession, setExpandedSession] = useState(null);
  const [ollamaStatus, setOllamaStatus] = useState({ isRunning: false });
  const [refreshKey, setRefreshKey] = useState(0);
  
  useEffect(() => {
    const saved = localStorage.getItem('ht_coach_personality');
    if (saved && PERSONALITY_KEYS.includes(saved)) {
      setPersonality(saved);
    }
    setSessions(loadCoachingSessions());
    checkOllamaStatus().then(setOllamaStatus);
  }, [refreshKey]);
  
  const handlePersonalityChange = (key) => {
    setPersonality(key);
    saveCoachPersonality(key);
  };
  
  const handleSessionSaved = () => {
    setRefreshKey(k => k + 1);
    setSessions(loadCoachingSessions());
  };
  
  const getConsecutiveWeeks = () => {
    if (sessions.length === 0) return 0;
    let streak = 0;
    const sorted = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date));
    for (let i = 0; i < sorted.length; i++) {
      const sessionDate = new Date(sorted[i].date);
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i * 7);
      const weekDiff = Math.abs(Math.round((expectedDate - sessionDate) / (7 * 24 * 60 * 60 * 1000)));
      if (weekDiff <= 1) streak++;
      else break;
    }
    return streak;
  };
  
  const coachingStreak = getConsecutiveWeeks();
  const trend = analyzeProgressTrend(sessions);
  const weeklyStats = getWeekCoachingStats(habits || []);
  const thisWeekSession = sessions.find(s => {
    const sessionDate = new Date(s.date);
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return sessionDate >= startOfWeek;
  });
  
  const chartData = sessions.slice(0, 8).reverse().map(s => ({
    week: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    completion: s.weekData?.percentage || 0
  })).reverse();
  
  const getBestDay = () => {
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    (sessions || []).forEach(s => {
      const day = new Date(s.date).getDay();
      dayCounts[day]++;
    });
    const max = Math.max(...dayCounts);
    return dayCounts.indexOf(max) >= 0 ? dayLabels[dayCounts.indexOf(max)] : 'N/A';
  };
  
  if (!hasFeature('aiCoachPro')) {
    return <UpgradePrompt />;
  }
  
  return (
    <div style={{ padding: '24px', paddingBottom: '100px' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '32px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #BA7517, #f59e0b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px'
            }}>
              🤖
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: 'var(--text)' }}>
                AI Life Coach Pro 👑
              </h1>
              <span style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: '#BA7517', color: '#fff', borderRadius: '4px' }}>
                Elite Exclusive
              </span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: ollamaStatus.isRunning ? '#22c55e' : '#ef4444' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {ollamaStatus.isRunning ? 'Connected' : 'Offline'}
              </span>
            </div>
            <div style={{ textAlign: 'center', padding: '8px 16px', backgroundColor: 'var(--surface)', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px' }}>🔥</div>
              <div style={{ fontSize: '18px', fontWeight: '700' }}>{coachingStreak}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>weeks</div>
            </div>
          </div>
        </div>
      </motion.div>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {PERSONALITY_KEYS.map(key => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePersonalityChange(key)}
            style={{
              flex: 1,
              minWidth: '120px',
              padding: '12px',
              borderRadius: '12px',
              border: personality === key ? '2px solid #BA7517' : '1px solid var(--border)',
              backgroundColor: personality === key ? 'rgba(186, 117, 23, 0.1)' : 'var(--surface)',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>{COACH_PERSONALITIES[key].icon}</div>
            <div style={{ fontSize: '13px', fontWeight: personality === key ? '600' : '400' }}>
              {COACH_PERSONALITIES[key].name}
            </div>
          </motion.button>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '24px' }}
      >
        <div style={{ 
          backgroundColor: 'var(--surface)', 
          borderRadius: '20px', 
          padding: '24px',
          border: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>📅 Weekly Coaching Session</h3>
            {thisWeekSession ? (
              <span style={{ fontSize: '12px', padding: '4px 12px', backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', borderRadius: '12px' }}>
              Completed ✅
            </span>
            ) : (
              <span style={{ fontSize: '12px', padding: '4px 12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '12px' }}>
              Ready for Review
              </span>
            )}
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Week of {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
            <p style={{ fontSize: '24px', fontWeight: '700', margin: '4px 0' }}>{weeklyStats.percentage}% completion</p>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {sessions.length > 0 ? `${sessions.length} sessions completed` : 'Start your coaching journey'}
            </p>
          </div>
          
          {!thisWeekSession && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowModal(true)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #BA7517, #f59e0b)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Start Coaching Session
            </motion.button>
          )}
          
          {thisWeekSession && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setExpandedSession(expandedSession === 'current' ? null : 'current')}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg)',
                color: 'var(--text)',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              View full session →
            </motion.button>
          )}
        </div>
      </motion.div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '24px' }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Behavioral Patterns 🔍</h3>
            <div style={{ backgroundColor: 'var(--surface)', borderRadius: '16px', padding: '20px', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Analyze your behavioral patterns over time to uncover insights.
              </p>
              {sessions.length >= 2 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ fontSize: '13px', padding: '12px', backgroundColor: 'var(--bg)', borderRadius: '8px' }}>
                    📊 You perform best on {getBestDay()}s
                  </div>
                  <div style={{ fontSize: '13px', padding: '12px', backgroundColor: 'var(--bg)', borderRadius: '8px' }}>
                    {trend.trend === 'improved' ? '📈' : trend.trend === 'declined' ? '📉' : '➡️'} {trend.insight}
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Complete 2+ coaching sessions to see pattern analysis
                </p>
              )}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Coaching History 📚</h3>
            
            {sessions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📖</div>
                <p style={{ color: 'var(--text-secondary)' }}>Your coaching journey starts this week!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {sessions.slice(0, 5).map((session, idx) => (
                  <motion.div
                    key={session.id || idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => setExpandedSession(expandedSession === idx ? null : idx)}
                    style={{
                      backgroundColor: 'var(--surface)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid var(--border)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>
                        Week of {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--primary)' }}>{session.weekData?.percentage || 0}%</span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} style={{ fontSize: '12px', color: star <= (session.userRating || 0) ? '#FFD700' : 'var(--border)' }}>★</span>
                      ))}
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                      {session.aiResponse?.substring(0, 80) || 'No response'}...
                    </p>
                    {expandedSession === idx && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}
                      >
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>{session.aiResponse}</p>
                        {session.nextWeekFocus && (
                          <div style={{ marginTop: '12px', padding: '12px', backgroundColor: 'var(--bg)', borderRadius: '8px' }}>
                            <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Focus for next week:</div>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>{session.nextWeekFocus}</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
        
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ backgroundColor: 'var(--surface)', borderRadius: '16px', padding: '20px', border: '1px solid var(--border)' }}
          >
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>Coach Observations 💡</h4>
            {sessions.length >= 2 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '13px', padding: '12px', backgroundColor: 'var(--bg)', borderRadius: '8px' }}>
                  📊 You perform best on {getBestDay()}s
                </div>
                <div style={{ fontSize: '13px', padding: '12px', backgroundColor: 'var(--bg)', borderRadius: '8px' }}>
                  {trend.trend === 'improved' ? '📈' : trend.trend === 'declined' ? '📉' : '➡️'} {trend.insight}
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Complete 2+ coaching sessions to build observations
              </p>
            )}
          </motion.div>
          
          {sessions.length >= 2 && chartData.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ 
                backgroundColor: 'var(--surface)', 
                borderRadius: '16px', 
                padding: '20px', 
                border: '1px solid var(--border)',
                marginTop: '16px'
              }}
            >
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>Progress Chart 📈</h4>
              <div style={{ height: '120px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="week" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="completion" stroke="#BA7517" strokeWidth={2} dot={{ fill: '#BA7517', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      <CoachingSessionModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        habits={habits}
        personality={personality}
        onSessionSaved={handleSessionSaved}
      />
    </div>
  );
};

export default AICoachingPage;