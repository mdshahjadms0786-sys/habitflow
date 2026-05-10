const POSITIVE_WORDS = [
  'good', 'great', 'amazing', 'wonderful', 'happy', 'excellent',
  'fantastic', 'love', 'enjoy', 'success', 'achieved', 'proud',
  'motivated', 'energy', 'strong', 'better', 'improved', 'progress',
  'accomplished', 'grateful', 'thankful', 'blessed', 'excited',
  'confident', 'focused', 'productive', 'healthy', 'peaceful',
  'acha', 'achha', 'khush', 'badiya', 'mast', 'zabardast'
];

const NEGATIVE_WORDS = [
  'bad', 'terrible', 'awful', 'sad', 'unhappy', 'failed', 'tired',
  'exhausted', 'stressed', 'anxious', 'worried', 'difficult', 'hard',
  'struggle', 'missed', 'forgot', 'lazy', 'unmotivated', 'sick',
  'pain', 'hurt', 'angry', 'frustrated', 'disappointed', 'bored',
  'bura', 'thaka', 'pareshan', 'mushkil', 'bimaar', 'dard'
];

const ENERGY_WORDS = ['energy', 'active', 'workout', 'exercise', 'run', 'gym'];
const CALM_WORDS = ['peaceful', 'calm', 'relax', 'meditate', 'breathe', 'quiet'];
const FOCUS_WORDS = ['focus', 'work', 'study', 'concentrate', 'productive', 'deep'];

export const analyzeSentiment = (text) => {
  if (!text || typeof text !== 'string') {
    return {
      score: 0,
      label: 'Neutral',
      emoji: '😐',
      positiveWords: [],
      negativeWords: [],
      dominantTheme: 'general',
      wordCount: 0
    };
  }

  const words = text.toLowerCase().split(/\s+/);
  const wordCount = words.length;

  const positiveMatches = [];
  const negativeMatches = [];
  let energyCount = 0;
  let calmCount = 0;
  let focusCount = 0;

  words.forEach(word => {
    const cleanWord = word.replace(/[^a-z]/g, '');
    if (POSITIVE_WORDS.includes(cleanWord)) positiveMatches.push(cleanWord);
    if (NEGATIVE_WORDS.includes(cleanWord)) negativeMatches.push(cleanWord);
    if (ENERGY_WORDS.includes(cleanWord)) energyCount++;
    if (CALM_WORDS.includes(cleanWord)) calmCount++;
    if (FOCUS_WORDS.includes(cleanWord)) focusCount++;
  });

  const positiveScore = wordCount > 0 ? (positiveMatches.length / wordCount) * 100 : 0;
  const negativeScore = wordCount > 0 ? (negativeMatches.length / wordCount) * 100 : 0;
  const score = Math.round(positiveScore - negativeScore);

  let label = 'Neutral';
  let emoji = '😐';
  if (score > 20) { label = 'Very Positive'; emoji = '😄'; }
  else if (score > 5) { label = 'Positive'; emoji = '🙂'; }
  else if (score < -20) { label = 'Very Negative'; emoji = '😢'; }
  else if (score < -5) { label = 'Negative'; emoji = '😔'; }

  let dominantTheme = 'general';
  if (energyCount > calmCount && energyCount > focusCount) dominantTheme = 'energy';
  else if (calmCount > energyCount && calmCount > focusCount) dominantTheme = 'calm';
  else if (focusCount > energyCount && focusCount > calmCount) dominantTheme = 'focus';

  return {
    score,
    label,
    emoji,
    positiveWords: [...new Set(positiveMatches)],
    negativeWords: [...new Set(negativeMatches)],
    dominantTheme,
    wordCount
  };
};

