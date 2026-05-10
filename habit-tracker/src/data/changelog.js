export const CHANGELOG = [
  {
    version: '2.0.0',
    date: '2026-05-04',
    type: 'major',
    title: 'Massive Feature Update',
    changes: [
      { type: 'new', text: 'Added Vision Board — visualize your dreams' },
      { type: 'new', text: 'Smart Scheduler — optimal habit timing' },
      { type: 'new', text: 'Experiment Mode — 30-day trials' },
      { type: 'new', text: 'Emergency Mode — focus on top 3' },
      { type: 'new', text: 'AI Journal Analysis — sentiment tracking' },
      { type: 'improved', text: 'Better mobile responsiveness' },
      { type: 'fixed', text: 'Streak calculation accuracy improved' }
    ]
  },
  {
    version: '1.5.0',
    date: '2026-04-28',
    type: 'minor',
    title: 'Tier 2 Features',
    changes: [
      { type: 'new', text: 'Habit Newspaper — daily digest' },
      { type: 'new', text: 'Betting System — stake your points' },
      { type: 'new', text: 'Time Travel — revisit past days' },
      { type: 'new', text: 'Dream Diary — morning/evening prompts' }
    ]
  },
  {
    version: '1.0.0',
    date: '2026-04-20',
    type: 'major',
    title: 'Initial Release',
    changes: [
      { type: 'new', text: 'Habit tracking with streaks' },
      { type: 'new', text: 'Points and badges system' },
      { type: 'new', text: 'Focus Mode with Pomodoro timer' },
      { type: 'new', text: 'Mood tracking' },
      { type: 'new', text: 'Analytics dashboard' }
    ]
  }
];

export const CURRENT_VERSION = CHANGELOG[0].version;

export function getLatestVersion() {
  return CHANGELOG[0]?.version || '1.0.0';
}

export function hasNewVersion() {
  const lastRead = localStorage.getItem('ht_last_read_version');
  const latest = getLatestVersion();
  return lastRead !== latest;
}

export function markVersionAsRead() {
  localStorage.setItem('ht_last_read_version', getLatestVersion());
}

export function getUnreadCount() {
  const lastRead = localStorage.getItem('ht_last_read_version');
  const latest = getLatestVersion();
  if (!lastRead) return CHANGELOG.length;
  
  const lastIndex = CHANGELOG.findIndex(c => c.version === lastRead);
  return lastIndex === -1 ? 0 : lastIndex;
}