export const getHabitDeadline = (habit) => {
  const deadline = new Date();
  
  if (habit?.deadlineTime) {
    const [hours, minutes] = habit.deadlineTime.split(':').map(Number);
    deadline.setHours(hours, minutes, 59, 999);
  } else {
    deadline.setHours(23, 59, 59, 999);
  }
  
  return deadline;
};

export const getTimeRemaining = (deadline) => {
  if (!deadline) {
    return {
      expired: false,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMinutes: 0,
      percentage: 100,
      urgency: 'normal',
    };
  }
  
  const now = new Date();
  const msRemaining = deadline.getTime() - now.getTime();
  
  if (msRemaining <= 0) {
    return {
      expired: true,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMinutes: 0,
      percentage: 0,
      urgency: 'critical',
    };
  }
  
  const totalSeconds = Math.floor(msRemaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.round(totalSeconds / 60);
  
  const dayMs = 24 * 60 * 60 * 1000;
  const percentage = Math.round((msRemaining / dayMs) * 100);
  
  let urgency = 'normal';
  if (totalMinutes < 30) {
    urgency = 'critical';
  } else if (totalMinutes < 120) {
    urgency = 'warning';
  }
  
  return {
    expired: false,
    hours,
    minutes,
    seconds,
    totalMinutes,
    percentage,
    urgency,
  };
};

export const formatCountdown = (timeRemaining) => {
  if (!timeRemaining) {
    return 'Loading...';
  }
  
  if (timeRemaining.expired) {
    return '⏰ Expired';
  }
  
  const { hours, minutes, seconds } = timeRemaining;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  
  return `${seconds}s`;
};

export const getDayProgress = () => {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);
  
  const totalMs = endOfDay.getTime() - startOfDay.getTime();
  const elapsedMs = now.getTime() - startOfDay.getTime();
  
  if (elapsedMs <= 0) return 0;
  if (elapsedMs >= totalMs) return 100;
  
  return Math.round((elapsedMs / totalMs) * 100);
};

export const getTimeRemainingForMidnight = () => {
  const midnight = new Date();
  midnight.setHours(23, 59, 59, 999);
  return getTimeRemaining(midnight);
};

export default {
  getHabitDeadline,
  getTimeRemaining,
  formatCountdown,
  getDayProgress,
  getTimeRemainingForMidnight,
};