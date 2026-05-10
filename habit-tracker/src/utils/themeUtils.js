const THEME_KEY = 'ht_theme';

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const THEMES = {
  default: { primary: '#534AB7', name: 'Purple' },
  blue: { primary: '#185FA5', name: 'Ocean Blue' },
  green: { primary: '#1D9E75', name: 'Forest Green' },
  orange: { primary: '#D85A30', name: 'Sunset Orange' },
  pink: { primary: '#D4537E', name: 'Cherry Pink' },
};

export const getCurrentTheme = () => {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return saved && THEMES[saved] ? saved : 'default';
  } catch {
    return 'default';
  }
};

export const saveTheme = (themeId) => {
  if (!THEMES[themeId]) return;
  localStorage.setItem(THEME_KEY, themeId);
};

export const applyTheme = (themeId) => {
  const theme = THEMES[themeId] || THEMES.default;
  const root = document.documentElement;

  root.style.setProperty('--primary', theme.primary);

  const primaryRgb = hexToRgb(theme.primary);
  if (primaryRgb) {
    root.style.setProperty('--primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
  }

  saveTheme(themeId);
};

export default THEMES;