import { useState, useEffect, useRef, useCallback } from 'react';
import { rain, ocean, cafe, forest } from './FocusAmbientSound';

const soundFunctions = { rain, ocean, cafe, forest };
const soundIcons = { rain: '🌧️', ocean: '🌊', cafe: '☕', forest: '🌿' };
const soundLabels = { rain: 'Rain', ocean: 'Ocean', cafe: 'Cafe', forest: 'Forest' };

const FocusSoundControls = ({ activeSound, onSoundChange, volume = 50 }) => {
  const [currentVolume, setCurrentVolume] = useState(volume);
  const soundInstanceRef = useRef(null);
  
  const handleSoundToggle = useCallback((soundName) => {
    if (activeSound === soundName) {
      if (soundInstanceRef.current) { soundInstanceRef.current.stop(); soundInstanceRef.current = null; }
      onSoundChange(null);
    } else {
      if (soundInstanceRef.current) soundInstanceRef.current.stop();
      const soundFn = soundFunctions[soundName];
      soundInstanceRef.current = soundFn();
      soundInstanceRef.current.start(currentVolume / 100);
      onSoundChange(soundName);
    }
  }, [activeSound, currentVolume, onSoundChange]);
  
  const handleVolumeChange = useCallback((newVolume) => {
    setCurrentVolume(newVolume);
    if (soundInstanceRef.current) soundInstanceRef.current.setVolume(newVolume / 100);
  }, []);

  useEffect(() => { return () => { if (soundInstanceRef.current) soundInstanceRef.current.stop(); }; }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {Object.keys(soundFunctions).map(soundName => (
          <button key={soundName} onClick={() => handleSoundToggle(soundName)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '8px 10px', backgroundColor: activeSound === soundName ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.1)', border: `2px solid ${activeSound === soundName ? '#8b5cf6' : 'rgba(255,255,255,0.2)'}`, borderRadius: '10px', cursor: 'pointer', minWidth: '56px' }}>
            <span style={{ fontSize: '18px' }}>{soundIcons[soundName]}</span>
            <span style={{ fontSize: '9px', color: '#fff', opacity: 0.8 }}>{soundLabels[soundName]}</span>
          </button>
        ))}
      </div>
      
      {!activeSound ? (
        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Sound Off</span>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>🔈</span>
          <input type="range" min="0" max="100" value={currentVolume} onChange={(e) => handleVolumeChange(Number(e.target.value))} style={{ width: '80px', height: '3px', WebkitAppearance: 'none', background: `linear-gradient(to right, #8b5cf6 ${currentVolume}%, rgba(255,255,255,0.2) ${currentVolume}%)`, borderRadius: '2px', outline: 'none' }} />
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>🔊</span>
        </div>
      )}
    </div>
  );
};

export default FocusSoundControls;