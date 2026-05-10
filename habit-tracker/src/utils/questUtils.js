import { format, parseISO, isToday, isBefore, startOfDay } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

const QUEST_TEMPLATES = [
  { id: 'complete_3', title: 'Complete 3 habits today', description: 'Finish any 3 habits', points: 50, difficulty: 'easy', icon: '✅', type: 'count', target: 3 },
  { id: 'complete_5', title: 'Complete 5 habits today', description: 'Finish any 5 habits', points: 100, difficulty: 'medium', icon: '⭐', type: 'count', target: 5 },
  { id: 'complete_all', title: 'Perfect Day!', description: 'Complete ALL habits today', points: 200, difficulty: 'hard', icon: '🏆', type: 'all', target: 100 },
  { id: 'morning_habit', title: 'Early Bird', description: 'Complete a habit before 9 AM', points: 75, difficulty: 'medium', icon: '🌅', type: 'time', target: 9 },
  { id: 'streak_habit', title: 'Streak Keeper', description: 'Complete your highest streak habit', points: 60, difficulty: 'easy', icon: '🔥', type: 'streak', target: 1 },
  { id: 'health_habit', title: 'Health First', description: 'Complete a Health category habit', points: 50, difficulty: 'easy', icon: '💪', type: 'category', target: 'Health' },
  { id: 'work_habit', title: 'Work Mode', description: 'Complete a Work category habit', points: 50, difficulty: 'easy', icon: '💼', type: 'category', target: 'Work' },
  { id: 'three_streak', title: 'Consistency King', description: 'Maintain a 3+ day streak', points: 80, difficulty: 'medium', icon: '👑', type: 'streak_count', target: 3 },
  { id: 'focus_session', title: 'Deep Focus', description: 'Complete a focus mode session', points: 90, difficulty: 'medium', icon: '🎯', type: 'focus', target: 1 },
  { id: 'mood_log', title: 'Mood Check', description: 'Log your mood today', points: 30, difficulty: 'easy', icon: '😊', type: 'mood', target: 1 },
  { id: 'two_categories', title: 'All-Rounder', description: 'Complete habits from 2 different categories', points: 120, difficulty: 'hard', icon: '🌟', type: 'categories', target: 2 },
  { id: 'evening_habit', title: 'Night Owl', description: 'Complete a habit after 6 PM', points: 65, difficulty: 'medium', icon: '🌙', type: 'time_after', target: 18 }
];

const QUEST_STREAK_KEY = 'ht_quest_streak';

export const generateDailyQuests = (habits, date) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  const seed = dateStr.split('-').join('').split('').reduce((a, b) => a + parseInt(b), 0);
  
  const easyQuests = QUEST_TEMPLATES.filter(q => q.difficulty === 'easy');
  const mediumQuests = QUEST_TEMPLATES.filter(q => q.difficulty === 'medium');
  const hardQuests = QUEST_TEMPLATES.filter(q => q.difficulty === 'hard');
  
  const getRandom = (arr, seedVal) => {
    const idx = seedVal % arr.length;
    return arr[(idx + seedVal) % arr.length];
  };
  
  const easy = getRandom(easyQuests, seed);
  const medium = getRandom(mediumQuests, seed + 1);
  const hard = getRandom(hardQuests, seed + 2);
  
  return [
    { ...easy, id: uuidv4(), date: dateStr, completed: false, progress: 0 },
    { ...medium, id: uuidv4(), date: dateStr, completed: false, progress: 0 },
    { ...hard, id: uuidv4(), date: dateStr, completed: false, progress: 0 }
  ];
};

export const getDailyQuests = () => {
  try {
    const data = JSON.parse(localStorage.getItem('ht_daily_quests'));
    const today = format(new Date(), 'yyyy-MM-dd');
    
    if (!data || data.date !== today) {
      const newQuests = generateDailyQuests([], new Date());
      const questData = { quests: newQuests, date: today };
      localStorage.setItem('ht_daily_quests', JSON.stringify(questData));
      return { quests: newQuests, date: today, questStreak: getQuestStreak() };
    }
    
    return { ...data, questStreak: getQuestStreak() };
  } catch {
    const newQuests = generateDailyQuests([], new Date());
    return { quests: newQuests, date: format(new Date(), 'yyyy-MM-dd'), questStreak: 0 };
  }
};

