export const VISION_CATEGORIES = [
  { id: 'health', label: 'Health & Fitness', icon: '💪', color: '#1D9E75' },
  { id: 'wealth', label: 'Wealth & Finance', icon: '💰', color: '#BA7517' },
  { id: 'relationships', label: 'Relationships', icon: '❤️', color: '#E24B4A' },
  { id: 'career', label: 'Career & Growth', icon: '🚀', color: '#534AB7' },
  { id: 'lifestyle', label: 'Lifestyle', icon: '✨', color: '#EC4899' },
  { id: 'education', label: 'Education', icon: '📚', color: '#0EA5E9' }
];

export const VISION_EMOJIS = {
  health: ['💪', '🏃', '🥗', '💧', '😴', '🧘', '🏋️', '🚴', '🍎'],
  wealth: ['💰', '🏦', '📈', '🏠', '💎', '👑', '🌟', '💵'],
  relationships: ['❤️', '💕', '🤝', '👨‍👩‍👧', '👫', '🎉', '🥰', '💑'],
  career: ['🚀', '💼', '🎯', '🏆', '✨', '🔥', '⚡', '📊'],
  lifestyle: ['✨', '✈️', '🌴', '🏖️', '🎨', '🎵', '📸', '🛋️'],
  education: ['📚', '🎓', '💡', '🔬', '🎨', '🎵', '📖', '🧠']
};

export const getCategoryEmojis = (categoryId) => {
  return VISION_EMOJIS[categoryId] || VISION_EMOJIS.lifestyle;
};

export const getCategoryInfo = (categoryId) => {
  return VISION_CATEGORIES.find(c => c.id === categoryId) || VISION_CATEGORIES[4];
};

const STORAGE_KEY = 'ht_visions';

export const saveVisions = (visions) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visions));
  } catch (e) {
    console.error('Failed to save visions', e);
  }
};

export const loadVisions = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to load visions', e);
    return [];
  }
};

export const createVision = (data) => {
  const category = getCategoryInfo(data.category);
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    title: data.title,
    emoji: data.emoji,
    category: data.category,
    description: data.description || '',
    targetDate: data.targetDate || null,
    relatedHabitIds: data.relatedHabitIds || [],
    color: data.color || category.color,
    createdAt: new Date().toISOString(),
    isAchieved: false,
    achievedAt: null
  };
};

export const updateVision = (visions, updatedVision) => {
  return visions.map(v => v.id === updatedVision.id ? updatedVision : v);
};

export const deleteVision = (visions, visionId) => {
  return visions.filter(v => v.id !== visionId);
};

export const markVisionAchieved = (visions, visionId) => {
  return visions.map(v => {
    if (v.id === visionId) {
      return { ...v, isAchieved: true, achievedAt: new Date().toISOString() };
    }
    return v;
  });
};

export const getVisionStats = (visions, habits) => {
  const total = visions.length;
  const achieved = visions.filter(v => v.isAchieved).length;
  const inProgress = total - achieved;
  const connectedHabits = new Set(visions.flatMap(v => v.relatedHabitIds)).size;
  
  return { total, achieved, inProgress, connectedHabits };
};

export default { VISION_CATEGORIES, VISION_EMOJIS, saveVisions, loadVisions, createVision, getVisionStats };