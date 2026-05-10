import { useState } from 'react';
import { motion } from 'framer-motion';
import { useHabits } from '../hooks/useHabits';
import { useAuthContext } from '../context/AuthContext';
import NotificationSetup from '../components/Notifications/NotificationSetup';
import WeeklyReviewButton from '../components/WeeklyReview/WeeklyReviewButton';
import ThemeSelector from '../components/Settings/ThemeSelector';
import GoalSetter from '../components/Settings/GoalSetter';
import StreakInsuranceModal from '../components/Settings/StreakInsuranceModal';
import PointsDisplay from '../components/Settings/PointsDisplay';
import ReferralSection from '../components/Social/ReferralSection';
import SoundVibrationSettings from '../components/Settings/SoundVibrationSettings';
import { exportHabitsCSV, exportHabitsJSON, exportHabitsText } from '../utils/exportUtils';
import { isSupabaseConfigured } from '../services/supabaseClient';
import LoginForm from '../components/Auth/LoginForm';
import toast from 'react-hot-toast';

const Settings = () => {
  const {
    darkMode,
    ollamaModel,
    showMotivation,
    setDarkMode,
    setOllamaModel,
    setShowMotivation,
    resetAllData,
  } = useHabits();

  const { user, isAuthenticated, login, signup, isLoading: authLoading, authError, logout, isSupabaseConfigured: supabaseConfigured } = useAuthContext();

  const [modelInput, setModelInput] = useState(ollamaModel);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);

  const handleResetData = () => {
    if (
      window.confirm(
        '⚠️ Are you sure you want to reset all data? This will delete all your habits and cannot be undone!'
      )
    ) {
      resetAllData();
      toast.success('🗑️ All data has been reset');
    }
  };

  const handleSaveModel = () => {
    setOllamaModel(modelInput);
    toast.success('✅ Ollama model updated!');
  };

  const handleExportData = () => {
    const data = {
      habits: JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]'),
      settings: JSON.parse(localStorage.getItem('habit-tracker-settings') || '{}'),
      moodLog: JSON.parse(localStorage.getItem('ht_moodlog') || '{}'),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit-tracker-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('📦 Data exported!');
  };

  const handleExportCSV = () => {
    const habits = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');
    exportHabitsCSV(habits);
    toast.success('📊 CSV exported!');
  };

  const handleExportJSON = () => {
    const habits = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');
    exportHabitsJSON(habits);
    toast.success('📦 JSON exported!');
  };

  const handleExportText = () => {
    const habits = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');
    exportHabitsText(habits);
    toast.success('📝 Text exported!');
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          if (data.habits) localStorage.setItem('habit-tracker-habits', JSON.stringify(data.habits));
          if (data.settings) localStorage.setItem('habit-tracker-settings', JSON.stringify(data.settings));
          if (data.moodLog) localStorage.setItem('ht_moodlog', JSON.stringify(data.moodLog));
          toast.success('📥 Data imported! Refresh to see changes.');
          setTimeout(() => window.location.reload(), 1000);
        } catch {
          toast.error('Invalid file format');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="page-container" style={{ padding: '24px', paddingBottom: '80px' }}>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '24px' }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--text)',
          }}
        >
          Settings
        </h1>
        <p
          style={{
            margin: '8px 0 0 0',
            fontSize: '14px',
            color: 'var(--text-secondary)',
          }}
        >
          Customize your experience
        </p>
      </motion.header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{padding: '1rem', background: 'var(--color-background-secondary)', borderRadius: '8px', marginBottom: '1rem'}}>
          <p style={{color: 'var(--color-text-secondary)', fontSize: '14px'}}>
            ☁️ Cloud sync is disabled. Your data is saved locally.
          </p>
        </div>

        {/* 1. Appearance Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <h2
            style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--text)',
            }}
          >
            🎨 Appearance
          </h2>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--text)',
                }}
              >
                Dark Mode
              </p>
              <p
                style={{
                  margin: '4px 0 0 0',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                }}
              >
                Toggle dark/light theme
              </p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                width: '52px',
                height: '28px',
                borderRadius: '14px',
                backgroundColor: darkMode ? 'var(--primary)' : 'var(--border)',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background-color 0.2s',
              }}
            >
              <motion.div
                initial={false}
                animate={{ x: darkMode ? 26 : 2 }}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  position: 'absolute',
                  top: '2px',
                  transition: 'transform 0.2s',
                }}
              />
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--text)',
                }}
              >
                Show Motivation Banner
              </p>
              <p
                style={{
                  margin: '4px 0 0 0',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                }}
              >
                Display daily motivation on dashboard
              </p>
            </div>
            <button
              onClick={() => setShowMotivation(!showMotivation)}
              style={{
                width: '52px',
                height: '28px',
                borderRadius: '14px',
                backgroundColor: showMotivation ? 'var(--primary)' : 'var(--border)',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <motion.div
                initial={false}
                animate={{ x: showMotivation ? 26 : 2 }}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  position: 'absolute',
                  top: '2px',
                  transition: 'transform 0.2s',
                }}
              />
            </button>
          </div>

          <div style={{ padding: '12px 0', borderTop: '1px solid var(--border)' }}>
            <ThemeSelector />
          </div>
        </motion.div>

        {/* 2. Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <h2
            style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--text)',
            }}
          >
            🔔 Notifications
          </h2>
          <NotificationSetup />
        </motion.div>

        {/* 3. Reports Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <h2
            style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--text)',
            }}
          >
            📋 Reports
          </h2>
          <WeeklyReviewButton />
        </motion.div>

        {/* 4. Data Management Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <h2
            style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--text)',
            }}
          >
            💾 Data Management
          </h2>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExportData}
              style={{
                flex: 1,
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#ffffff',
                backgroundColor: 'var(--primary)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              📦 Export Data
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleImportData}
              style={{
                flex: 1,
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text)',
                backgroundColor: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              📥 Import Data
            </motion.button>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExportCSV}
              style={{
                flex: 1,
                minWidth: '100px',
                padding: '10px 16px',
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--text)',
                backgroundColor: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              📊 CSV
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExportJSON}
              style={{
                flex: 1,
                minWidth: '100px',
                padding: '10px 16px',
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--text)',
                backgroundColor: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              📋 JSON
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExportText}
              style={{
                flex: 1,
                minWidth: '100px',
                padding: '10px 16px',
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--text)',
                backgroundColor: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              📝 Text
            </motion.button>
          </div>

          <div
            style={{
              padding: '16px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
            }}
          >
            <p
              style={{
                margin: '0 0 12px 0',
                fontSize: '14px',
                fontWeight: '600',
                color: '#dc2626',
              }}
            >
              ⚠️ Danger Zone
            </p>
            <p
              style={{
                margin: '0 0 16px 0',
                fontSize: '13px',
                color: '#991b1b',
              }}
            >
              Resetting will permanently delete all your habits and settings. This action cannot be undone.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleResetData}
              style={{
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#ffffff',
                backgroundColor: '#dc2626',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Reset All Data
            </motion.button>
          </div>
        </motion.div>

        {/* 5. Ollama AI Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <h2
            style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--text)',
            }}
          >
            🤖 Ollama AI
          </h2>

          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="ollamaModel"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--text)',
              }}
            >
              Model Name
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                id="ollamaModel"
                value={modelInput}
                onChange={(e) => setModelInput(e.target.value)}
                placeholder="llama3"
                style={{
                  flex: 1,
                  padding: '12px',
                  fontSize: '14px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg)',
                  color: 'var(--text)',
                }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveModel}
                style={{
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffffff',
                  backgroundColor: 'var(--primary)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                Save
              </motion.button>
            </div>
            <p
              style={{
                margin: '8px 0 0 0',
                fontSize: '12px',
                color: 'var(--text-secondary)',
              }}
            >
              Default: llama3. Other options: mistral, codellama, etc.
            </p>
          </div>
        </motion.div>

        {/* Points & Levels Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <PointsDisplay />
        </motion.div>

        {/* Referral Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <ReferralSection />
        </motion.div>

        {/* Goals Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <GoalSetter />
        </motion.div>

        {/* Streak Insurance Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px',
            cursor: 'pointer',
          }}
          onClick={() => setShowInsuranceModal(true)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>🛡️</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
                Streak Insurance
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                Protect your streak from missed days
              </p>
            </div>
            <span style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>›</span>
          </div>
        </motion.div>

        {/* Sound & Vibration Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <SoundVibrationSettings />
        </motion.div>

        {/* 6. About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <h2
            style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--text)',
            }}
          >
            ℹ️ About
          </h2>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                App Version
              </span>
              <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)' }}>
                1.0.0
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Build
              </span>
              <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)' }}>
                React + Vite
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 0',
              }}
            >
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Storage
              </span>
              <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)' }}>
                LocalStorage
              </span>
            </div>
          </div>
        </motion.div>

        <StreakInsuranceModal 
          isOpen={showInsuranceModal} 
          onClose={() => setShowInsuranceModal(false)} 
        />
      </div>
    </div>
  );
};

export default Settings;
