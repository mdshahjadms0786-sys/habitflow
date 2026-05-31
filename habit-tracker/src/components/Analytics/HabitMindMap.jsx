import { motion } from 'framer-motion';

const CATEGORY_COLORS = {
  Health: '#14b8a6',
  Work: '#3b82f6',
  Personal: '#8b5cf6',
  Fitness: '#f97316',
  Learning: '#f59e0b'
};

const HabitMindMap = ({ habits, onSelectHabit, style }) => {
  const categories = [...new Set(habits.map(h => h.category || 'Personal'))];
  
  const categoryPositions = categories.reduce((acc, cat, i) => {
    const angle = (i / categories.length) * 2 * Math.PI;
    acc[cat] = { x: 200 + Math.cos(angle) * 120, y: 150 + Math.sin(angle) * 100 };
    return acc;
  }, {});

  const getSize = (streak) => Math.min(40, 20 + streak);
  const getColor = (rate) => rate >= 80 ? '#22c55e' : rate >= 50 ? '#f59e0b' : '#dc2626';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        width: '100%',
        height: '350px',
        overflow: 'hidden',
        ...style
      }}
    >
      <svg viewBox="0 0 400 300" style={{ width: '100%', height: '100%' }}>
        <circle cx="200" cy="150" r="50" fill="#534AB7" opacity="0.2" />
        <circle cx="200" cy="150" r="40" fill="#534AB7" opacity="0.4" />
        <circle cx="200" cy="150" r="30" fill="#534AB7" />
        
        <text x="200" y="145" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">MY</text>
        <text x="200" y="158" textAnchor="middle" fill="#fff" fontSize="8">HABITS</text>

        {Object.entries(categoryPositions).map(([cat, pos]) => (
          <g key={cat}>
            <line x1="200" y1="150" x2={pos.x} y2={pos.y} stroke="#534AB7" strokeWidth="2" opacity="0.3" />
            <circle cx={pos.x} cy={pos.y} r="25" fill={CATEGORY_COLORS[cat] || '#8b5cf6'} opacity="0.3" />
            <text x={pos.x} y={pos.y} textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">{cat}</text>
          </g>
        ))}
        
        {habits.slice(0, 10).map((h, i) => {
          const catPos = categoryPositions[h.category || 'Personal'];
          if (!catPos) return null;
          const angle = (i / Math.min(habits.length, 10)) * 2 * Math.PI;
          const x = catPos.x + Math.cos(angle) * 30;
          const y = catPos.y + Math.sin(angle) * 30;
          const completions = Object.keys(h.completionLog || {}).length;
          const rate = Math.min(100, Math.round((completions / 30) * 100));
          
          return (
            <g key={h.id} onClick={() => onSelectHabit && onSelectHabit(h)}>
              <circle cx={x} cy={y} r={getSize(h.currentStreak || 1)} fill={getColor(rate)} opacity="0.8" style={{ cursor: 'pointer' }} />
              <text x={x} y={y + 1} textAnchor="middle" fontSize="12">{h.icon || '⭐'}</text>
            </g>
          );
        })}
      </svg>
    </motion.div>
  );
};

export default HabitMindMap;