export const analyzeJournalHistory = (journalEntries) => {
  if (!journalEntries || journalEntries.length === 0) {
    return {
      overallTrend: 'stable',
      averageScore: 0,
      bestDay: null,
      worstDay: null,
      weeklyScores: [],
      topPositiveWords: [],
      topNegativeWords: [],
      dominantTheme: 'general',
      insight: 'Start journaling to see your sentiment trends!'
    };
  }

  const analyzedEntries = journalEntries.map(entry => ({
    ...entry,
    sentiment: analyzeSentiment(entry.note)
  })).filter(e => e.sentiment);

  if (analyzedEntries.length === 0) {
    return {
      overallTrend: 'stable',
      averageScore: 0,
      bestDay: null,
      worstDay: null,
      weeklyScores: [],
      topPositiveWords: [],
      topNegativeWords: [],
      dominantTheme: 'general',
      insight: 'Start journaling to see your sentiment trends!'
    };
  }

  const scores = analyzedEntries.map(e => e.sentiment.score);
  const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  const bestDay = analyzedEntries.reduce((best, entry) => {
    if (!best || entry.sentiment.score > best.sentiment.score) return entry;
    return best;
  }, null);

  const worstDay = analyzedEntries.reduce((worst, entry) => {
    if (!worst || entry.sentiment.score < worst.sentiment.score) return entry;
    return worst;
  }, null);

  const weeklyScoresMap = {};
  analyzedEntries.forEach(entry => {
    const date = new Date(entry.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!weeklyScoresMap[weekKey]) {
      weeklyScoresMap[weekKey] = { week: weekKey, scores: [] };
    }
    weeklyScoresMap[weekKey].scores.push(entry.sentiment.score);
  });

  const weeklyScores = Object.entries(weeklyScoresMap).map(([week, data]) => ({
    week,
    avgScore: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length)
  })).sort((a, b) => a.week.localeCompare(b.week));

  let overallTrend = 'stable';
  if (weeklyScores.length >= 2) {
    const recent = weeklyScores.slice(-2);
    const diff = recent[1].avgScore - recent[0].avgScore;
    if (diff > 10) overallTrend = 'improving';
    else if (diff < -10) overallTrend = 'declining';
  }

  const allPositiveWords = analyzedEntries.flatMap(e => e.sentiment.positiveWords);
  const positiveWordCounts = {};
  allPositiveWords.forEach(word => {
    positiveWordCounts[word] = (positiveWordCounts[word] || 0) + 1;
  });
  const topPositiveWords = Object.entries(positiveWordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));

  const allNegativeWords = analyzedEntries.flatMap(e => e.sentiment.negativeWords);
  const negativeWordCounts = {};
  allNegativeWords.forEach(word => {
    negativeWordCounts[word] = (negativeWordCounts[word] || 0) + 1;
  });
  const topNegativeWords = Object.entries(negativeWordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));

  const themeCounts = { energy: 0, calm: 0, focus: 0, general: 0 };
  analyzedEntries.forEach(entry => {
    const theme = entry.sentiment.dominantTheme || 'general';
    themeCounts[theme] = (themeCounts[theme] || 0) + 1;
  });
  const dominantTheme = Object.entries(themeCounts).sort((a, b) => b[1] - a[1])[0][0];

  const insight = generateJournalInsight({
    overallTrend,
    averageScore,
    dominantTheme,
    bestDay,
    worstDay
  });

  return {
    overallTrend,
    averageScore,
    bestDay,
    worstDay,
    weeklyScores,
    topPositiveWords,
    topNegativeWords,
    dominantTheme,
    insight
  };
};

export const generateJournalInsight = (analysis) => {
  const { overallTrend, averageScore, dominantTheme, bestDay, worstDay } = analysis;

  if (overallTrend === 'improving' && averageScore > 10) {
    return "Your journal shows growing positivity! 🌟 Keep it up!";
  }

  if (overallTrend === 'declining') {
    return "Seems like a tough period. Consider talking to someone 💙";
  }

  if (dominantTheme === 'calm') {
    return "You're finding peace and balance 🧘";
  }

  if (dominantTheme === 'focus') {
    return "You're in a productive mindset! 💪";
  }

  if (dominantTheme === 'energy') {
    return "You've got great energy! Keep moving forward ⚡";
  }

  if (averageScore > 15) {
    return "Your entries are mostly positive! That's awesome 😊";
  }

  if (averageScore < -15) {
    return "Things seem tough right now. Remember, every day is a new start 💙";
  }

  if (overallTrend === 'improving') {
    return "You're trending upward! Great progress 🌱";
  }

  return "Keep writing - your patterns will emerge over time 📝";
};

export default { analyzeSentiment, analyzeJournalHistory, generateJournalInsight };