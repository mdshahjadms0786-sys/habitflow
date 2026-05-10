import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '../hooks/useHabits';
import { hasFeature } from '../utils/planUtils';
import { 
  LEAGUES, 
  getCurrentLeague, 
  generateLeagueCompetitors, 
  getLeagueRank, 
  getWeeklyLeaguePoints,
  getTimeRemaining,
  getLeagueReward,
  loadLeagueData,
  initializeLeague,
  updateWeeklyProgress
} from '../utils/leagueUtils';
import PlanBadge from '../components/UI/PlanBadge';

const LeaguesPage = () => {
  const { habits } = useHabits();
  const navigate = useNavigate();
  const [leagueData, setLeagueData] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0 });
  
  const canAccess = hasFeature('leagues');
  
  useEffect(() => {
    const data = initializeLeague(habits);
    setLeagueData(data);
    
    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemaining());
    }, 60000);
    
    setTimeRemaining(getTimeRemaining());
    
    return () => clearInterval(timer);
  }, [habits]);
  
  if (!canAccess) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔒</div>
        <h2 style={{ marginBottom: '12px' }}>Elite Feature</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Upgrade to Elite to access Habit Leagues
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/upgrade')}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: 'var(--primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer'
          }}
        >
          Upgrade to Elite →
        </motion.button>
      </div>
    );
  }
  
  if (!leagueData) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }
  
  const userRank = getLeagueRank(leagueData.competitors);
  const currentLeague = LEAGUES.find(l => l.id === leagueData.currentLeagueId) || LEAGUES[0];
  const reward = getLeagueReward(userRank, currentLeague);
  
  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', paddingBottom: '100px' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}
      >
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>
            Habit Leagues 🏅
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Compete with others and climb the ranks
          </p>
        </div>
        <PlanBadge />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '24px',
          padding: '32px',
          marginBottom: '32px',
          border: '2px solid',
          borderColor: currentLeague.color,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${currentLeague.color}20, transparent)`,
          pointerEvents: 'none'
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>{currentLeague.icon}</div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: currentLeague.color }}>
            {currentLeague.name} League
          </h2>
          <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
            Rank #{userRank} of {leagueData.competitors.length}
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: 'var(--bg)', padding: '20px', borderRadius: '16px' }}>
              <div style={{ fontSize: '32px', fontWeight: '700' }}>{leagueData.weeklyPoints}</div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Points this week</div>
            </div>
            <div style={{ backgroundColor: 'var(--bg)', padding: '20px', borderRadius: '16px' }}>
              <div style={{ fontSize: '32px', fontWeight: '700' }}>{leagueData.totalPoints}</div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Total points</div>
            </div>
            <div style={{ backgroundColor: 'var(--bg)', padding: '20px', borderRadius: '16px' }}>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>
                {timeRemaining.days}d {timeRemaining.hours}h
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Time remaining</div>
            </div>
          </div>
          
          {reward.promoted && (
            <div style={{ 
              padding: '12px 24px', 
              backgroundColor: '#22c55e20', 
              color: '#22c55e',
              borderRadius: '12px',
              display: 'inline-block',
              marginBottom: '16px'
            }}>
              🎉 Promotion zone! Keep pushing for top 3!
            </div>
          )}
          
          {reward.relegated && (
            <div style={{ 
              padding: '12px 24px', 
              backgroundColor: '#ef444420', 
              color: '#ef4444',
              borderRadius: '12px',
              display: 'inline-block',
              marginBottom: '16px'
            }}>
              ⚠️ Relegation zone! Need 2 more wins to stay safe!
            </div>
          )}
        </div>
      </motion.div>
      
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Leaderboard</h3>
        <div style={{ 
          backgroundColor: 'var(--surface)', 
          borderRadius: '16px', 
          overflow: 'hidden',
          border: '1px solid var(--border)'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '60px 1fr 120px 80px 80px', 
            padding: '16px',
            backgroundColor: 'var(--bg)',
            fontWeight: '600',
            fontSize: '12px',
            color: 'var(--text-secondary)'
          }}>
            <div>Rank</div>
            <div>Player</div>
            <div>Weekly Pts</div>
            <div>Habits</div>
            <div>Streak</div>
          </div>
          
          {leagueData.competitors.slice(0, 10).map((comp, idx) => (
            <motion.div
              key={comp.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr 120px 80px 80px',
                padding: '16px',
                alignItems: 'center',
                backgroundColor: comp.isUser ? 'var(--primary-light)' : idx < 3 ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                borderTop: '1px solid var(--border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {idx === 0 && '🥇'}
                {idx === 1 && '🥈'}
                {idx === 2 && '🥉'}
                {idx > 2 && <span style={{ fontWeight: '600' }}>#{comp.rank}</span>}
              </div>
              <div style={{ fontWeight: comp.isUser ? '600' : '400', color: comp.isUser ? 'var(--primary)' : 'var(--text)' }}>
                {comp.name}
              </div>
              <div style={{ fontWeight: '600' }}>{comp.weeklyPoints} pts</div>
              <div style={{ color: 'var(--text-secondary)' }}>{comp.habits}</div>
              <div style={{ color: 'var(--text-secondary)' }}>🔥 {comp.streak}</div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>How Leagues Work</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ backgroundColor: 'var(--surface)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📈</div>
            <div style={{ fontWeight: '600', marginBottom: '8px' }}>Earn Points</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Complete habits to earn points. Harder habits = more points!
            </div>
          </div>
          <div style={{ backgroundColor: 'var(--surface)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏆</div>
            <div style={{ fontWeight: '600', marginBottom: '8px' }}>Climb Ranks</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Top performers get promoted. Bottom 5 get relegated weekly.
            </div>
          </div>
          <div style={{ backgroundColor: 'var(--surface)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎁</div>
            <div style={{ fontWeight: '600', marginBottom: '8px' }}>Earn Rewards</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Top 3 earn bonus points and badges at end of each week!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaguesPage;