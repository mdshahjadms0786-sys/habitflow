const SLEEP_KEY = 'ht_sleep_log';

export const saveSleepEntry = (entry) => {
  const logs = getSleepLogs();
  const existing = logs.findIndex(l => l.date === entry.date);
  if (existing >= 0) logs[existing] = entry;
  else logs.push(entry);
  localStorage.setItem(SLEEP_KEY, JSON.stringify(logs));
};

export const getSleepLogs = () => {
  try { return JSON.parse(localStorage.getItem(SLEEP_KEY) || '[]'); } catch { return []; }
};

export const getSleepCorrelation = (habits) => {
  const logs = getSleepLogs();
  if (logs.length < 3) return null;
  const avg = logs.reduce((s, l) => s + (l.hours || 0), 0) / logs.length;
  const goodSleepDays = logs.filter(l => l.hours >= 7).length;
  const allDays = logs.length;
  const rate = Math.round((goodSleepDays / allDays) * 100);
  return { averageSleep: Math.round(avg), bestHours: 8, correlation: rate > 60 ? 'strong' : rate > 40 ? 'moderate' : 'weak', insight: rate > 60 ? 'You complete more habits after 7+ hours sleep!' : 'More sleep = better habit completion' };
};