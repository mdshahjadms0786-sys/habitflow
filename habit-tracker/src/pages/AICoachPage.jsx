import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabitContext } from '../context/HabitContext';
import { useMoodContext } from '../context/MoodContext';
import { checkOllamaStatus, streamCompletion } from '../utils/ollamaService';
import { getTodayISO } from '../utils/dateUtils';
import { getWeekCompletions } from '../utils/streakUtils';
import { hasFeature } from '../utils/planUtils';

const MODELS = ['llama3', 'mistral', 'llama2', 'phi'];
const DAILY_INSIGHT_KEY = 'ht_pro_daily_insight';

const PRO_SYSTEM_PROMPT = `You are a friendly and helpful habit coaching assistant called HabitFlow Coach.

Your role:
- Help users build and maintain good habits
- Provide practical, actionable advice
- Be encouraging and positive
- Reference the user's actual data when responding
- Keep responses concise (max 150 words)
- Use emojis sparingly for warmth

Do NOT:
- Give medical or psychological diagnosis
- Be preachy or lecture extensively
- Repeat the same advice
- Make up data you don't have

Always end with one specific actionable tip.`;

const buildProContext = (habits, moodLog) => {
  const safeHabits = (habits || []).filter(h => h != null);
  const today = getTodayISO();
  
  const completedToday = safeHabits.filter(h => h.completionLog?.[today]).length;
  const totalHabits = safeHabits.length;
  
  let weeklyCompleted = 0;
  let weeklyTotal = 0;
  safeHabits.forEach(h => {
    const wc = getWeekCompletions(h.completionLog || {});
    Object.values(wc).forEach(v => { if (v) weeklyCompleted++; });
    weeklyTotal += 7;
  });
  const weeklyRate = weeklyTotal > 0 ? Math.round((weeklyCompleted / weeklyTotal) * 100) : 0;
  
  const bestStreak = safeHabits.length > 0 
    ? Math.max(...safeHabits.map(h => h.currentStreak || 0)) 
    : 0;
  
  const habitRates = safeHabits.map(h => {
    const wc = getWeekCompletions(h.completionLog || {});
    const completed = Object.values(wc).filter(v => v).length;
    return { habit: h, rate: Math.round((completed / 7) * 100) };
  }).sort((a, b) => a.rate - b.rate);
  
  const weakest = habitRates[0]?.habit;
  const strongest = habitRates[habitRates.length - 1]?.habit;
  const weakestRate = habitRates[0]?.rate || 0;
  const strongestRate = habitRates[habitRates.length - 1]?.rate || 0;
  
  const categories = [...new Set(safeHabits.map(h => h.category).filter(Boolean))].join(', ');
  
  return `
User's habit data:
- Today: ${completedToday}/${totalHabits} habits done
- Weekly completion: ${weeklyRate}%
- Best streak: ${bestStreak} days
- Strongest habit: ${strongest?.name || 'N/A'} (${strongestRate}% this week)
- Weakest habit: ${weakest?.name || 'N/A'} (${weakestRate}% this week)
- Total habits: ${totalHabits}
- Habit categories: ${categories || 'None'}
  `;
};

const getProFallback = (userMessage, habits, weeklyStats) => {
  const message = userMessage.toLowerCase();
  const safeHabits = (habits || []).filter(h => h != null);
  
  let weeklyCompleted = 0;
  let weeklyTotal = 0;
  safeHabits.forEach(h => {
    const wc = getWeekCompletions(h.completionLog || {});
    Object.values(wc).forEach(v => { if (v) weeklyCompleted++; });
    weeklyTotal += 7;
  });
  const completionPct = weeklyTotal > 0 ? Math.round((weeklyCompleted / weeklyTotal) * 100) : 0;
  
  const bestStreak = safeHabits.length > 0 
    ? Math.max(...safeHabits.map(h => h.currentStreak || 0)) 
    : 0;
  
  const habitRates = safeHabits.map(h => {
    const wc = getWeekCompletions(h.completionLog || {});
    const completed = Object.values(wc).filter(v => v).length;
    return { habit: h, rate: Math.round((completed / 7) * 100) };
  }).sort((a, b) => a.rate - b.rate);
  
  const weakest = habitRates[0]?.habit;
  
  if (message.includes('suggest') || message.includes('habit')) {
    return `Based on your current habits, I suggest focusing on consistency. 
Your weakest area is ${weakest?.name || 'consistency'}. 
Try doing it at the same time every day — this builds automaticity. 
Start with just 2 minutes if needed! 💪`;
  }
  
  if (message.includes('streak') || message.includes('improve')) {
    return `Your best streak is ${bestStreak} days — impressive! 
To improve: Never miss twice in a row (the golden rule).
If you miss once, make the next day non-negotiable.
Stack habits with existing routines for better adherence. 🔥`;
  }
  
  if (message.includes('week') || message.includes('analyz')) {
    return `This week you completed ${completionPct}% of your habits. 
${completionPct > 70 ? "Excellent work! You're in the top tier." : 
  completionPct > 50 ? "Good progress! Focus on your weakest habit tomorrow." :
  "Fresh start tomorrow. Pick just 3 habits and nail them."}
Remember: Progress over perfection! 📈`;
  }
  
  return `Great question! Here's my tip: 
Focus on habit stacking — attach new habits to existing ones.
"After I [current habit], I will [new habit]."
This uses existing neural pathways for faster habit formation.
What habit would you like to stack? 🎯`;
};

