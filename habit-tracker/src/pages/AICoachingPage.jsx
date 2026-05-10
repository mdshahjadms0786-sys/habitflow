import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useHabits } from '../hooks/useHabits';
import { useMoodContext } from '../context/MoodContext';
import { hasFeature } from '../utils/planUtils';
import { useNavigate } from 'react-router-dom';
import WeeklyCoachingCard from '../components/AICoaching/WeeklyCoachingCard';
import CoachingSessionModal from '../components/AICoaching/CoachingSessionModal';
import { loadCoachingSessions, COACH_PERSONALITIES, getCoachPersonality, saveCoachPersonality, analyzeProgressTrend } from '../utils/aiCoachingUtils';
import PlanBadge from '../components/UI/PlanBadge';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import LockedFeature from '../components/UI/LockedFeature';

const AICoachingPage = () => {
  const { habits } = useHabits();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [personality, setPersonality] = useState(getCoachPersonality());
  const [sessions, setSessions] = useState([]);
  const [expandedSession, setExpandedSession] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const canAccess = hasFeature('ai_coaching') || hasFeature('coaching');
  
  useEffect(() => {
    setSessions(loadCoachingSessions());
  }, [refreshKey, showModal]);
  
  const handleSessionSaved = () => {
    setRefreshKey(k => k + 1);
  };
  
  const getConsecutiveWeeks = () => {
    if (sessions.length === 0) return 0;
    let streak = 0;
    const sortedSessions = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date));
    for (let i = 0; i < sortedSessions.length; i++) {
      const sessionDate = new Date(sortedSessions[i].date);
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
  const chartData = sessions.slice(0, 8).reverse().map(s => ({
    week: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    completion: s.weekData?.percentage || 0
  })).reverse();
  
  const getBestDay = () => {
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    sessions.forEach(s => {
      const day = new Date(s.date).getDay();
      dayCounts[day]++;
    });
    const maxDay = dayCounts.indexOf(Math.max(...dayCounts));
    return maxDay >= 0 ? dayLabels[maxDay] : 'N/A';
  };
  
  const getMostConsistentHabit = () => {
    if (!habits || habits.length === 0) return 'N/A';
    return habits.reduce((best, h) => {
      const hStreak = h.currentStreak || 0;
      const bStreak = best?.currentStreak || 0;
      return hStreak > bStreak ? h : best;
    }, habits[0])?.name || 'N/A';
  };
  
  const totalWeeks = sessions.length;
  
  return (
    <LockedFeature featureName="coachingSessions" requiredPlan="elite">
      <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', paddingBottom: '100px' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}
      >
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>
            Personal AI Life Coach 🤖
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Get personalized coaching based on your habits
          </p>
        </div>
        <PlanBadge />
      </motion.div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div style={{ 
              backgroundColor: 'var(--surface)', 
              borderRadius: '20px', 
              padding: '24px',
              marginBottom: '24px',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px'
              }}>
                🤖
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 4px 0' }}>Your AI Coach</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
                  {coachingStreak > 0 ? `${coachingStreak} consecutive weeks` : totalWeeks > 0 ? `${totalWeeks} weeks of coaching` : 'Start your coaching journey'}
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px' }}>{coachingStreak >= 3 ? '🔥' : '⭐'}</div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>{coachingStreak}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>weeks</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
              {Object.entries(COACH_PERSONALITIES).map(([key, p]) => (
                <button
                  key={key}
                  onClick={() => { setPersonality(key); saveCoachPersonality(key); }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    border: personality === key ? '2px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: personality === key ? 'var(--primary-light)' : 'var(--surface)',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>{p.icon}</div>
                  <div style={{ fontSize: '12px', fontWeight: personality === key ? '600' : '400' }}>{p.name}</div>
                </button>
              ))}
            </div>
          </motion.div>
          
          <WeeklyCoachingCard 
            habits={habits} 
            onStartSession={() => setShowModal(true)} 
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ marginTop: '24px' }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              Coaching History 📚
            </h3>
            
            {sessions.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px', 
                backgroundColor: 'var(--surface)', 
                borderRadius: '16px',
                border: '1px solid var(--border)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📖</div>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Your coaching journey starts this week!
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {sessions.slice(0, 5).map((session, idx) => (
                  <motion.div
                    key={session.id || idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--primary)' }}>
                          {session.weekData?.percentage || 0}%
                        </span>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} style={{ fontSize: '12px', color: star <= (session.userRating || 0) ? '#FFD700' : 'var(--border)' }}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                      {session.aiResponse?.substring(0, 80) || 'No response'}...
                    </p>
                    {session.personality && (
                      <div style={{ marginTop: '8px' }}>
                        <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: 'var(--primary-light)', borderRadius: '4px', color: 'var(--primary)' }}>
                          {COACH_PERSONALITIES[session.personality]?.icon} {COACH_PERSONALITIES[session.personality]?.name}
                        </span>
                      </div>
                    )}
                    {expandedSession === idx && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}
                      >
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                          {session.aiResponse}
                        </p>
                        {session.nextWeekFocus && (
                          <div style={{ marginTop: '12px', padding: '12px', backgroundColor: 'var(--bg)', borderRadius: '8px' }}>
                            <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Focus for next week:</div>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                              {session.nextWeekFocus}
                            </p>
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
            transition={{ delay: 0.3 }}
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid var(--border)'
            }}
          >
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>
              Coach Observations 💡
            </h4>
            {sessions.length >= 2 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '13px', padding: '12px', backgroundColor: 'var(--bg)', borderRadius: '8px' }}>
                  📊 You perform best on {getBestDay()}s
                </div>
                <div style={{ fontSize: '13px', padding: '12px', backgroundColor: 'var(--bg)', borderRadius: '8px' }}>
                  {trend.trend === 'improved' ? '📈' : trend.trend === 'declined' ? '📉' : '➡️'} Your completion has {trend.trend === 'improved' ? 'improved' : trend.trend === 'declined' ? 'declined' : 'been stable'} {trend.percentage}% over {Math.min(sessions.length, 4)} weeks
                </div>
                <div style={{ fontSize: '13px', padding: '12px', backgroundColor: 'var(--bg)', borderRadius: '8px' }}>
                  🎯 {getMostConsistentHabit()} is your most consistent
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Complete 2+ coaching sessions to see observations
              </p>
            )}
          </motion.div>
          
          {sessions.length >= 2 && chartData.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                backgroundColor: 'var(--surface)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid var(--border)',
                marginTop: '16px'
              }}
            >
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>
                Progress Chart 📈
              </h4>
              <div style={{ height: '120px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis 
                      dataKey="week" 
                      tick={{ fontSize: 10 }} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      tick={{ fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="completion" 
                      stroke="var(--primary)" 
                      strokeWidth={2}
                      dot={{ fill: 'var(--primary)', r: 4 }}
                    />
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
        onSessionSaved={handleSessionSaved}
      />
      </div>
    </LockedFeature>
  );
};

export default AICoachingPage;