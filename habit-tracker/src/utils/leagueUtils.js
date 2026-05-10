const LEAGUE_DATA_KEY = 'ht_league_data';

export const LEAGUES = [
  { id: 'bronze', name: 'Bronze', icon: '🥉', color: '#CD7F32', minPoints: 0, maxPoints: 499, slots: 20 },
  { id: 'silver', name: 'Silver', icon: '🥈', color: '#C0C0C0', minPoints: 500, maxPoints: 1499, slots: 20 },
  { id: 'gold', name: 'Gold', icon: '🥇', color: '#FFD700', minPoints: 1500, maxPoints: 3999, slots: 20 },
  { id: 'diamond', name: 'Diamond', icon: '💎', color: '#B9F2FF', minPoints: 4000, maxPoints: 9999, slots: 15 },
  { id: 'legend', name: 'Legend', icon: '👑', color: '#FF6B6B', minPoints: 10000, maxPoints: 999999, slots: 10 }
];

const COMPETITOR_NAMES = [
  'HabitMaster', 'StreakKing', 'FocusNinja', 'ConsistencyChamp', 'DailyDestroyer',
  'GoalGetter', 'MotivationalMaven', 'ProgressivePro', 'EliteBuilder', 'VictorySeeker',
  'AchieverX', 'RockSolid', 'NeverMiss', 'Relentless', 'ChampionMind',
  'PeakPerformer', 'UnstoppableU', 'IronWill', 'GrindTime', 'RiseAbove'
];

export function getCurrentLeague(points) {
  for (const league of LEAGUES) {
    if (points >= league.minPoints && points <= league.maxPoints) {
      return league;
    }
  }
  return LEAGUES[LEAGUES.length - 1];
}

export function generateLeagueCompetitors(userPoints, leagueId) {
  const league = LEAGUES.find(l => l.id === leagueId) || LEAGUES[0];
  const competitors = [];
  const usedNames = new Set();
  
  const basePoints = Math.max(league.minPoints, userPoints * 0.8);
  const range = league.maxPoints - basePoints;
  
  const userCompetitor = {
    rank: 0,
    name: 'You',
    weeklyPoints: userPoints,
    habits: Math.floor(Math.random() * 5) + 3,
    streak: Math.floor(Math.random() * 30) + 1,
    isUser: true
  };
  
  for (let i = 0; i < league.slots - 1; i++) {
    let name;
    do {
      const baseName = COMPETITOR_NAMES[Math.floor(Math.random() * COMPETITOR_NAMES.length)];
      const suffix = Math.floor(Math.random() * 99);
      name = `${baseName}_${suffix}`;
    } while (usedNames.has(name));
    
    usedNames.add(name);
    
    const pointsVariation = (Math.random() - 0.5) * range * 0.4;
    const competitorPoints = Math.max(league.minPoints, Math.min(league.maxPoints, Math.floor(basePoints + pointsVariation)));
    
    competitors.push({
      rank: i + 1,
      name,
      weeklyPoints: competitorPoints,
      habits: Math.floor(Math.random() * 5) + 3,
      streak: Math.floor(Math.random() * Math.min(competitorPoints / 100, 50)) + 1,
      isUser: false
    });
  }
  
  competitors.push(userCompetitor);
  competitors.sort((a, b) => b.weeklyPoints - a.weeklyPoints);
  
  return competitors.map((c, i) => ({ ...c, rank: i + 1 }));
}

export function getLeagueRank(competitors, userId = 'user') {
  const user = competitors.find(c => c.isUser);
  return user?.rank || 1;
}

export function getWeeklyLeaguePoints(habits) {
  const today = new Date();
  let totalPoints = 0;
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    habits?.forEach(habit => {
      if (habit.completionLog?.[dateStr]?.completed) {
        const difficultyPoints = { easy: 5, medium: 10, hard: 15 };
        totalPoints += difficultyPoints[habit.difficulty] || 5;
      }
    });
  }
  
  return totalPoints;
}

export function getLeagueEndDate() {
  const now = new Date();
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + (7 - now.getDay()));
  nextSunday.setHours(23, 59, 59, 999);
  
  return nextSunday;
}

export function getTimeRemaining() {
  const end = getLeagueEndDate();
  const now = new Date();
  const diff = end - now;
  
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, expired: true };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes, expired: false };
}

export function getLeagueReward(rank, league) {
  const rewards = {
    1: { points: 500, badge: 'League Champion 🏆', message: 'You are the Champion!' },
    2: { points: 300, badge: 'Runner Up 🥈', message: 'Amazing performance!' },
    3: { points: 200, badge: 'Third Place 🥉', message: 'Great job!' },
    4: { points: 100, badge: null, message: 'Almost made it to top 3!' },
    5: { points: 50, badge: null, message: 'Promotion zone!' },
    6: { points: 25, badge: null, message: 'Keep pushing!' },
    7: { points: 15, badge: null, message: 'Solid performance!' },
    8: { points: 10, badge: null, message: 'Stay consistent!' },
    9: { points: 5, badge: null, message: 'Almost top 10!' },
    10: { points: 5, badge: null, message: 'Top 10!' }
  };
  
  const reward = rewards[rank] || { points: 0, badge: null, message: 'Keep improving!' };
  
  if (rank <= 3) {
    return { ...reward, promoted: false, relegated: false };
  }
  
  const isPromoting = rank <= Math.ceil(league.slots * 0.3);
  const isRelegating = rank > Math.floor(league.slots * 0.7);
  
  return { ...reward, promoted: isPromoting, relegated: isRelegating };
}

export function saveLeagueData(data) {
  localStorage.setItem(LEAGUE_DATA_KEY, JSON.stringify(data));
}

export function loadLeagueData() {
  const stored = localStorage.getItem(LEAGUE_DATA_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function initializeLeague(habits) {
  const existing = loadLeagueData();
  
  if (existing && existing.weekStart === getWeekStart()) {
    return existing;
  }
  
  const weeklyPoints = getWeeklyLeaguePoints(habits);
  const totalPoints = weeklyPoints + (existing?.totalPoints || 0);
  const currentLeague = getCurrentLeague(totalPoints);
  
  const data = {
    weekStart: getWeekStart(),
    weeklyPoints,
    totalPoints,
    currentLeagueId: currentLeague.id,
    competitors: generateLeagueCompetitors(weeklyPoints, currentLeague.id),
    history: (existing?.history || []).slice(-12)
  };
  
  saveLeagueData(data);
  return data;
}

export function getWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day;
  const weekStart = new Date(now.setDate(diff));
  return weekStart.toISOString().split('T')[0];
}

export function addToLeagueHistory(rank, leagueId) {
  const data = loadLeagueData();
  if (!data) return;
  
  data.history.push({
    week: data.weekStart,
    rank,
    leagueId,
    points: data.weeklyPoints,
    date: new Date().toISOString()
  });
  
  if (data.history.length > 52) {
    data.history = data.history.slice(-52);
  }
  
  saveLeagueData(data);
}

export function getLeagueHistory() {
  const data = loadLeagueData();
  return data?.history || [];
}

export function updateWeeklyProgress(habits) {
  const data = loadLeagueData();
  if (!data) return initializeLeague(habits);
  
  const weeklyPoints = getWeeklyLeaguePoints(habits);
  const currentLeague = getCurrentLeague(data.totalPoints);
  const competitors = generateLeagueCompetitors(weeklyPoints, currentLeague.id);
  
  data.weeklyPoints = weeklyPoints;
  data.competitors = competitors;
  
  saveLeagueData(data);
  return data;
}