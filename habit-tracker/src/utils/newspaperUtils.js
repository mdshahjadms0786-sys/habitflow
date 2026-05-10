const MOTIVATIONAL_QUOTES = [
  "The secret of getting ahead is getting started. — Mark Twain",
  "Success is the sum of small efforts repeated day in and day out. — Robert Collier",
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit. — Aristotle",
  "The only way to do great work is to love what you do. — Steve Jobs",
  "Habit is second nature that swears first nature. — French Proverb",
  "A journey of a thousand miles begins with a single step. — Lao Tzu",
  "Your tomorrow is made of what you do today. — Unknown",
  "Motivation gets you started. Habit keeps you going. — Jim Ryun",
  "Small daily improvements lead to stunning long-term results. — Unknown",
  "Consistency is what transforms average into excellence. — Unknown"
];

const HABIT_TIPS = [
  "The key to consistency is starting small. A 2-minute habit is easier to maintain.",
  "Stack your new habit onto an existing one. After I brush teeth, I will meditate.",
  "Track your habits visually. A streak on paper motivates the mind.",
  "Never miss twice. One slip doesn't define your journey, recovery does.",
  "celebrate small wins. Every day you complete is progress.",
  "Environment design beats willpower. Make good habits obvious.",
  "Habit stacking + implementation intentions = automatic behavior.",
  "Focus on systems, not goals. The process leads to results."
];

export const generateNewspaper = (habits, moodLog, points, streak) => {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  
  const headlines = generateHeadlines(habits, streak, points);
  const articles = [
    generateStreakArticle(habits),
    generateAchievementArticle(points),
    generateMoodArticle(moodLog),
    generateTipArticle()
  ];
  
  const weatherData = moodLog?.[today.toISOString().split('T')[0]]?.weather;
  const weatherNote = weatherData ? `Weather: ${weatherData}` : 'Weather: Clear skies ahead';
  
  const quote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
  
  const completedToday = habits.filter(h => h.completionLog?.[today.toISOString().split('T')[0]]).length;
  
  return {
    date: dateStr,
    edition: "Morning Edition",
    editionNumber: Math.floor((today - new Date('2025-01-01')) / (1000 * 60 * 60 * 24)) + 1,
    headlines,
    articles,
    weatherNote,
    quote,
    stats: {
      habitsToday: completedToday,
      totalHabits: habits.length,
      streak,
      points: points || 0,
      level: Math.floor((points || 0) / 1000) + 1
    }
  };
};

const generateHeadlines = (habits, streak, points) => {
  const headlines = [];
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const completedToday = habits.filter(h => h.completionLog?.[todayStr]).length;
  const completionRate = habits.length > 0 ? (completedToday / habits.length) * 100 : 0;
  
  const bestHabit = habits.reduce((best, h) => (h.currentStreak || 0) > (best?.currentStreak || 0) ? h : best, habits[0]);
  const longestStreak = bestHabit?.currentStreak || 0;
  
  if (longestStreak >= 30) {
    headlines.push(`${bestHabit?.name || 'Local Champion'} Achieves Incredible ${longestStreak}-Day Streak! Experts Amazed`);
  } else if (completionRate === 100 && habits.length > 0) {
    headlines.push("Perfect Day Recorded — All Habits Crushed!");
  } else if (completionRate >= 80) {
    headlines.push(`Local Habit Tracker Shows ${Math.round(completionRate)}% Day Success Rate!`);
  } else if (longestStreak >= 7) {
    headlines.push(`Breaking: ${bestHabit?.name} Reaches ${longestStreak}-Day Milestone`);
  } else if (points > 5000) {
    headlines.push(`Breaking: New Point Milestone Unlocked — ${Math.floor(points / 1000)}K Points Earned`);
  } else {
    headlines.push(`Today's Challenge: ${habits.length - completedToday} Habits Await Your Dedication`);
  }
  
  return headlines;
};

const generateStreakArticle = (habits) => {
  if (!habits || habits.length === 0) {
    return {
      title: "Local Experts Recommend Starting Small",
      content: "Habit tracking professionals advise beginners to start with just one habit. 'The journey of a thousand miles begins with a single step,' noted one expert."
    };
  }
  
  const bestHabit = habits.reduce((best, h) => (h.currentStreak || 0) > (best?.currentStreak || 0) ? h : best, habits[0]);
  const streak = bestHabit?.currentStreak || 0;
  
  if (streak >= 7) {
    return {
      title: `${bestHabit.name} Streak Goes International!`,
      content: `Sources close to the matter confirm that ${bestHabit.name} has maintained an unprecedented ${streak}-day streak. "It's purely remarkable," said habit analyst Dr. Streak. "This level of dedication is what separates the accomplished from the average."`
    };
  }
  
  return {
    title: "Local Resident Shows Promising Progress",
    content: `Our sources report that ${bestHabit?.name || 'habit tracking'} is showing strong consistency with a current streak of ${streak} days. Analysts note this marks the beginning of a transformative journey.`
  };
};

const generateAchievementArticle = (points) => {
  const level = Math.floor((points || 0) / 1000);
  
  if (points >= 5000) {
    return {
      title: "Financial Markets React to Habit Earnings",
      content: `Financial correspondent reports total earnings of ${points} points detected in local records. Market analysts predict continued growth. "This is unprecedented in the habit economy," noted one financial expert.`
    };
  }
  
  return {
    title: "Local Point Totals Continue Rising",
    content: `Correspondents report ${points || 0} points accumulated in this habit journey. Financial advisors note that consistency Compound interest builds substantial rewards over time.`
  };
};

const generateMoodArticle = (moodLog) => {
  const moodEntries = Object.values(moodLog || {});
  const positiveDays = moodEntries.filter(m => m && m.id >= 4).length;
  const total = moodEntries.length;
  
  if (total === 0) {
    return {
      title: "Mood Experts Recommend Daily Check-ins",
      content: "Mood tracking professionals advise logging your emotional state daily. 'Awareness is the first step to management,' notes one emotional intelligence expert."
    };
  }
  
  const positiveRate = (positiveDays / total) * 100;
  
  if (positiveRate >= 70) {
    return {
      title: "Mood Correspondent Notes Promising Trends",
      content: `Mood analysts report ${Math.round(positiveRate)}% positive sentiment in recent entries. "The emotional landscape appears increasingly bright," noted one mood expert.`
    };
  }
  
  return {
    title: "Mixed Emotions Detected in Analysis",
    content: `Mood correspondents note varied emotional responses over the tracking period. "Balance is key," advises one emotional wellness expert.`
  };
};

const generateTipArticle = () => {
  const tip = HABIT_TIPS[Math.floor(Math.random() * HABIT_TIPS.length)];
  
  return {
    title: "Expert Advice Column",
    content: `Expert Dr. Habit advises: '${tip}'`
  };
};

export const generateNewspaperText = (newspaper) => {
  return `
╔══════════════════════════════════════════╗
║        THE DAILY HABIT TIMES            ║
║     ${newspaper.date}        ║
║         ${newspaper.edition}                     ║
╚══════════════════════════════════════════╝

${newspaper.headlines[0]}

${newspaper.articles.map(a => `► ${a.title}\n${a.content}\n`).join('\n')}

WEATHER: ${newspaper.weatherNote}

QUOTE: "${newspaper.quote}"

STATS: ${newspaper.stats.habitsToday}/${newspaper.stats.totalHabits} habits today | ${newspaper.stats.streak} day streak | ${newspaper.stats.points} total points
  `.trim();
};

export default { generateNewspaper, generateNewspaperText };