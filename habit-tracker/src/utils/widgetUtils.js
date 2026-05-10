export const generateWidgetData = (type, habits, stats) => {
  const bestHabit = habits?.reduce((best, h) => (h.currentStreak || 0) > (best?.currentStreak || 0) ? h : best, habits?.[0]);
  
  switch (type) {
    case 'streak':
      return {
        type: 'streak',
        emoji: '🔥',
        number: bestHabit?.currentStreak || 0,
        label: 'Day Streak',
        habit: bestHabit?.name || 'No habits',
        color: '#534AB7'
      };
    case 'weekly':
      return { type: 'weekly', habits, completionRate: stats?.completionRate || 0 };
    case 'achievement':
      return { type: 'achievement', stats };
    case 'dna':
      return { type: 'dna', habits };
    case 'motivational':
      return { type: 'motivational', stats };
    default:
      return {};
  }
};

export const downloadWidget = async (canvasRef) => {};
export const copyWidget = async (canvasRef) => {};

export default { generateWidgetData, downloadWidget, copyWidget };