const callProAI = async (userMessage, context, onChunk, onDone, onError) => {
  const model = localStorage.getItem('ht_ollama_model') || 'llama3';
  
  const fullPrompt = `${PRO_SYSTEM_PROMPT}

${context}

User question: ${userMessage}

Respond as HabitFlow Coach:`;

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: fullPrompt,
        stream: true
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

const DailyInsightCard = ({ habits, moodLog, ollamaStatus }) => {
  const [insight, setInsight] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [lastGenerated, setLastGenerated] = useState(null);

  const generateInsight = async () => {
    setIsLoading(true);
    
    if (!ollamaStatus.isRunning) {
      const completionPct = calculateWeeklyRate(habits);
      let fallback = '';
      if (completionPct > 70) {
        fallback = "Great momentum! Keep it up today. You're on fire! 🔥";
      } else if (completionPct > 40) {
        fallback = "Solid progress. Focus on your weakest habit to improve.";
      } else {
        fallback = "Fresh start today. Pick your easiest habit first!";
      }
      setInsight(fallback);
      setLastGenerated(new Date().toISOString());
      setIsLoading(false);
      return;
    }

    try {
      const context = buildProContext(habits, moodLog);
      const prompt = `${PRO_SYSTEM_PROMPT}

${context}

Give me one personalized tip for today based on my habit data. Keep it concise (max 50 words).`;

      let fullResponse = '';
      
      await streamCompletion({
        prompt,
        model: localStorage.getItem('ht_ollama_model') || 'llama3',
        onChunk: (chunk) => { fullResponse += chunk; },
        onDone: () => {},
        onError: () => {}
      });

      if (fullResponse) {
        const data = { insight: fullResponse, timestamp: new Date().toISOString() };
        localStorage.setItem(DAILY_INSIGHT_KEY, JSON.stringify(data));
        setInsight(fullResponse);
        setLastGenerated(data.timestamp);
      }
    } catch {
      setInsight('Could not generate insight. Try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem(DAILY_INSIGHT_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.insight && data.timestamp) {
          const savedDate = new Date(data.timestamp);
          const now = new Date();
          const hoursDiff = (now - savedDate) / (1000 * 60 * 60);
          if (hoursDiff < 24) {
            setInsight(data.insight);
            setLastGenerated(data.timestamp);
            setIsLoading(false);
            return;
          }
        }
      } catch {}
    }
    generateInsight();
  }, [habits, moodLog, ollamaStatus.isRunning]);

  const calculateWeeklyRate = (h) => {
    const safe = (h || []).filter(h => h != null);
    let completed = 0;
    let total = 0;
    safe.forEach(habit => {
      const wc = getWeekCompletions(habit.completionLog || {});
      Object.values(wc).forEach(v => { if (v) completed++; });
      total += 7;
    });
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const handleRegenerate = () => {
    generateInsight();
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid var(--border)',
          marginBottom: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '24px' }}>📅</span>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
            Today's Insight
          </h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ height: '14px', backgroundColor: 'var(--bg)', borderRadius: '4px', width: '90%', opacity: 0.5 }} />
          <div style={{ height: '14px', backgroundColor: 'var(--bg)', borderRadius: '4px', width: '75%', opacity: 0.5 }} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid var(--border)',
        marginBottom: '24px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <span style={{ fontSize: '24px' }}>📅</span>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
          Today's Insight
        </h3>
      </div>

      <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text)', lineHeight: 1.5 }}>
        {insight}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          {lastGenerated && `Generated ${new Date(lastGenerated).toLocaleTimeString()}`}
        </span>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleRegenerate}
          disabled={isLoading}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg)',
            color: 'var(--text)',
            fontSize: '12px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          Regenerate 🔄
        </motion.button>
      </div>
    </motion.div>
  );
};

const QuickActions = ({ onAction, isLoading }) => {
  const actions = [
    { label: '💡 Suggest Habits', type: 'suggest' },
    { label: '📊 Analyze My Week', type: 'analyze_week' },
    { label: '🎯 What Should I Focus On?', type: 'focus' },
    { label: '🔥 How To Improve Streak?', type: 'improve_streak' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
      {actions.map((action) => (
        <motion.button
          key={action.type}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAction(action.type)}
          disabled={isLoading}
          style={{
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            color: 'var(--text)',
            fontSize: '14px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
            textAlign: 'center',
          }}
        >
          {action.label}
        </motion.button>
      ))}
    </div>
  );
};

