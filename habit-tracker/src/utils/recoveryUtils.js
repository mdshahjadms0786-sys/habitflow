const TOKEN_STORAGE_KEY = 'ht_recovery_tokens';

export const DEFAULT_TOKENS = {
  grace: 3,
  freeze: 2,
  recovery: 1
};

export function saveTokens(tokens) {
  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
}

export function loadTokens() {
  const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return { ...DEFAULT_TOKENS };
}

export function getTokens() {
  return loadTokens();
}

export function useGraceToken(habitId) {
  const tokens = loadTokens();
  if (tokens.grace <= 0) return false;
  
  tokens.grace--;
  saveTokens(tokens);
  
  const graceHabits = JSON.parse(localStorage.getItem('ht_grace_period') || '{}');
  graceHabits[habitId] = { usedAt: new Date().toISOString() };
  localStorage.setItem('ht_grace_period', JSON.stringify(graceHabits));
  
  return true;
}

export function useFreezeToken() {
  const tokens = loadTokens();
  if (tokens.freeze <= 0) return false;
  
  tokens.freeze--;
  saveTokens(tokens);
  
  const freezeData = {
    usedAt: new Date().toISOString(),
    protectedHabits: JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]').map(h => h.id)
  };
  localStorage.setItem('ht_streak_freeze', JSON.stringify(freezeData));
  
  return true;
}

export function useRecoveryToken(habitId, missedDate) {
  const tokens = loadTokens();
  if (tokens.recovery <= 0) return false;
  
  const missedDateTime = new Date(missedDate).getTime();
  const now = Date.now();
  const hoursDiff = (now - missedDateTime) / (1000 * 60 * 60);
  
  if (hoursDiff > 48) return false;
  
  tokens.recovery--;
  saveTokens(tokens);
  
  return true;
}

export function earnFreezeToken() {
  const tokens = loadTokens();
  tokens.freeze++;
  saveTokens(tokens);
}

export function isStreakProtected(habitId) {
  const freezeData = JSON.parse(localStorage.getItem('ht_streak_freeze') || '{}');
  if (!freezeData.usedAt) return false;
  
  const freezeDate = new Date(freezeData.usedAt).toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];
  
  return freezeDate === today && freezeData.protectedHabits?.includes(habitId);
}

export function canUseGracePeriod(habitId) {
  const tokens = loadTokens();
  const graceHabits = JSON.parse(localStorage.getItem('ht_grace_period') || '{}');
  
  if (graceHabits[habitId]) return false;
  return tokens.grace > 0;
}

export function canRecoverStreak(habitId, missedDate) {
  const tokens = loadTokens();
  if (tokens.recovery <= 0) return false;
  
  const missedDateTime = new Date(missedDate).getTime();
  const now = Date.now();
  const hoursDiff = (now - missedDateTime) / (1000 * 60 * 60);
  
  return hoursDiff <= 48;
}