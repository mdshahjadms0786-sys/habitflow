import { motion } from 'framer-motion';
import { predictTodaySuccess } from '../../utils/predictorUtils';

const PredictionCard = ({ habits, moodLog, weatherData, style }) => {
  const prediction = predictTodaySuccess(habits, moodLog, weatherData);
  
  const bestFactor = prediction.factors?.find(f => f.impact === 'positive');
  const confidenceColor = prediction.confidence >= 80 ? '#22c55e' : prediction.confidence >= 60 ? '#f59e0b' : '#dc2626';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '16px',
        backgroundColor: 'var(--surface)',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        ...style
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <span style={{ fontSize: '18px' }}>🔮</span>
        <span style={{ fontSize: '14px', fontWeight: '600' }}>Today's Prediction</span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text)' }}>
          {prediction.predictedCount}/{habits.length}
        </span>
        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>habits predicted</span>
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Confidence</span>
          <span style={{ fontWeight: '600', color: confidenceColor }}>{prediction.confidence}%</span>
        </div>
        <div style={{ height: '4px', backgroundColor: 'var(--border)', borderRadius: '2px' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${prediction.confidence}%` }}
            style={{ height: '100%', backgroundColor: confidenceColor, borderRadius: '2px' }}
          />
        </div>
      </div>
      
      {bestFactor && (
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Key factor: <span style={{ color: '#22c55e' }}>+{bestFactor.score}%</span> {bestFactor.name}
        </div>
      )}
    </motion.div>
  );
};

export default PredictionCard;