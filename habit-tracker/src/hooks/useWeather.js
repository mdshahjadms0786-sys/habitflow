import { useState, useEffect } from 'react';
import { getUserLocation, fetchWeather, getCachedWeather, saveWeather, getWeatherAdvice } from '../utils/weatherUtils';

export const useWeather = (habits = []) => {
  const [weather, setWeather] = useState(null);
  const [advice, setAdvice] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeatherData = async () => {
    setIsLoading(true);
    setError(null);
    
    const cached = getCachedWeather();
    if (cached) {
      setWeather(cached);
      setAdvice(getWeatherAdvice(cached, habits));
      setIsLoading(false);
      return;
    }
    
    const coords = await getUserLocation();
    if (!coords) {
      setError('Location denied');
      setIsLoading(false);
      return;
    }
    
    const data = await fetchWeather(coords.lat, coords.lon);
    if (data) {
      saveWeather(data);
      setWeather(data);
      setAdvice(getWeatherAdvice(data, habits));
    } else {
      setError('Weather unavailable');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchWeatherData();
  }, [habits]);

  return { weather, advice, isLoading, error, refresh: fetchWeatherData };
};