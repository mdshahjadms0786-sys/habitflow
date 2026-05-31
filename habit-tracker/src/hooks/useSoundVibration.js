import { useCallback, useState, useEffect } from 'react';

const SOUND_KEY = 'ht_sound_enabled';
const VIBRATION_KEY = 'ht_vibration_enabled';

export const loadSoundEnabled = () => {
  try {
    return localStorage.getItem(SOUND_KEY) !== 'false';
  } catch {
    return true;
  }
};

export const loadVibrationEnabled = () => {
  try {
    return localStorage.getItem(VIBRATION_KEY) !== 'false';
  } catch {
    return true;
  }
};

export const setSoundEnabled = (enabled) => {
  localStorage.setItem(SOUND_KEY, enabled);
};

export const setVibrationEnabled = (enabled) => {
  localStorage.setItem(VIBRATION_KEY, enabled);
};

let celebrationAudio = null;

const playCelebrationSound = () => {
  if (typeof window === 'undefined') return;
  
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.frequency.setValueAtTime(523.25, ctx.currentTime);
  oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
  oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
  oscillator.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3);
  
  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.5);
};

const playSuccessSound = () => {
  if (typeof window === 'undefined') return;
  
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(440, ctx.currentTime);
  oscillator.frequency.setValueAtTime(554, ctx.currentTime + 0.15);
  
  gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.3);
};

const vibratePattern = (pattern = [0, 100, 50, 100]) => {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

export const useSoundVibration = () => {
  const [soundEnabled, setSoundEnabledState] = useState(loadSoundEnabled);
  const [vibrationEnabled, setVibrationEnabledState] = useState(loadVibrationEnabled);

  const toggleSound = useCallback(() => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    setSoundEnabledState(newValue);
    if (newValue) playSuccessSound();
  }, [soundEnabled]);

  const toggleVibration = useCallback(() => {
    const newValue = !vibrationEnabled;
    setVibrationEnabled(newValue);
    setVibrationEnabledState(newValue);
    if (newValue) vibratePattern([50]);
  }, [vibrationEnabled]);

  const celebrate = useCallback(() => {
    if (soundEnabled) {
      try {
        playCelebrationSound();
      } catch (e) {
        console.log('Sound play failed:', e);
      }
    }
    if (vibrationEnabled) {
      try {
        vibratePattern([0, 100, 50, 100, 50, 200]);
      } catch (e) {
        console.log('Vibration failed:', e);
      }
    }
  }, [soundEnabled, vibrationEnabled]);

  const success = useCallback(() => {
    if (soundEnabled) {
      try {
        playSuccessSound();
      } catch (e) {
        console.log('Sound play failed:', e);
      }
    }
    if (vibrationEnabled) {
      try {
        vibratePattern([50]);
      } catch (e) {
        console.log('Vibration failed:', e);
      }
    }
  }, [soundEnabled, vibrationEnabled]);

  return {
    soundEnabled,
    vibrationEnabled,
    toggleSound,
    toggleVibration,
    celebrate,
    success,
  };
};

export default useSoundVibration;