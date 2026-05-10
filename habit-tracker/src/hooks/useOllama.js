import { useState, useCallback } from 'react';
import { getHabitSuggestions, getDailyMotivation, checkOllamaConnection } from '../utils/ollamaService';

export const useOllama = (model) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(null);

  const checkConnection = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const isConnected = await checkOllamaConnection();
      setConnected(isConnected);
      return isConnected;
    } catch (err) {
      setConnected(false);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSuggestions = useCallback(async (userGoal) => {
    setLoading(true);
    setError(null);
    try {
      const suggestions = await getHabitSuggestions(userGoal, model);
      return suggestions;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [model]);

  const fetchMotivation = useCallback(async (stats) => {
    try {
      const motivation = await getDailyMotivation(stats, model);
      return motivation;
    } catch {
      return null;
    }
  }, [model]);

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
