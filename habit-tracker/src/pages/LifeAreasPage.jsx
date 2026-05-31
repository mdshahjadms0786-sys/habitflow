import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '../hooks/useHabits';
import { hasFeature } from '../utils/planUtils';
import { 
  LIFE_AREAS, 
  calculateAllAreaScores, 
  getWeakestArea, 
  getStrongestArea, 
  getBalanceScore,
  getAreaInsights,
  getSuggestedHabitsForArea
} from '../utils/lifeAreasUtils';
import WheelOfLife from '../components/LifeAreas/WheelOfLife';
import AreaCard from '../components/LifeAreas/AreaCard';
import PlanBadge from '../components/UI/PlanBadge';

const LifeAreasPage = () => {
  const { habits } = useHabits();
  const navigate = useNavigate();
  const [scores, setScores] = useState({});
  
  const canAccess = hasFeature('lifeAreas');
  
  useEffect(() => {
    if (habits && habits.length > 0) {
      const newScores = calculateAllAreaScores(habits);
      setScores(newScores);
    } else {
      setScores({});
    }
  }, [habits]);
  
  if (!canAccess) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔒</div>
        <h2 style={{ marginBottom: '12px' }}>Pro Feature</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Upgrade to Pro to access Life Areas Dashboard
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
          Upgrade to Pro →
        </motion.button>
      </div>
    );
  }
  
  const balance = getBalanceScore(scores);
  const strongest = getStrongestArea(scores);
  const weakest = getWeakestArea(scores);
  const insights = getAreaInsights(scores, habits);
  
  const sortedAreas = LIFE_AREAS.map(a => ({
    ...a,
    score: scores[a.id]
  })).sort((a, b) => (a.score || 100) - (b.score || 100));
  
  const handleImprove = (areaId) => {
    const suggestions = getSuggestedHabitsForArea(areaId);
    navigate('/habits', { state: { suggestHabits: suggestions, areaId } });
  };
  
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', paddingBottom: '100px' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}
      >
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>
            Life Areas Dashboard 🗺️
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Track your balance across all life areas
          </p>
        </div>
        <PlanBadge />
      </motion.div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '32px', marginBottom: '40px' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '24px',
            padding: '32px',
            border: '1px solid var(--border)'
          }}
        >
          <WheelOfLife scores={scores} size={320} onAreaClick={handleImprove} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <div style={{ 
            backgroundColor: 'var(--surface)', 
            borderRadius: '16px', 
            padding: '24px',
            border: '1px solid var(--border)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--primary)' }}>{balance}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Balance Score</div>
              </div>
              {strongest && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px' }}>{LIFE_AREAS.find(a => a.id === strongest)?.icon}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {LIFE_AREAS.find(a => a.id === strongest)?.name}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>{scores[strongest]}%</div>
                </div>
              )}
              {weakest && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px' }}>{LIFE_AREAS.find(a => a.id === weakest)?.icon}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {LIFE_AREAS.find(a => a.id === weakest)?.name}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#ef4444' }}>{scores[weakest]}%</div>
                </div>
              )}
            </div>
          </div>
          
          {insights.length > 0 && (
            <div style={{ 
              backgroundColor: 'var(--primary-light)', 
              borderRadius: '16px', 
              padding: '20px',
              border: '1px solid var(--primary)'
            }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: 'var(--primary)' }}>
                💡 Insights
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {insights.map((insight, idx) => (
                  <div key={idx} style={{ fontSize: '14px' }}>{insight}</div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
      
      <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>All Life Areas</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {sortedAreas.map(area => (
          <AreaCard
            key={area.id}
            areaId={area.id}
            score={scores[area.id]}
            habits={habits}
            onImprove={handleImprove}
          />
        ))}
      </div>
    </div>
  );
};

export default LifeAreasPage;