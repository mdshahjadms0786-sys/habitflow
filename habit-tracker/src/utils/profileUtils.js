const STORAGE_KEY = 'ht_profile';

export const defaultProfile = {
  name: '',
  username: '',
  bio: '',
  avatarEmoji: '👤',
  joinDate: new Date().toISOString(),
  isPublic: false,
  goals: [],
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
};

export function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function loadProfile() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return { ...defaultProfile, ...JSON.parse(stored) };
  }
  return { ...defaultProfile };
}

export function generateUsername(name) {
  if (!name) return '';
  let username = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  
  const existingProfiles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  if (existingProfiles.username && existingProfiles.username.startsWith(username)) {
    return existingProfiles.username;
  }
  
  const randomNum = Math.floor(Math.random() * 900) + 100;
  return `${username}_${randomNum}`;
}

export function updateProfile(updates) {
  const current = loadProfile();
  const updated = { ...current, ...updates };
  saveProfile(updated);
  return updated;
}