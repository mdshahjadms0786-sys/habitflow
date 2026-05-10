import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'];

const ConfettiParticle = ({ index, total }) => {
  const color = colors[index % colors.length];
  const left = (index / total) * 100;
  const delay = Math.random() * 0.5;
  const duration = 2 + Math.random() * 2;
  const size = 8 + Math.random() * 8;

  return (
    <motion.div
      initial={{ y: -20, x: 0, opacity: 1, rotate: 0 }}
      animate={{
        y: window.innerHeight + 20,
        x: Math.sin(index) * 100,
        opacity: [1, 1, 0],
        rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
      }}
      transition={{
        duration,
        delay,
        ease: 'linear',
      }}
      style={{
        position: 'fixed',
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        borderRadius: Math.random() > 0.5 ? '50%' : '4px',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};

export const ConfettiEffect = ({ trigger, duration = 3000 }) => {
  const [particles, setParticles] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsVisible(true);
      const newParticles = Array.from({ length: 60 }, (_, i) => i);
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger, duration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 9999,
            overflow: 'hidden',
          }}
        >
          {particles.map((index) => (
            <ConfettiParticle key={index} index={index} total={particles.length} />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfettiEffect;
