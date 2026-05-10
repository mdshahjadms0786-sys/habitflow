const AVATAR_KEY = 'ht_avatar';

export const AVATAR_ITEMS = {
  bases: ['😊', '😎', '🤩', '😄'],
  accessories: [
    { id: 'crown', emoji: '👑', cost: 500, unlockLevel: 5 },
    { id: 'sunglasses', emoji: '🕶️', cost: 200, unlockLevel: 2 },
    { id: 'hat', emoji: '🎩', cost: 300, unlockLevel: 3 },
    { id: 'fire', emoji: '🔥', cost: 150, streakRequired: 7 },
    { id: 'star', emoji: '⭐', cost: 100, unlockLevel: 1 },
    { id: 'rocket', emoji: '🚀', cost: 500, streakRequired: 30 }
  ],
  backgrounds: [
    { id: 'purple', color: '#EEEDFE', cost: 0 },
    { id: 'gold', color: '#FAEEDA', cost: 300 },
    { id: 'green', color: '#E1F5EE', cost: 200 }
  ]
};

export const getAvatar = () => {
  try { return JSON.parse(localStorage.getItem(AVATAR_KEY)) || { base: '😊', accessory: null, background: 'purple' }; }
  catch { return { base: '😊', accessory: null, background: 'purple' }; }
};

export const saveAvatar = (avatar) => localStorage.setItem(AVATAR_KEY, JSON.stringify(avatar));

export const getLevelFromPoints = (points) => {
  const levels = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500, 6600, 7800, 9100, 10500];
  return levels.findIndex(t => points < t) || 20;
};

export const getUnlockedItems = (points, streak) => {
  const level = getLevelFromPoints(points);
  return AVATAR_ITEMS.accessories.map(i => ({ ...i, unlocked: (i.unlockLevel && level >= i.unlockLevel) || (i.streakRequired && streak >= i.streakRequired) }));
};