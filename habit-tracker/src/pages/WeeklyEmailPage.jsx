import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePlanContext } from '../context/PlanContext';
import { format } from 'date-fns';

function WeeklyEmailPage() {
  const planCtx = usePlanContext();
  const hasFeature = planCtx.hasFeature;
  const [isEnabled, setIsEnabled] = useState(
    localStorage.getItem('ht_weekly_email') === 'true'
  );
  const [email, setEmail] = useState(
    localStorage.getItem('ht_user_email') || ''
  );
  const [preview, setPreview] = useState(false);

  if (!hasFeature('weeklyEmail')) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h2>🚫 Elite Feature</h2>
        <p>This feature is available for Elite users only.</p>
      </div>
    );
  }

  const toggleEmail = () => {
    if (!email) {
      alert('Please enter your email first');
      return;
    }
    const newState = !isEnabled;
    setIsEnabled(newState);
    localStorage.setItem('ht_weekly_email', String(newState));
    localStorage.setItem('ht_user_email', email);
  };

  const sampleReport = {
    weekOf: format(new Date(), 'MMMM d, yyyy'),
    totalHabits: 12,
    completed: 68,
    totalPossible: 84,
    completionRate: 81,
    bestStreak: 14,
    totalPoints: 2450,
    topHabits: [
      { name: 'Morning Meditation', completed: 7, total: 7 },
      { name: 'Read 30 min', completed: 6, total: 7 },
      { name: 'Exercise', completed: 5, total: 7 },
    ],
    improvements: [
      'Meditation streak improved by 3 days',
      'Evening routine becoming more consistent',
    ],
    nextWeek: [
      'Focus on consistency for reading habit',
      'Try adding a new mindfulness practice',
    ],
    aiInsight: 'You\'re showing excellent discipline patterns! Your consistency score is in the top 15% of users. Keep focusing on your morning routine - it\'s driving most of your weekly success.',
  };

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
            Executive Weekly Email
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Beautiful weekly summary delivered to your inbox
          </p>
        </div>

        <div style={{
          background: 'var(--surface)',
          padding: '32px',
          borderRadius: '24px',
          border: '1px solid var(--border)',
          marginBottom: '24px'
        }}>
          <h3 style={{ marginBottom: '24px' }}>📬 Email Settings</h3>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '16px',
                color: 'var(--text)',
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            background: isEnabled ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            borderRadius: '12px',
            marginBottom: '24px'
          }}>
            <div>
              <div style={{ fontWeight: 600 }}>Weekly Report Email</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {isEnabled ? 'Active - sends every Sunday at 9 AM' : 'Disabled'}
              </div>
            </div>
            <button
              onClick={toggleEmail}
              style={{
                padding: '8px 20px',
                background: isEnabled ? '#22c55e' : '#f59e0b',
                border: 'none',
                borderRadius: '20px',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {isEnabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <button
            onClick={() => setPreview(!preview)}
            style={{
              padding: '12px 24px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {preview ? 'Hide Preview' : '📄 Preview Sample Email'}
          </button>
        </div>

        {preview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'white',
              color: '#333',
              padding: '40px',
              borderRadius: '16px',
              fontFamily: 'Arial, sans-serif'
            }}
          >
            <div style={{
              background: 'linear-gradient(135deg, #BA7517, #f59e0b)',
              color: 'white',
              padding: '24px',
              borderRadius: '12px',
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <h1 style={{ margin: 0, fontSize: '24px' }}>Your Weekly Habit Report</h1>
              <p style={{ margin: '8px 0 0', opacity: 0.9 }}>{sampleReport.weekOf}</p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ textAlign: 'center', padding: '16px', background: '#f9f9f9', borderRadius: '8px' }}>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#BA7517' }}>{sampleReport.completionRate}%</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Completion Rate</div>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', background: '#f9f9f9', borderRadius: '8px' }}>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#22c55e' }}>{sampleReport.bestStreak}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Best Streak</div>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', background: '#f9f9f9', borderRadius: '8px' }}>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#3b82f6' }}>{sampleReport.totalPoints}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Points Earned</div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>🏆 Top Habits</h3>
              {sampleReport.topHabits.map((habit, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: '#f9f9f9',
                  borderRadius: '8px',
                  marginBottom: '8px'
                }}>
                  <span>{habit.name}</span>
                  <span style={{ fontWeight: 600, color: '#22c55e' }}>
                    {habit.completed}/{habit.total} ✅
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              padding: '16px',
              background: 'rgba(186, 117, 23, 0.1)',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '14px', marginBottom: '8px' }}>🤖 AI Insight</h3>
              <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>{sampleReport.aiInsight}</p>
            </div>

            <div style={{
              padding: '16px',
              background: '#f9f9f9',
              borderRadius: '8px'
            }}>
              <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>🎯 Next Week Strategy</h3>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {sampleReport.nextWeek.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '8px', color: '#666' }}>{item}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default WeeklyEmailPage;