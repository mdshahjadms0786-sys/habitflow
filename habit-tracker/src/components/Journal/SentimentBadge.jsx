import { motion } from 'framer-motion';

const SentimentBadge = ({ score, label, emoji, size = 'compact' }) => {
  const isPositive = score > 5;
  const isNegative = score < -5;
  const isNeutral = !isPositive && !isNegative;

  const getColors = () => {
    if (isPositive) return { bg: '#dcfce7', text: '#16a34a' };
    if (isNegative) return { bg: '#fef2f2', text: '#dc2626' };
    return { bg: '#f3f4f6', text: '#6b7280' };
  };

  const colors = getColors();
  const fontSize = size === 'compact' ? '10px' : '12px';
  const padding = size === 'compact' ? '2px 6px' : '4px 10px';

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding,
        borderRadius: '12px',
        backgroundColor: colors.bg,
        color: colors.text,
        fontSize,
        fontWeight: '500',
        whiteSpace: 'nowrap',
      }}
    >
      <span>{emoji}</span>
      <span>{label || (isPositive ? 'Positive' : isNegative ? 'Negative' : 'Neutral')}</span>
    </motion.span>
  );
};

export default SentimentBadge;