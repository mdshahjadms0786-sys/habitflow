import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getFocusSessions, getRecentSessions, formatMinutes, getTodayFocusStats } from '../utils/focusHistoryUtils';
import FocusWeekChart from '../components/Focus/FocusWeekChart';
import FocusHabitBreakdown from '../components/Focus/FocusHabitBreakdown';
import FocusStreakCard from '../components/Focus/FocusStreakCard';
import WeeklyFocusGoal from '../components/Focus/WeeklyFocusGoal';
import FocusPersonalRecords from '../components/Focus/FocusPersonalRecords';
import { format } from 'date-fns';

const FocusHistoryPage = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [todayStats, setTodayStats] = useState({ totalMinutes: 0, sessionCount: 0 });

  useEffect(() => {
    const data = getFocusSessions();
    setSessions(data);
    setTodayStats(getTodayFocusStats(data));
  }, []);

  const recentSessions = getRecentSessions(sessions, 10);

  return (
    <div className="page-container" style={{ padding: '24px', paddingBottom: '80px' }}>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '24px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: 'var(--text)' }}>
              Focus History 📊
            </h1>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
              Today's total: {formatMinutes(todayStats.totalMinutes)} • {todayStats.sessionCount} session{todayStats.sessionCount !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => navigate('/focus')}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Start Focus +
          </button>
        </div>
      </motion.header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '24px',
          alignItems: 'start'
        }}
      >
        <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <FocusWeekChart sessions={sessions} />
          <FocusHabitBreakdown sessions={sessions} />
        </div>

        <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <FocusStreakCard sessions={sessions} />
          <WeeklyFocusGoal sessions={sessions} />
          <FocusPersonalRecords sessions={sessions} />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          marginTop: '24px',
          backgroundColor: 'var(--surface)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid var(--border)'
        }}
      >
        <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
          Recent Sessions
        </h3>
        {recentSessions.length === 0 ? (
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
            No sessions yet
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentSessions.map((session, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  backgroundColor: 'var(--bg)',
                  borderRadius: '8px'
                }}
              >
                <span style={{ fontSize: '20px' }}>{session.habitIcon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: 'var(--text)' }}>
                    {session.habitName}
                  </p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {session.date} • {format(new Date(session.completedAt), 'h:mm a')}
                  </p>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--primary)' }}>
                  {session.duration}m
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="gridColumn: span 7"],
          div[style*="gridColumn: span 5"] {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FocusHistoryPage;