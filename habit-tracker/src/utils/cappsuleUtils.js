import { v4 as uuidv4 } from 'uuid';

const CAPSULE_KEY = 'ht_time_capsules';

export const saveCapsule = (capsule) => {
  const capsules = getCapsules();
  capsules.push({ ...capsule, id: uuidv4() });
  localStorage.setItem(CAPSULE_KEY, JSON.stringify(capsules));
};

export const getCapsules = () => {
  try { return JSON.parse(localStorage.getItem(CAPSULE_KEY) || '[]'); } catch { return []; }
};

export const getReadyCapsules = () => {
  const capsules = getCapsules();
  const now = new Date().toISOString().split('T')[0];
  return capsules.filter(c => c.openDate <= now && !c.isOpened);
};

export const markAsOpened = (id) => {
  const capsules = getCapsules().map(c => c.id === id ? { ...c, isOpened: true } : c);
  localStorage.setItem(CAPSULE_KEY, JSON.stringify(capsules));
};

export const deleteCapsule = (id) => {
  const capsules = getCapsules().filter(c => c.id !== id);
  localStorage.setItem(CAPSULE_KEY, JSON.stringify(capsules));
};