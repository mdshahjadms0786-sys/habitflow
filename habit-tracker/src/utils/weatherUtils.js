const WEATHER_KEY = 'ht_weather';

export const getUserLocation = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve(null)
    );
  });
};

export const fetchWeather = async (lat, lon) => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.current_weather) return null;
    
    const code = data.current_weather.weathercode;
    const temp = data.current_weather.temperature;
    
    let condition = 'sunny', description = 'Clear', icon = '☀️', isOutdoorFriendly = true;
    if (code >= 51 && code < 80) { condition = 'rainy'; description = 'Rainy'; icon = '🌧️'; isOutdoorFriendly = false; }
    else if (code >= 80) { condition = 'stormy'; description = 'Stormy'; icon = '⛈️'; isOutdoorFriendly = false; }
    else if (code > 10 && code < 50) { condition = 'cloudy'; description = 'Cloudy'; icon = '☁️'; }
    else if (temp < 10) { condition = 'cold'; description = 'Cold'; icon = '❄️'; }
    else if (temp > 35) { condition = 'hot'; description = 'Hot'; icon = '🔥'; isOutdoorFriendly = false; }
    
    return { temp: Math.round(temp), condition, description, icon, isOutdoorFriendly };
  } catch {
    return null;
  }
};

export const getCachedWeather = () => {
  try {
    const cached = JSON.parse(localStorage.getItem(WEATHER_KEY));
    if (cached && Date.now() - cached.timestamp < 3600000) return cached.data;
    return null;
  } catch { return null; }
};

export const saveWeather = (weather) => {
  localStorage.setItem(WEATHER_KEY, JSON.stringify({ data: weather, timestamp: Date.now() }));
};

export const getWeatherAdvice = (weather, habits) => {
  if (!habits || !weather) return [];
  const outdoorKeywords = ['run', 'walk', 'cycle', 'outdoor', 'cycling', 'swim'];
  const suggestions = [];
  
  if (!weather.isOutdoorFriendly) {
    habits.forEach(h => {
      if (outdoorKeywords.some(k => h.name.toLowerCase().includes(k))) {
        suggestions.push({ habitId: h.id, advice: `Indoor day — consider ${h.name} alternatives`, type: 'warning' });
      }
    });
  }
  
  if (weather.condition === 'hot' || weather.temp > 30) {
    const waterHabit = habits.find(h => h.name.toLowerCase().includes('water'));
    if (waterHabit) suggestions.push({ habitId: waterHabit.id, advice: 'Hot day — double your water!', type: 'suggestion' });
  }
  
  return suggestions;
};