import { motion } from 'framer-motion';
import { LIFE_AREAS } from '../../utils/lifeAreasUtils';

const AreaCard = ({ areaId, score, habits, onImprove }) => {
  const area = LIFE_AREAS.find(a => a.id === areaId);
  if (!area) return null;
  
  const getLabel = () => {
    if (score === null) return { text: 'No data', emoji: '❓' };
    if (score >= 80) return { text: 'Thriving', emoji: '🌟' };
    if (score >= 60) return { text: 'Good', emoji: '👍' };
    if (score >= 40) return { text: 'Needs Work', emoji: '⚠️' };
    return { text: 'Critical', emoji: '🚨' };
  };
  
  const label = getLabel();
  const matchingHabits = habits.filter(h => {
    const categoryMatch = area.habitCategories?.includes(h.category);
    const keywordMatch = area.keywords?.some(kw => 
      h.name.toLowerCase().includes(kw) ||
      (h.category && h.category.toLowerCase().includes(kw))
    );
    return categoryMatch || keywordMatch;
  }).slice(0, 3);
  
  const today = new Date();
  const lastWeekHabits = matchingHabits.map(h => {
    let completions = 0;
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      if (h.completionLog?.[dateStr]?.completed) completions++;
    }
    return { name: h.name, icon: h.icon, rate: Math.round((completions / 7) * 100) };
  });
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '16px',
        padding: '20px',
        border: `1px solid ${area.color}40`
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ fontSize: '32px' }}>{area.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '16px', fontWeight: '600' }}>{area.name}</div>
          <div style={{ fontSize: '12px', color: area.color }}>
            {area.description}
          </div>
        </div>
        <div style={{
          padding: '8px 16px',
          borderRadius: '20px',
          backgroundColor: score !== null ? `${area.color}20` : 'var(--bg)',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: '700',
            color: score !== null ? area.color : 'var(--text-secondary)'
          }}>
            {score !== null ? score : '-'}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>%</div>
        </div>
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <div style={{ 
          height: '8px', 
          backgroundColor: 'var(--border)', 
          borderRadius: '4px', 
          overflow: 'hidden',
          marginBottom: '8px'
        }}>
          <div style={{ 
            width: `${score || 0}%`, 
            height: '100%', 
            backgroundColor: area.color,
            borderRadius: '4px'
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {label.emoji} {label.text}
          </span>
        </div>
      </div>
      
      {matchingHabits.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-secondary)' }}>
            Related habits:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {lastWeekHabits.map((h, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                <span>{h.icon}</span>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {h.name}
                </span>
                <span style={{ color: h.rate >= 70 ? '#22c55e' : h.rate >= 40 ? '#f59e0b' : '#ef4444' }}>
                  {h.rate}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onImprove?.(areaId)}
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '14px',
          fontWeight: '500',
          backgroundColor: 'transparent',
          border: `1px solid ${area.color}`,
          color: area.color,
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Improve this area →
      </motion.button>
    </motion.div>
  );
};

export default AreaCard;