const ChatInterface = ({ habits, moodLog, ollamaStatus }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your HabitFlow Coach 🤖 How can I help you with your habits today?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (prompt) => {
    if (!prompt.trim() || isLoading) return;

    const userMessage = { role: 'user', content: prompt, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiMessage = { role: 'assistant', content: '', timestamp: new Date() };
    setMessages(prev => [...prev, aiMessage]);

    const context = buildProContext(habits, moodLog);

    if (!ollamaStatus.isRunning) {
      const fallback = getProFallback(prompt, habits, {});
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].content = fallback;
        return updated;
      });
      setIsLoading(false);
      return;
    }

    try {
      await callProAI(
        prompt,
        context,
        (chunk) => {
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1].content += chunk;
            return updated;
          });
        },
        () => {
          setIsLoading(false);
        },
        (error) => {
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1].content = 'Sorry, I hit an error. Make sure Ollama is running.';
            return updated;
          });
          setIsLoading(false);
        }
      );
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].content = 'Sorry, something went wrong. Try again.';
        return updated;
      });
      setIsLoading(false);
    }
  };

  const handleQuickAction = (type) => {
    const prompts = {
      suggest: 'Give me 5 habit suggestions based on my current habits and goals.',
      analyze_week: 'Analyze my week: What was my completion rate? Which habit was best and which needs work?',
      focus: 'What habits should I focus on today for best results?',
      improve_streak: 'How can I improve my habit streaks?',
    };
    sendMessage(prompts[type]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ backgroundColor: 'var(--surface)', borderRadius: '16px', padding: '20px', border: '1px solid var(--border)' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
        Chat with AI Coach
      </h3>

      <QuickActions onAction={handleQuickAction} isLoading={isLoading} />

      <div style={{ height: '400px', overflowY: 'auto', marginBottom: '16px', padding: '12px', backgroundColor: 'var(--bg)', borderRadius: '12px' }}>
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '12px',
                flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '80%',
                  padding: '12px 16px',
                  borderRadius: '12px 12px 0 12px',
                  backgroundColor: msg.role === 'user' ? '#534AB7' : 'var(--surface)',
                  color: msg.role === 'user' ? '#ffffff' : 'var(--text)',
                  border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
                }}
              >
                {msg.role === 'assistant' && <span style={{ marginRight: '6px' }}>🤖</span>}
                <span>{msg.content}</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {formatTime(msg.timestamp)}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}
          >
            <div style={{ padding: '12px 16px', borderRadius: '12px 12px 12px 0', backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
              <span style={{ display: 'flex', gap: '4px' }}>
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3], translateY: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                    style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--text-secondary)' }}
                  />
                ))}
              </span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about your habits..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '24px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            color: 'var(--text)',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isLoading || !input.trim()}
          style={{
            padding: '12px 20px',
            borderRadius: '24px',
            backgroundColor: isLoading || !input.trim() ? 'var(--border)' : '#534AB7',
            color: '#ffffff',
            border: 'none',
            cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
            fontSize: '14px',
          }}
        >
          Send
        </motion.button>
      </form>
    </div>
  );
};

const UpgradePrompt = () => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
    <h2 style={{ margin: '0 0 12px 0', color: 'var(--text)' }}>Pro Feature</h2>
    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
      Upgrade to Pro to access AI Coach and get personalized habit insights!
    </p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        padding: '12px 24px',
        borderRadius: '24px',
        backgroundColor: '#534AB7',
        color: '#ffffff',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
      }}
      onClick={() => window.location.href = '/settings?upgrade=pro'}
    >
      Upgrade to Pro 💎
    </motion.button>
  </div>
);

const AICoachPage = () => {
  const { habits } = useHabitContext();
  const { moodLog } = useMoodContext();
  const [ollamaStatus, setOllamaStatus] = useState({ isRunning: false, models: [] });
  const [selectedModel, setSelectedModel] = useState('llama3');
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('ht_ollama_model');
    if (saved && MODELS.includes(saved)) {
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

  if (!hasFeature('aiCoach')) {
    return <UpgradePrompt />;
  }

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

  const bestHabit = safeHabits.reduce((best, h) => 
    ((h?.currentStreak || 0) > (best?.currentStreak || 0) ? h : best), null);

  const daysTracked = Object.keys(moodLog || {}).length;

  return (
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
              {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: ollamaStatus.isRunning ? '#22c55e' : '#ef4444' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {ollamaStatus.isRunning ? 'Connected' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </motion.header>

      <DailyInsightCard habits={safeHabits} moodLog={moodLog || {}} ollamaStatus={ollamaStatus} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>
        <ChatInterface habits={safeHabits} moodLog={moodLog || {}} ollamaStatus={ollamaStatus} />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <div style={{ backgroundColor: 'var(--surface)', borderRadius: '16px', padding: '20px', border: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
              📊 Your Stats
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>This week completion</p>
                <p style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: 'var(--text)' }}>{completionPct}%</p>
              </div>
              {bestHabit && (
                <div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Best streak</p>
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
    </div>
  );
};

export default AICoachPage;