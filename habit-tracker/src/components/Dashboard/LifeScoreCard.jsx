import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateLifeScore } from '../../utils/lifeScoreUtils';

const LifeScoreCard = ({ habits = [], moodLog = {}, compact = true }) => {
  const navigate = useNavigate();
  const [score, setScore] = useState({ overall: 0, grade: 'N/A', physical: { score: 0 }, mental: { score: 0 }, productivity: { score: 0 }, social: { score: 0 } });

  useEffect(() => {
    const calculated = calculateLifeScore(habits, moodLog);
    if (calculated) {
      setScore(calculated);
    } else {
      setScore({ 
        overall: 0, 
        grade: 'N/A', 
        physical: { score: 0, icon: '💪' },
        mental: { score: 0, icon: '🧠' },
        productivity: { score: 0, icon: '💼' },
        social: { score: 0, icon: '🤝' }
      });
    }
  }, [habits, moodLog]);

  if (score.overall === 0 && score.grade === 'N/A') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ background: 'var(--surface)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎯</div>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>Complete habits to see your Life Score</p>
      </motion.div>
    );
  }

  const getColor = (s) => s >= 75 ? '#22c55e' : s >= 50 ? '#EAB308' : '#EF4444';

  if (compact) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => navigate('/life-score')}
        style={{ background: 'var(--surface)', borderRadius: '12px', padding: '12px', border: '1px solid var(--border)', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '24px', fontWeight: 700, color: getColor(score.overall) }}>{score.overall}</span>
            <span style={{ fontSize: '14px', marginLeft: '6px', color: getColor(score.overall) }}>{score.grade}</span>
          </div>
          <span style={{ fontSize: '12px', color: score.trend === 'improving' ? '#22c55e' : score.trend === 'declining' ? '#EF4444' : 'var(--text-secondary)' }}>
            {score.trend === 'improving' ? '↑' : score.trend === 'declining' ? '↓' : '→'}
          </span>
        </div>
        <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>Life Score</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: 'var(--surface)', borderRadius: '16px', padding: '20px', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <div style={{ position: 'relative', width: '140px', height: '140px' }}>
          <svg style={{ transform: 'rotate(-90deg)', width: '140px', height: '140px' }}>
            <circle cx="70" cy="70" r="60" fill="none" stroke="var(--border)" strokeWidth="12" />
            <circle cx="70" cy="70" r="60" fill="none" stroke={getColor(score.overall)} strokeWidth="12"
              strokeDasharray={`${score.overall * 3.77} 377`} strokeLinecap="round" />
          </svg>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <span style={{ fontSize: '36px', fontWeight: 700, color: getColor(score.overall) }}>{score.overall}</span>
            <p style={{ margin: 0, fontSize: '18px', color: getColor(score.overall) }}>{score.grade}</p>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {[{...score.physical, name: 'Physical'}, {...score.mental, name: 'Mental'}, {...score.productivity, name: 'Productivity'}, {...score.social, name: 'Social'}].map((dim, i) => (
          <div key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
            <span style={{ fontSize: '16px' }}>{dim.icon}</span>
            <p style={{ margin: '4px 0', fontSize: '12px', color: 'var(--text)' }}>{dim.name}</p>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#8B5CF6' }}>{dim.score}%</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default LifeScoreCard;