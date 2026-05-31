import { motion } from 'framer-motion';

const categoryColors = {
  Health: { bg: '#14b8a6', text: '#ffffff' },
  Work: { bg: '#3b82f6', text: '#ffffff' },
  Personal: { bg: '#8b5cf6', text: '#ffffff' },
  Fitness: { bg: '#f97316', text: '#ffffff' },
  Learning: { bg: '#f59e0b', text: '#ffffff' },
};

const priorityColors = {
  High: { bg: '#ef4444', text: '#ffffff' },
  Medium: { bg: '#f59e0b', text: '#ffffff' },
  Low: { bg: '#22c55e', text: '#ffffff' },
};

const categoryIcons = {
  Health: '🏥',
  Work: '💼',
  Personal: '🏠',
  Fitness: '💪',
  Learning: '📚',
};

export const CategoryBadge = ({ category, size = 'md' }) => {
  const colors = categoryColors[category] || categoryColors.Personal;
  const icon = categoryIcons[category] || '📌';
  const padding = size === 'sm' ? '4px 8px' : '6px 12px';
  const fontSize = size === 'sm' ? '12px' : '14px';

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        padding,
        fontSize,
        borderRadius: '12px',
        fontWeight: '500',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        whiteSpace: 'nowrap',
      }}
    >
      <span>{icon}</span>
      <span>{category}</span>
    </motion.span>
  );
};

export const PriorityBadge = ({ priority, size = 'md' }) => {
  const colors = priorityColors[priority] || priorityColors.Medium;
  const padding = size === 'sm' ? '4px 8px' : '6px 12px';
  const fontSize = size === 'sm' ? '11px' : '13px';

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        padding,
        fontSize,
        borderRadius: '10px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        display: 'inline-block',
      }}
    >
      {priority}
    </motion.span>
  );
};

export default CategoryBadge;
