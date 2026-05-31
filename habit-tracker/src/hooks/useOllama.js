import { useState, useCallback } from 'react';
import { getHabitSuggestions, getDailyMotivation, checkOllamaConnection } from '../utils/ollamaService';

export const useOllama = (_model) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(true);

  const checkConnection = useCallback(async () => {
    setConnected(true);
    return true;
  }, []);

  const fetchSuggestions = useCallback(async (userGoal) => {
    setLoading(true);
    setError(null);
    try {
      const suggestions = await getHabitSuggestions(userGoal);
      return suggestions;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMotivation = useCallback(async (stats) => {
    try {
      const motivation = await getDailyMotivation(stats);
      return motivation;
    } catch {
      return null;
    }
  }, []);

  return {
    loading,
    error,
    connected,
    checkConnection,
    fetchSuggestions,
    fetchMotivation,
  };
};

export default useOllama;
