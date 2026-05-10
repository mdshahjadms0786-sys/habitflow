import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { calculateCompoundGrowth, getHabitCompoundStats, generateCompoundInsight } from '../../utils/compoundUtils';

const CompoundCalculator = ({ habits, style }) => {
  const [dailyRate, setDailyRate] = useState(1);
  const [startValue, setStartValue] = useState(100);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const data = [];
    for (let i = 0; i <= 30; i++) {
      data.push({
        day: i,
        value: Math.round(startValue * Math.pow(1 + dailyRate / 100, i))
      });
    }
    setChartData(data);
  }, [dailyRate, startValue]);

  const progress = calculateCompoundGrowth(startValue, dailyRate, 365);
  const multiplier = Math.round(progress.day365 / startValue);
  const insight = generateCompoundInsight(habits);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '24px',
        backgroundColor: 'var(--surface)',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        ...style
      }}
    >
      <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Compound Effect 💹</h2>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px' }}>Daily improvement rate: {dailyRate}%</label>
        <input
          type="range"
          min={0.1}
          max={5}
          step={0.1}
          value={dailyRate}
          onChange={(e) => setDailyRate(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ height: '200px', marginBottom: '16px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="day" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Line type="monotone" dataKey="value" stroke="#534AB7" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#EEEDFE', borderRadius: '12px' }}>
        <div style={{ fontSize: '24px', fontWeight: '700', color: '#534AB7' }}>{multiplier}x better 🚀</div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>After 365 days</div>
      </div>

      {insight && (
        <p style={{ margin: '16px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          {insight}
        </p>
      )}
    </motion.div>
  );
};

export default CompoundCalculator;