const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash-lite';
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}`;

export const checkOllamaStatus = async () => {
  try {
    const response = await fetch(`${BASE_URL}?key=${GEMINI_API_KEY}`, {
      signal: AbortSignal.timeout(5000),
    });
    return { isRunning: response.ok, models: ['gemini-1.5-flash'] };
  } catch {
    return { isRunning: false, models: [] };
  }
};

export const streamCompletion = async ({ prompt, onChunk, onDone, onError }) => {
  const now = Date.now();
  if (now - lastRateLimit < 15000) {
    onError(new Error('Rate limited'));
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    });

    if (response.status === 429) {
      lastRateLimit = Date.now();
      onError(new Error('Rate limited'));
      return;
    }

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const jsonStr = line.slice(6).trim();
        if (!jsonStr || jsonStr === '[DONE]') continue;
        try {
          const json = JSON.parse(jsonStr);
          const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) onChunk(text);
        } catch {
          // Skip malformed chunks
        }
      }
    }

    onDone();
  } catch (error) {
    onError(error);
  }
};

let lastRateLimit = 0;

export const getCompletion = async (prompt) => {
  const now = Date.now();
  if (now - lastRateLimit < 15000) {
    return null;
  }

  try {
    const response = await fetch(`${BASE_URL}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    });

    if (response.status === 429) {
      lastRateLimit = Date.now();
      return null;
    }

    if (!response.ok) return null;

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch {
    return null;
  }
};

export const getHabitSuggestions = async (userGoal) => {
  const prompt = `Suggest 5 specific daily habits for someone who wants to: ${userGoal}. Return ONLY a JSON array with objects having keys: name, category, priority, notes. Categories must be one of: Health, Work, Personal, Fitness, Learning. Priorities must be one of: High, Medium, Low. Example format: [{"name": "Morning meditation", "category": "Health", "priority": "Medium", "notes": "Start with 5 minutes"}]`;

  try {
    const response = await fetch(`${BASE_URL}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const suggestions = JSON.parse(jsonMatch[0]);
      return suggestions.map((s) => ({
        ...s,
        category: validateCategory(s.category),
        priority: validatePriority(s.priority),
      }));
    }

    return null;
  } catch {
    return null;
  }
};

export const getDailyMotivation = async (stats) => {
  const prompt = `Give one short motivational sentence (max 15 words) for someone who has completed ${stats.completedToday}/${stats.totalHabits} habits today and has a ${stats.bestStreak} day streak.`;

  try {
    const response = await fetch(`${BASE_URL}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 50 },
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
  } catch {
    return null;
  }
};

export const checkOllamaConnection = async () => {
  try {
    const response = await fetch(`${BASE_URL}?key=${GEMINI_API_KEY}`);
    return response.ok;
  } catch {
    return false;
  }
};

const validateCategory = (category) => {
  const validCategories = ['Health', 'Work', 'Personal', 'Fitness', 'Learning'];
  return validCategories.includes(category) ? category : 'Personal';
};

const validatePriority = (priority) => {
  const validPriorities = ['High', 'Medium', 'Low'];
  return validPriorities.includes(priority) ? priority : 'Medium';
};