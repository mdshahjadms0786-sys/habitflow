import { motion } from 'framer-motion';
import { useWeather } from '../../hooks/useWeather';

const WeatherCard = ({ habits = [] }) => {
  const { weather, advice, isLoading, error, refresh } = useWeather(habits);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          background: 'var(--surface)',
          borderRadius: '12px',
          padding: '12px',
          border: '1px solid var(--border)',
          minHeight: '80px',
        }}
      >
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>Loading weather...</p>
      </motion.div>
    );
  }

  if (error || !weather) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={refresh}
        whileHover={{ scale: 1.01 }}
        style={{
          background: 'var(--surface)',
          borderRadius: '12px',
          padding: '12px',
          border: '1px solid var(--border)',
          cursor: 'pointer',
        }}
      >
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
          Enable location for weather sync
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        background: 'var(--surface)',
        borderRadius: '12px',
        padding: '12px',
        border: '1px solid var(--border)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '28px' }}>{weather.icon}</span>
          <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>{weather.temp}°</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={refresh}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
        >
          🔄
        </motion.button>
      </div>
      <p style={{ margin: 0, fontSize: '12px', color: weather.isOutdoorFriendly ? '#22c55e' : '#EF4444' }}>
        {weather.isOutdoorFriendly ? '✅ Good day for outdoor habits!' : '🏠 Indoor day today'}
      </p>
      {advice.length > 0 && (
        <div style={{ marginTop: '6px', fontSize: '11px', color: '#EAB308' }}>
          {advice[0].advice}
        </div>
      )}
    </motion.div>
  );
};

export default WeatherCard;