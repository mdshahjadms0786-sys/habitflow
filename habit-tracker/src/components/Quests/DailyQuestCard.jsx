import { motion } from 'framer-motion';

const difficultyColors = {
  easy: '#1D9E75',
  medium: '#BA7517',
  hard: '#E24B4A'
};

const difficultyColorsHard = {
  easy: '#22c55e',
  medium: '#f59e0b',
  hard: '#ef4444'
};

const DailyQuestCard = ({ quest, progress = 0, isComplete = false, index = 0 }) => {
  const difficultyColor = difficultyColors[quest.difficulty] || '#8b5cf6';
  const completeColor = difficultyColorsHard[quest.difficulty] || '#22c55e';

  const getProgressText = () => {
    if (!quest) return '0/0';
    if (quest.type === 'all') {
      return isComplete ? '✅ Done' : `${quest.progress || 0}/all`;
    }
    if (quest.type === 'count' || quest.type === 'categories') {
      return isComplete ? '✅ Done' : `${quest.progress || 0}/${quest.target || 'goal'}`;
    }
    if (quest.type === 'streak' || quest.type === 'streak_count') {
      return isComplete ? '✅ Done' : '1 streak';
    }
    if (quest.type === 'category') {
      return isComplete ? '✅ Done' : `${quest.target}`;
    }
    if (quest.type === 'time') {
      return isComplete ? '✅ Done' : 'before 9AM';
    }
    if (quest.type === 'time_after') {
      return isComplete ? '✅ Done' : 'after 6PM';
    }
    if (quest.type === 'focus') {
      return isComplete ? '✅ Done' : '1 session';
    }
    if (quest.type === 'mood') {
      return isComplete ? '✅ Done' : 'log mood';
    }
    return isComplete ? '✅ Done' : `${quest.progress || 0}/${quest.target}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      style={{
        backgroundColor: isComplete ? 'rgba(34, 197, 94, 0.1)' : 'var(--surface)',
        borderRadius: '12px',
        padding: '12px',
        border: '1px solid var(--border)',
        borderLeft: `3px solid ${isComplete ? completeColor : difficultyColor}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        height: 'auto',
        minHeight: '80px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isComplete ? completeColor : difficultyColor,
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: '24px', lineHeight: 1 }}>{quest.icon}</span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {quest.title}
          </p>
          <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
            {quest.description}
          </p>
        </div>

        <div
          style={{
            padding: '4px 8px',
            backgroundColor: isComplete ? '#22c55e20' : difficultyColor + '20',
            borderRadius: '6px',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: '600', color: isComplete ? '#22c55e' : difficultyColor }}>
            +{quest.points} pts
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
          <div
            style={{
              width: isComplete ? '100%' : `${Math.min(100, progress)}%`,
              height: '100%',
              backgroundColor: isComplete ? '#22c55e' : difficultyColor,
              borderRadius: '3px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        <span style={{ fontSize: '10px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', minWidth: '60px', textAlign: 'right' }}>
          {getProgressText()}
        </span>
      </div>

      {isComplete && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ margin: 0, fontSize: '11px', color: '#22c55e', fontWeight: '500' }}
        >
          ✅ Completed! +{quest.points} pts earned
        </motion.p>
      )}
    </motion.div>
  );
};

export default DailyQuestCard;