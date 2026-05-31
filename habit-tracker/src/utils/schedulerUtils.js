const STORAGE_KEY = 'ht_schedule';

const DAY_NAMES = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export { DAY_NAMES, DAY_LABELS };

export const getDayName = (date) => {
  const day = date.getDay();
  return DAY_NAMES[(day + 6) % 7];
};

export const getDayLabel = (index) => {
  return DAY_LABELS[index] || DAY_LABELS[0];
};

export const analyzeOptimalTimes = (habits, completionLog = {}) => {
  if (!habits || habits.length === 0) return [];

  const habitTimes = {};

  Object.entries(completionLog).forEach(([habitId, dates]) => {
    if (!dates) return;
    Object.keys(dates).forEach(dateStr => {
      const completedAt = dates[dateStr];
      if (completedAt && typeof completedAt === 'string') {
        const hour = parseInt(completedAt.split(':')[0], 10);
        if (!isNaN(hour)) {
          if (!habitTimes[habitId]) {
            habitTimes[habitId] = {};
          }
          habitTimes[habitId][hour] = (habitTimes[habitId][hour] || 0) + 1;
        }
      }
    });
  });

  return habits.map(habit => {
    const times = habitTimes[habit.id] || {};
    const total = Object.values(times).reduce((a, b) => a + b, 0);
    
    if (total === 0) {
      const defaultHour = habit.reminderTime ? parseInt(habit.reminderTime.split(':')[0], 10) : 8;
      return {
        habitId: habit.id,
        habitName: habit.name,
        icon: habit.icon,
        optimalHour: defaultHour || 8,
        confidence: 0
      };
    }

    const optimalHour = Object.entries(times).sort((a, b) => b[1] - a[1])[0][0];
    const confidence = Math.round((times[optimalHour] / total) * 100);

    return {
      habitId: habit.id,
      habitName: habit.name,
      icon: habit.icon,
      optimalHour: parseInt(optimalHour, 10),
      confidence
    };
  });
};

export const generateWeekSchedule = (habits, optimalTimesData) => {
  if (!habits || habits.length === 0) return {};

  const schedule = {};
  
  DAY_NAMES.forEach(day => {
    schedule[day] = [];
  });

  const optimalMap = {};
  optimalTimesData.forEach(opt => {
    optimalMap[opt.habitId] = opt;
  });

  habits.forEach((habit, index) => {
    const dayIndex = Math.floor(index / 3);
    const actualDay = dayIndex < 7 ? DAY_NAMES[dayIndex % 7] : DAY_NAMES[index % 7];
    const opt = optimalMap[habit.id];
    const time = opt?.optimalHour || 8 + Math.floor(index / 2);
    
    schedule[actualDay].push({
      time: `${time.toString().padStart(2, '0')}:00`,
      habitId: habit.id,
      habitName: habit.name,
      icon: habit.icon,
      duration: 30
    });
  });

  Object.keys(schedule).forEach(day => {
    schedule[day].sort((a, b) => a.time.localeCompare(b.time));
  });

  return schedule;
};

export const getScheduleForToday = (schedule) => {
  const today = getDayName(new Date());
  return (schedule[today] || []).sort((a, b) => a.time.localeCompare(b.time));
};

export const getTodayScheduleProgress = (schedule, completionLog) => {
  const today = new Date().toISOString().split('T')[0];
  const todaySchedule = getScheduleForToday(schedule);
  
  const done = [];
  const pending = [];
  const upcoming = [];

  const currentHour = new Date().getHours();

  todaySchedule.forEach(item => {
    const itemHour = parseInt(item.time.split(':')[0], 10);
    const isDone = completionLog[item.habitId]?.[today];
    
    if (isDone) {
      done.push(item);
    } else if (itemHour <= currentHour) {
      pending.push(item);
    } else {
      upcoming.push(item);
    }
  });

  return { done, pending, upcoming };
};

export const saveSchedule = (schedule) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
  } catch (e) {
    console.error('Failed to save schedule', e);
  }
};

export const loadSchedule = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    console.error('Failed to load schedule', e);
    return {};
  }
};

export const applySmartSchedule = (habits) => {
  const completionLog = {};
  habits.forEach(h => {
    completionLog[h.id] = h.completionLog || {};
  });

  const optimalData = analyzeOptimalTimes(habits, completionLog);
  const schedule = generateWeekSchedule(habits, optimalData);
  
  saveSchedule(schedule);
  
  return { schedule, optimalData };
};

export default { 
  analyzeOptimalTimes, 
  generateWeekSchedule, 
  getScheduleForToday,
  getTodayScheduleProgress,
  saveSchedule,
  loadSchedule,
  applySmartSchedule,
  getDayName,
  DAY_NAMES,
  DAY_LABELS
};