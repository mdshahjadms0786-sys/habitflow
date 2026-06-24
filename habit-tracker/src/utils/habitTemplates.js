export const HABIT_TEMPLATES = [
  {
    id: 'morning-routine',
    name: 'Morning Routine',
    icon: '🌅',
    habits: [
      { name: 'Wake up early', category: 'Health', priority: 'high', icon: '⏰' },
      { name: 'Meditate', category: 'Health', priority: 'medium', icon: '🧘' },
      { name: 'Exercise', category: 'Fitness', priority: 'high', icon: '🏋️' },
      { name: 'Healthy breakfast', category: 'Health', priority: 'medium', icon: '🥗' },
      { name: 'Plan your day', category: 'Work', priority: 'medium', icon: '📋' },
    ],
  },
  {
    id: 'fitness',
    name: 'Fitness & Health',
    icon: '💪',
    habits: [
      { name: 'Drink 8 glasses of water', category: 'Health', priority: 'high', icon: '💧' },
      { name: 'Workout', category: 'Fitness', priority: 'high', icon: '🏋️' },
      { name: 'Walk 10,000 steps', category: 'Fitness', priority: 'medium', icon: '🚶' },
      { name: 'Stretch', category: 'Fitness', priority: 'low', icon: '🧘' },
      { name: 'Take vitamins', category: 'Health', priority: 'medium', icon: '💊' },
    ],
  },
  {
    id: 'productive-professional',
    name: 'Productive Professional',
    icon: '💼',
    habits: [
      { name: 'Review goals', category: 'Work', priority: 'high', icon: '🎯' },
      { name: 'Deep work session', category: 'Work', priority: 'high', icon: '🧠' },
      { name: 'Learn something new', category: 'Learning', priority: 'medium', icon: '📚' },
      { name: 'Network', category: 'Work', priority: 'low', icon: '🤝' },
      { name: 'Review finances', category: 'Personal', priority: 'medium', icon: '💰' },
    ],
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness & Growth',
    icon: '🧠',
    habits: [
      { name: 'Journal', category: 'Personal', priority: 'medium', icon: '📓' },
      { name: 'Read for 30 mins', category: 'Learning', priority: 'high', icon: '📖' },
      { name: 'Practice gratitude', category: 'Personal', priority: 'low', icon: '🙏' },
      { name: 'Digital detox', category: 'Health', priority: 'medium', icon: '📵' },
      { name: 'Evening reflection', category: 'Personal', priority: 'low', icon: '🌙' },
    ],
  },
  {
    id: 'student',
    name: 'Student Success',
    icon: '🎓',
    habits: [
      { name: 'Study session', category: 'Learning', priority: 'high', icon: '📚' },
      { name: 'Review notes', category: 'Learning', priority: 'high', icon: '📝' },
      { name: 'Complete assignment', category: 'Learning', priority: 'high', icon: '📄' },
      { name: 'Take breaks', category: 'Health', priority: 'medium', icon: '☕' },
      { name: 'Organize workspace', category: 'Personal', priority: 'low', icon: '🧹' },
    ],
  },
];
