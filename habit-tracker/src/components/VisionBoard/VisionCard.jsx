import { motion } from 'framer-motion';
import { getCategoryInfo } from '../../utils/visionUtils';

const VisionCard = ({ vision, onEdit, onDelete, onAchieve, habits = [], style }) => {
  const category = getCategoryInfo(vision.category);
  const relatedHabits = habits.filter(h => vision.relatedHabitIds?.includes(h.id));

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        width: '160px',
        minHeight: '200px',
        padding: '16px',
        borderRadius: '12px',
        border: `1px solid var(--border)`,
        backgroundColor: vision.isAchieved ? '#dcfce7' : `${vision.color}15`,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        ...style
      }}
    >
      {vision.isAchieved && (
        <div
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            backgroundColor: '#22c55e',
            borderRadius: '50%',
            padding: '4px 8px',
            fontSize: '12px',
          }}
        >
          ✅
        </div>
      )}

      <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '12px' }}>
        {vision.emoji}
      </div>

      <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text)', marginBottom: '4px', textAlign: 'center' }}>
        {vision.title}
      </div>

      <div
        style={{
          fontSize: '11px',
          padding: '2px 8px',
          backgroundColor: category.color,
          color: '#fff',
          borderRadius: '10px',
          textAlign: 'center',
          marginBottom: '8px',
          alignSelf: 'center',
        }}
      >
        {category.icon} {category.label}
      </div>

      {vision.description && (
        <div
          style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            flex: 1,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            marginBottom: '8px',
          }}
        >
          {vision.description}
        </div>
      )}

      {vision.targetDate && (
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
          By {formatDate(vision.targetDate)}
        </div>
      )}

      {relatedHabits.length > 0 && (
        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          {relatedHabits.length} habit{relatedHabits.length > 1 ? 's' : ''} working toward this
        </div>
      )}

      {vision.isAchieved && (
        <div style={{ fontSize: '12px', fontWeight: '600', color: '#16a34a', marginTop: 'auto' }}>
          Achieved! 🎉
        </div>
      )}

      {!vision.isAchieved && onAchieve && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => { e.stopPropagation(); onAchieve(vision.id); }}
          style={{
            marginTop: 'auto',
            padding: '6px 12px',
            fontSize: '11px',
            backgroundColor: category.color,
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Mark Done
        </motion.button>
      )}

      {!vision.isAchieved && (
        <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
          {onEdit && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={(e) => { e.stopPropagation(); onEdit(vision); }}
              style={{
                padding: '4px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                opacity: 0.6,
              }}
            >
              ✏️
            </motion.button>
          )}
          {onDelete && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={(e) => { e.stopPropagation(); onDelete(vision.id); }}
              style={{
                padding: '4px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                opacity: 0.6,
              }}
            >
              🗑️
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default VisionCard;