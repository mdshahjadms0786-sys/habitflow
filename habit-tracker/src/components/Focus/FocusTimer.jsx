import { useMemo } from 'react';

const FocusTimer = ({ timeLeft, totalTime, isBreak = false }) => {
  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [timeLeft]);

  const progress = useMemo(() => {
    if (totalTime === 0) return 0;
    return timeLeft / totalTime;
  }, [timeLeft, totalTime]);

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const ringColor = isBreak ? '#22c55e' : '#8b5cf6';
  const bgColor = isBreak ? '#22c55e20' : '#8b5cf620';
  const label = isBreak ? 'BREAK' : 'FOCUS';

  return (
    <div style={{ position: 'relative', width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="180" height="180" viewBox="0 0 180 180" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
        <circle cx="90" cy="90" r={radius} fill="none" stroke={bgColor} strokeWidth="6" />
        <circle cx="90" cy="90" r={radius} fill="none" stroke={ringColor} strokeWidth="6" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }} />
      </svg>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '36px', fontWeight: '700', color: '#fff', fontFamily: 'monospace', letterSpacing: '2px' }}>{formattedTime}</span>
        <span style={{ fontSize: '12px', fontWeight: '600', color: isBreak ? '#22c55e' : '#8b5cf6', letterSpacing: '3px', marginTop: '2px' }}>{label}</span>
      </div>
    </div>
  );
};

export default FocusTimer;