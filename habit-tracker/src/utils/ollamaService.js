const DEFAULT_MODEL = 'llama3';
const BASE_URL = 'http://localhost:11434';

export const checkOllamaStatus = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/tags`, { 
      signal: AbortSignal.timeout(2000) 
    });
    if (!response.ok) {
      return { isRunning: false, models: [] };
    }
    const data = await response.json();
    return { isRunning: true, models: data.models?.map(m => m.name) || [] };
  } catch {
    return { isRunning: false, models: [] };
  }
};

export const streamCompletion = async ({ prompt, model = DEFAULT_MODEL, onChunk, onDone, onError }) => {
  try {
    const response = await fetch(`${BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim());
        lines.forEach(line => {
          try {
            const json = JSON.parse(line);
            if (json.response) {
              onChunk(json.response);
            }
            if (json.done) {
              done = true;
              onDone();
            }
          } catch {
            // Skip non-JSON lines
          }
        });
      }
    }

    if (!done) onDone();
  } catch (error) {
    onError(error);
  }
};

export const getCompletion = async (prompt, model = DEFAULT_MODEL) => {
  try {
    const status = await checkOllamaStatus();
    if (!status.isRunning) {
      return null;
    }

    const response = await fetch(`${BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  } catch {
    return null;
  }
};

export const getHabitSuggestions = async (userGoal, model = DEFAULT_MODEL) => {
  const prompt = `Suggest 5 specific daily habits for someone who wants to: ${userGoal}. Return ONLY a JSON array with objects having keys: name, category, priority, notes. Categories must be one of: Health, Work, Personal, Fitness, Learning. Priorities must be one of: High, Medium, Low. Example format: [{"name": "Morning meditation", "category": "Health", "priority": "Medium", "notes": "Start with 5 minutes"}]`;

  try {
    const response = await fetch(`${BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.response;

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

export const getDailyMotivation = async (stats, model = DEFAULT_MODEL) => {
  const prompt = `Give one short motivational sentence (max 15 words) for someone who has completed ${stats.completedToday}/${stats.totalHabits} habits today and has a ${stats.bestStreak} day streak.`;

  try {
    const response = await fetch(`${BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response.trim();
  } catch (error) {
    return null;
  }
};

export const checkOllamaConnection = async () => {
  try {
    const response = await fetch(`${DEFAULT_URL}/api/tags`);
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