export const saveDailyQuests = (quests) => {
  try {
    const data = { quests, date: format(new Date(), 'yyyy-MM-dd') };
    localStorage.setItem('ht_daily_quests', JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
};

export const calculateQuestProgress = (quest, habits, moodLog) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayStr = today;
  
  let progress = 0;
  let total = quest.target;
  let percentage = 0;
  let isComplete = false;
  
  switch (quest.type) {
    case 'count': {
      const completedToday = habits?.filter(h => {
        const entry = h.completionLog?.[todayStr];
        return entry === true || (typeof entry === 'object' && entry?.completed === true);
      }) || [];
      progress = completedToday.length;
      percentage = Math.min(100, Math.round((progress / total) * 100));
      isComplete = progress >= total;
      break;
    }
    
    case 'all': {
      const totalHabits = habits?.length || 0;
      const completedToday = habits?.filter(h => {
        const entry = h.completionLog?.[todayStr];
        return entry === true || (typeof entry === 'object' && entry?.completed === true);
      }) || [];
      progress = completedToday.length;
      total = totalHabits;
      percentage = totalHabits > 0 ? Math.round((progress / totalHabits) * 100) : 0;
      isComplete = totalHabits > 0 && progress === totalHabits;
      break;
    }
    
    case 'time': {
      const targetHour = quest.target;
      const completedEarly = habits?.some(h => {
        const entry = h.completionLog?.[todayStr];
        if (!entry) return false;
        if (entry === true) return true;
        if (typeof entry === 'object' && entry.completed === true) {
          const time = entry.completedAt;
          if (!time) return false;
          const hour = parseInt(time.split(':')[0]);
          return hour < targetHour;
        }
        return false;
      }) || false;
      progress = completedEarly ? 1 : 0;
      percentage = progress * 100;
      isComplete = progress >= 1;
      break;
    }
    
    case 'time_after': {
      const targetHour = quest.target;
      const completedLate = habits?.some(h => {
        const entry = h.completionLog?.[todayStr];
        if (!entry) return false;
        if (entry === true) return true;
        if (typeof entry === 'object' && entry.completed === true) {
          const time = entry.completedAt;
          if (!time) return false;
          const hour = parseInt(time.split(':')[0]);
          return hour >= targetHour;
        }
        return false;
      }) || false;
      progress = completedLate ? 1 : 0;
      percentage = progress * 100;
      isComplete = progress >= 1;
      break;
    }
    
    case 'streak': {
      const bestStreak = habits?.reduce((max, h) => Math.max(max, h.currentStreak || 0), 0) || 0;
      const highestStreakHabit = habits?.find(h => (h.currentStreak || 0) === bestStreak);
      const isCompleted = highestStreakHabit && (
        highestStreakHabit.completionLog?.[todayStr] === true ||
        (typeof highestStreakHabit.completionLog?.[todayStr] === 'object' && highestStreakHabit.completionLog?.[todayStr]?.completed === true)
      );
      progress = isCompleted ? 1 : 0;
      percentage = progress * 100;
      isComplete = progress >= 1;
      break;
    }
    
    case 'streak_count': {
      const hasStreak = habits?.some(h => (h.currentStreak || 0) >= quest.target) || false;
      progress = hasStreak ? 1 : 0;
      percentage = progress * 100;
      isComplete = progress >= 1;
      break;
    }
    
    case 'category': {
      const categoryMatch = habits?.some(h => h.category === quest.target && (
        h.completionLog?.[todayStr] === true ||
        (typeof h.completionLog?.[todayStr] === 'object' && h.completionLog?.[todayStr]?.completed === true)
      )) || false;
      progress = categoryMatch ? 1 : 0;
      percentage = progress * 100;
      isComplete = progress >= 1;
      break;
    }
    
    case 'categories': {
      const categoriesDone = new Set();
      habits?.forEach(h => {
        const entry = h.completionLog?.[todayStr];
        const isCompleted = entry === true || (typeof entry === 'object' && entry?.completed === true);
        if (isCompleted && h.category) {
          categoriesDone.add(h.category);
        }
      });
      progress = categoriesDone.size;
      percentage = Math.min(100, Math.round((progress / quest.target) * 100));
      isComplete = progress >= quest.target;
      break;
    }
    
    case 'focus': {
      try {
        const focusData = JSON.parse(localStorage.getItem('ht_focus_sessions') || '[]');
        const todaySessions = focusData.filter(s => s.date === todayStr);
        progress = todaySessions.length;
        percentage = Math.min(100, Math.round((progress / 1) * 100));
        isComplete = progress >= 1;
      } catch {
        progress = 0;
        percentage = 0;
        isComplete = false;
      }
      break;
    }
    
    case 'mood': {
      const moodLogged = moodLog && (
        moodLog[todayStr] !== undefined ||
        moodLog[today] !== undefined
      );
      progress = moodLogged ? 1 : 0;
      percentage = progress * 100;
      isComplete = progress >= 1;
      break;
    }
    
    default:
      break;
  }
  
  return { progress, total, percentage, isComplete };
};

export const checkAndCompleteQuests = (quests, habits, moodLog, onQuestComplete) => {
  if (!quests || quests.length === 0) return quests;
  
  return quests.map(quest => {
    if (quest.completed) return quest;
    
    const { progress, total, percentage, isComplete } = calculateQuestProgress(quest, habits, moodLog);
    
    if (isComplete && !quest.completed) {
      onQuestComplete(quest);
      return { ...quest, completed: true, progress, percentage, total };
    }
    
    return { ...quest, progress, percentage, total };
  });
};

export const getQuestStreak = () => {
  try {
    return parseInt(localStorage.getItem(QUEST_STREAK_KEY) || '0');
  } catch {
    return 0;
  }
};

export const updateQuestStreak = (allCompleted) => {
  const currentStreak = getQuestStreak();
  let newStreak = allCompleted ? currentStreak + 1 : 0;
  localStorage.setItem(QUEST_STREAK_KEY, newStreak.toString());
  return newStreak;
};

export const getQuestHistory = (days = 7) => {
  const history = [];
  for (let i = 1; i <= days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = format(d, 'yyyy-MM-dd');
    history.push({ date: dateStr, completed: 0, total: 3 });
  }
  return history;
};

export { QUEST_TEMPLATES };