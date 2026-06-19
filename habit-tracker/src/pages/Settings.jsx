import { useState } from 'react';
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
import toast from 'react-hot-toast';

const Settings = () => {
  const {
    darkMode,
    showMotivation,
    setDarkMode,
    setShowMotivation,
    resetAllData,
  } = useHabits();

  const { user, logout } = useAuthContext();

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
      <header
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
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{padding: '1rem', background: 'var(--color-background-secondary)', borderRadius: '8px', marginBottom: '1rem'}}>
          <p style={{color: 'var(--color-text-secondary)', fontSize: '14px'}}>
            ☁️ Cloud sync is disabled. Your data is saved locally.
          </p>
        </div>

        {/* 1. Appearance Section */}
        <div
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
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  position: 'absolute',
                  top: '2px',
                  left: darkMode ? '26px' : '2px',
                  transition: 'left 0.2s',
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
              <div
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
        </div>

        {/* 2. Notifications Section */}
        <div
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
        </div>

        {/* 3. Reports Section */}
        <div
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
        </div>

        {/* 4. Data Management Section */}
        <div
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
            <button
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
            </button>
            <button
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
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <button
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
            </button>
            <button
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
            </button>
            <button
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
            </button>
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
            <button
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
            </button>
          </div>
        </div>

        {/* 5. AI Section */}
        <div
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
            🤖 AI Coach
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
            <span style={{ fontSize: '14px', color: 'var(--text)' }}>Gemini AI Active</span>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
            AI features powered by Google Gemini 1.5 Flash — always online, no setup needed.
          </p>
        </div>

        {/* Points & Levels Section */}
        <div
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <PointsDisplay />
        </div>

        {/* Referral Section */}
        <div
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <ReferralSection />
        </div>

        {/* Goals Section */}
        <div
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <GoalSetter />
        </div>

        {/* Streak Insurance Section */}
        <div
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
        </div>

        {/* Sound & Vibration Section */}
        <div
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <SoundVibrationSettings />
        </div>

        {/* 6. About Section */}
        <div
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
        </div>

        {/* 7. Account Section */}
        <div
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '8px'
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
            👤 Account
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: 'var(--text)' }}>
                  Logged in as
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {user?.email || 'Authenticated User'}
                </p>
              </div>
            </div>
            
            <button
              onClick={logout}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#dc2626',
                backgroundColor: 'transparent',
                border: '1px solid #fca5a5',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>🚪</span> Logout
            </button>
          </div>
        </div>

        <StreakInsuranceModal 
          isOpen={showInsuranceModal} 
          onClose={() => setShowInsuranceModal(false)} 
        />
      </div>
    </div>
  );
};

export default Settings;
