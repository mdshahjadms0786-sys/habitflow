import { useState } from 'react';
import { motion } from 'framer-motion';
import { LIFE_AREAS } from '../../utils/lifeAreasUtils';

const WheelOfLife = ({ scores, size = 400, onAreaClick }) => {
  const [hoveredArea, setHoveredArea] = useState(null);
  const center = size / 2;
  const radius = size / 2 - 20;
  
  const calculateBalanceScore = () => {
    const validScores = Object.values(scores).filter(s => s !== null);
    if (validScores.length === 0) return 0;
    const avg = validScores.reduce((a, b) => a + b, 0) / validScores.length;
    const variance = validScores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / validScores.length;
    const balance = Math.max(0, 100 - (Math.sqrt(variance) / 50) * 100);
    return Math.round(balance);
  };
  
  const balanceScore = calculateBalanceScore();
  const strongest = Object.entries(scores).sort((a, b) => (b[1] || 0) - (a[1] || 0))[0];
  const weakest = Object.entries(scores).sort((a, b) => (a[1] || 100) - (b[1] || 100))[0];
  
  const getSegmentPath = (startAngle, endAngle, innerRadius = 0) => {
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    
    const x1 = center + innerRadius * Math.cos(startRad);
    const y1 = center + innerRadius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(startRad);
    const y2 = center + radius * Math.sin(startRad);
    const x3 = center + radius * Math.cos(endRad);
    const y3 = center + radius * Math.sin(endRad);
    const x4 = center + innerRadius * Math.cos(endRad);
    const y4 = center + innerRadius * Math.sin(endRad);
    
    return `M ${x1} ${y1} L ${x2} ${y2} A ${radius} ${radius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1}`;
  };
  
  const segmentAngle = 360 / 8;
  
  const getScoreRadius = (score) => {
    if (score === null) return 0;
    return (radius * 0.4) + (radius * 0.55 * (score / 100));
  };
  
  const getIconPosition = (startAngle, endAngle, radius) => {
    const midAngle = startAngle + segmentAngle / 2;
    const iconRadius = radius * 0.85;
    return {
      x: center + iconRadius * Math.cos((midAngle - 90) * Math.PI / 180),
      y: center + iconRadius * Math.sin((midAngle - 90) * Math.PI / 180)
    };
  };

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          {LIFE_AREAS.map(area => (
            <linearGradient key={area.id} id={`gradient-${area.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={area.color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={area.color} stopOpacity="0.4" />
            </linearGradient>
          ))}
        </defs>
        
        {LIFE_AREAS.map((area, idx) => {
          const startAngle = idx * segmentAngle;
          const endAngle = (idx + 1) * segmentAngle;
          const score = scores[area.id];
          const isHovered = hoveredArea === area.id;
          const iconPos = getIconPosition(startAngle, endAngle, radius);
          
          return (
            <g key={area.id}>
              <path
                d={getSegmentPath(startAngle, endAngle, 0)}
                fill="none"
                stroke={area.color}
                strokeWidth="1"
                opacity="0.3"
              />
              
              {score !== null && (
                <path
                  d={getSegmentPath(startAngle, endAngle, 0)}
                  fill={`url(#gradient-${area.id})`}
                  style={{
                    cursor: 'pointer',
                    transition: 'opacity 0.2s'
                  }}
                  opacity={isHovered ? 1 : 0.7}
                  onMouseEnter={() => setHoveredArea(area.id)}
                  onMouseLeave={() => setHoveredArea(null)}
                  onClick={() => onAreaClick?.(area.id)}
                />
              )}
              
              <path
                d={getSegmentPath(startAngle, endAngle, radius * 0.3)}
                fill="none"
                stroke={area.color}
                strokeWidth="2"
                opacity="0.5"
              />
              
              <text
                x={iconPos.x}
                y={iconPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={size > 300 ? '24' : '16'}
                style={{ pointerEvents: 'none' }}
              >
                {area.icon}
              </text>
            </g>
          );
        })}
        
        <circle
          cx={center}
          cy={center}
          r={radius * 0.3}
          fill="var(--surface)"
          stroke="var(--border)"
          strokeWidth="2"
        />
        
        <text
          x={center}
          y={center - 10}
          textAnchor="middle"
          fontSize={size > 300 ? '14' : '10'}
          fontWeight="600"
          fill="var(--text)"
        >
          Life Balance
        </text>
        <text
          x={center}
          y={center + 15}
          textAnchor="middle"
          fontSize={size > 300 ? '28' : '18'}
          fontWeight="700"
          fill="var(--primary)"
        >
          {balanceScore}
        </text>
      </svg>
      
      {hoveredArea && scores[hoveredArea] !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'var(--surface)',
            padding: '12px 16px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            textAlign: 'center',
            pointerEvents: 'none'
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '4px' }}>
            {LIFE_AREAS.find(a => a.id === hoveredArea)?.icon}
          </div>
          <div style={{ fontWeight: '600', fontSize: '14px' }}>
            {LIFE_AREAS.find(a => a.id === hoveredArea)?.name}
          </div>
          <div style={{ 
            fontWeight: '700', 
            fontSize: '20px',
            color: LIFE_AREAS.find(a => a.id === hoveredArea)?.color 
          }}>
            {scores[hoveredArea]}%
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WheelOfLife;