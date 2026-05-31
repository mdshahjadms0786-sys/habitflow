import { getDifficultyLevel } from '../../utils/difficultyUtils';

const DifficultyBadge = ({ difficulty = 'medium', size = 'md' }) => {
  const level = getDifficultyLevel(difficulty);
  
  if (size === 'sm') {
    return (
      <span style={{ fontSize: '16px', lineHeight: 1 }} title={level.label}>
        {level.emoji}
      </span>
    );
  }
  
  if (size === 'lg') {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '16px',
          backgroundColor: level.bgColor,
          border: `1px solid ${level.color}`,
        }}
      >
        <span style={{ fontSize: '18px' }}>{level.emoji}</span>
        <span style={{ fontSize: '13px', fontWeight: '600', color: level.color }}>
          {level.label} • {level.points} pts
        </span>
      </div>
    );
  }
  
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        borderRadius: '12px',
        backgroundColor: level.bgColor,
        border: `1px solid ${level.color}`,
      }}
    >
      <span style={{ fontSize: '14px' }}>{level.emoji}</span>
      <span style={{ fontSize: '11px', fontWeight: '600', color: level.color }}>
        {level.label}
      </span>
    </div>
  );
};

export default DifficultyBadge;