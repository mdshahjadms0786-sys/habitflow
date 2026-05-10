import { v4 as uuidv4 } from 'uuid';
import { getTotalPoints, deductPoints } from './pointsUtils';

const STORAGE_KEY = 'ht_bets';

export const calculateMultiplier = (targetRate, duration) => {
  if (duration >= 30 && targetRate >= 90) return 3;
  if (duration >= 7 && targetRate >= 90) return 2;
  if (duration >= 30 && targetRate >= 70) return 2;
  if (duration >= 7 && targetRate >= 70) return 1.5;
  return 1.2;
};

export const createBet = (habit, betAmount, duration, targetCompletionRate) => {
  const multiplier = calculateMultiplier(targetCompletionRate, duration);
  const startDate = new Date().toISOString().split('T')[0];
  const endDate = new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  return {
    id: uuidv4(),
    habitId: habit.id,
    habitName: habit.name,
    habitIcon: habit.icon,
    betAmount,
    duration,
    startDate,
    endDate,
    targetCompletionRate,
    status: 'active',
    currentProgress: 0,
    reward: Math.round(betAmount * multiplier),
    multiplier
  };
};

export const saveBet = (bet) => {
  try {
    const bets = loadBets();
    const updated = [...bets, bet];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save bet', e);
  }
};

export const loadBets = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to load bets', e);
    return [];
  }
};

export const updateBet = (updatedBet) => {
  try {
    const bets = loadBets();
    const updated = bets.map(b => b.id === updatedBet.id ? updatedBet : b);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update bet', e);
  }
};

export const getActiveBets = () => {
  return loadBets().filter(b => b.status === 'active');
};

export const getPastBets = () => {
  return loadBets().filter(b => b.status !== 'active');
};

export const checkBetStatus = (bet, completionLog) => {
  if (!bet || !completionLog) return bet;
  
  const today = new Date().toISOString().split('T')[0];
  if (today < bet.endDate) {
    const startDate = new Date(bet.startDate);
    const now = new Date();
    const daysPassed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const completedDays = Object.keys(completionLog).filter(date => {
      return date >= bet.startDate && date <= today && completionLog[date];
    }).length;
    
    const progress = Math.round((completedDays / daysPassed) * 100);
    
    return { ...bet, currentProgress: progress };
  }
  
  const daysInRange = [];
  let current = new Date(bet.startDate);
  const end = new Date(bet.endDate);
  while (current <= end) {
    daysInRange.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  
  const completedDays = daysInRange.filter(date => completionLog[date]).length;
  const finalProgress = Math.round((completedDays / bet.duration) * 100);
  
  if (finalProgress >= bet.targetCompletionRate) {
    return { ...bet, status: 'won', currentProgress: finalProgress };
  } else {
    return { ...bet, status: 'lost', currentProgress: finalProgress };
  }
};

export const calculateBetProgress = (bet, completionLog) => {
  if (!bet) return { daysCompleted: 0, currentRate: 0, projected: 'failing' };
  
  const today = new Date().toISOString().split('T')[0];
  const startDate = new Date(bet.startDate);
  const endDate = new Date(bet.endDate);
  const now = new Date();
  
  const daysCompleted = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1;
  const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  
  const completedDays = Object.keys(completionLog || {}).filter(date => {
    return date >= bet.startDate && date <= today && completionLog[date];
  }).length;
  
  const currentRate = Math.round((completedDays / daysCompleted) * 100);
  const requiredRate = bet.targetCompletionRate;
  
  let projected = 'on track';
  if (currentRate < requiredRate - 20) projected = 'failing';
  else if (currentRate < requiredRate) projected = 'at risk';
  
  return { daysCompleted, totalDays, currentRate, projected };
};

export const canPlaceBet = (betAmount) => {
  const points = getTotalPoints();
  return points >= betAmount && betAmount >= 50;
};

export const getBetStats = (bets) => {
  const active = bets.filter(b => b.status === 'active').length;
  const won = bets.filter(b => b.status === 'won').length;
  const lost = bets.filter(b => b.status === 'lost').length;
  const totalWon = bets.filter(b => b.status === 'won').reduce((sum, b) => sum + b.reward, 0);
  const totalLost = bets.filter(b => b.status === 'lost').reduce((sum, b) => sum + b.betAmount, 0);
  
  return { active, won, lost, totalWon, totalLost, net: totalWon - totalLost };
};

export default { createBet, loadBets, saveBet, getActiveBets, getPastBets, checkBetStatus, calculateBetProgress, calculateMultiplier, getBetStats };