import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePlanContext } from '../../context/PlanContext';

export const Navbar = () => {
  const { isPro: isUserPro, isElite: isUserElite } = usePlanContext();

  const getNavItems = () => {
    const baseItems = [
      { path: '/', label: 'Home', icon: '📊' },
      { path: '/habits', label: 'Habits', icon: '✅' },
      { path: '/stats', label: 'Stats', icon: '📈' },
    ];

    if (isUserPro) {
      return [
        ...baseItems,
        { path: '/focus', label: 'Focus', icon: '⏱️' },
        { path: '/settings', label: 'More', icon: '⚙️' },
      ];
    }

    return [
      ...baseItems,
      { path: '/achievements', label: 'Badges', icon: '🏅' },
      { path: '/settings', label: 'Settings', icon: '⚙️' },
    ];
  };

  const navItems = getNavItems();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '8px 0',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 100,
      }}
    >
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          style={{ textDecoration: 'none' }}
        >
          {({ isActive }) => (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 16px',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                textDecoration: 'none',
              }}
            >
              <span
                style={{
                  fontSize: '24px',
                  filter: isActive ? 'none' : 'grayscale(100%)',
                  transition: 'filter 0.2s',
                }}
              >
                {item.icon}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: isActive ? '600' : '400',
                }}
              >
                {item.label}
              </span>
            </motion.div>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navbar;