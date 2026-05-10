export const BADGES = [
  { id: 'bronze', name: 'Bronze Beginner', emoji: '🥉', requiredDays: 7, color: '#CD7F32' },
  { id: 'silver', name: 'Silver Warrior', emoji: '🥈', requiredDays: 21, color: '#C0C0C0' },
  { id: 'gold', name: 'Gold Champion', emoji: '🥇', requiredDays: 66, color: '#FFD700' },
  { id: 'diamond', name: 'Diamond Legend', emoji: '💎', requiredDays: 100, color: '#B9F2FF' },
  { id: 'rocket', name: 'Rocket Master', emoji: '🚀', requiredDays: 200, color: '#534AB7' },
];

export const getEarnedBadges = (currentStreak) => {
  return BADGES.filter((badge) => currentStreak >= badge.requiredDays);
};

export const getNextBadge = (currentStreak) => {
  const nextBadge = BADGES.find((badge) => currentStreak < badge.requiredDays);
  if (!nextBadge) return null;
  return {
    badge: nextBadge,
    daysLeft: nextBadge.requiredDays - currentStreak,
  };
};

export const getTotalBadgesEarned = (habits) => {
  return habits.reduce((total, habit) => {
    return total + getEarnedBadges(habit.currentStreak || 0).length;
  }, 0);
};

export const getHallOfFame = (habits) => {
  if (!habits || habits.length === 0) return null;

  const habitBadgeCounts = habits.map((habit) => ({
    habit,
    badgeCount: getEarnedBadges(habit.currentStreak || 0).length,
  }));

  habitBadgeCounts.sort((a, b) => b.badgeCount - a.badgeCount);
  return habitBadgeCounts[0]?.habit || null;
};

export const checkNewBadge = (oldStreak, newStreak) => {
  if (newStreak <= oldStreak) return null;

  for (const badge of BADGES) {
    if (oldStreak < badge.requiredDays && newStreak >= badge.requiredDays) {
      return badge;
    }
  }
  return null;
};
