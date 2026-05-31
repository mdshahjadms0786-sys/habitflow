import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { loadPoints, getCurrentLevel, getNextLevel, getProgressToNextLevel } from '../../utils/pointsUtils';

const PointsDisplay = () => {
  const points = useMemo(() => loadPoints(), []);
  const currentLevel = useMemo(() => getCurrentLevel(), [points]);
  const nextLevel = useMemo(() => getNextLevel(), [points]);
  const progress = useMemo(() => getProgressToNextLevel(), [points]);

  return (
    <div style={{ backgroundColor: 'var(--surface)', borderRadius: '12px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <span style={{ fontSize: '32px' }}>{currentLevel.icon}</span>
        <div>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
            Level {currentLevel.level}: {currentLevel.name}
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
            {points} points
          </p>
        </div>
      </div>

      {nextLevel && (
        <>
          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <span>Progress to {nextLevel.name}</span>
              <span>{progress}%</span>
            </div>
            <div style={{ height: '8px', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                style={{ height: '100%', backgroundColor: 'var(--primary)', borderRadius: '4px' }}
              />
            </div>
          </div>
          <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center' }}>
            {nextLevel.minPoints - points} points to next level
          </p>
        </>
      )}

      {!nextLevel && (
        <p style={{ margin: 0, fontSize: '12px', color: '#22c55e', textAlign: 'center' }}>
          🎉 Maximum level reached!
        </p>
      )}
    </div>
  );
};

export default PointsDisplay;