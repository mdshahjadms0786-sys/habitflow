import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { THEMES, applyTheme, getCurrentTheme } from '../../utils/themeUtils';

const ThemeSelector = () => {
  const [currentTheme, setCurrentTheme] = useState(getCurrentTheme());

  useEffect(() => {
    applyTheme(currentTheme);
  }, []);

  const handleThemeChange = (themeId) => {
    applyTheme(themeId);
    setCurrentTheme(themeId);
  };

  const themeList = Object.entries(THEMES);

  return (
    <div>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
        App Theme 🎨
      </h3>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {themeList.map(([themeId, theme]) => (
          <motion.button
            key={themeId}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleThemeChange(themeId)}
            title={theme.name}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: theme.primary,
              border: currentTheme === themeId ? '3px solid var(--text)' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              boxShadow: currentTheme === themeId ? '0 0 0 2px var(--bg)' : 'none',
            }}
          >
            {currentTheme === themeId && (
              <span style={{ color: '#ffffff', fontSize: '20px', fontWeight: 'bold' }}>✓</span>
            )}
          </motion.button>
        ))}
      </div>

      <p style={{ margin: '12px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
        Current: {THEMES[currentTheme]?.name || 'Purple'}
      </p>
    </div>
  );
};

export default ThemeSelector;