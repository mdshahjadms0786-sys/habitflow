import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'ht_dream_diary';

export const saveDiaryEntry = (entry) => {
  try {
    const entries = loadDiaryEntries();
    const updated = entries.filter(e => !(e.date === entry.date && e.type === entry.type));
    updated.push({ ...entry, id: entry.id || uuidv4() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 60)));
  } catch (e) {
    console.error('Failed to save diary entry', e);
  }
};

export const loadDiaryEntries = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to load diary entries', e);
    return [];
  }
};

export const getTodayEntries = () => {
  const today = new Date().toISOString().split('T')[0];
  const entries = loadDiaryEntries();
  return {
    morning: entries.find(e => e.date === today && e.type === 'morning'),
    evening: entries.find(e => e.date === today && e.type === 'evening')
  };
};

export const getPatterns = (entries) => {
  if (entries.length < 7) return null;
  
  const highEnergy = entries.filter(e => e.energyLevel >= 4);
  const lowEnergy = entries.filter(e => e.energyLevel <= 2);
  
  return {
    highEnergyDays: highEnergy.length,
    lowEnergyDays: lowEnergy.length,
    averageEnergy: Math.round(entries.reduce((sum, e) => sum + (e.energyLevel || 3), 0) / entries.length * 10) / 10
  };
};

export default { saveDiaryEntry, loadDiaryEntries, getTodayEntries, getPatterns };