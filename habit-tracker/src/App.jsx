import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useHabitContext } from './context/HabitContext';
import { useAuthContext } from './context/AuthContext';
import AuthGuard from './components/Auth/AuthGuard';
import PlanGuard from './components/Auth/PlanGuard';
import Dashboard from './pages/Dashboard';
import AllHabits from './pages/AllHabits';
import Analytics from './pages/Analytics';
import Achievements from './pages/Achievements';
import ChallengePage from './pages/ChallengePage';
import Settings from './pages/Settings';
import MoodPage from './pages/MoodPage';
import AICoachPage from './pages/AICoachPage';
import LandingPage from './pages/LandingPage';
import CalendarPage from './pages/CalendarPage';
import JournalPage from './pages/JournalPage';
import FocusPage from './pages/FocusPage';
import FocusHistoryPage from './pages/FocusHistoryPage';
import BreathingPage from './pages/BreathingPage';
import LifeScorePage from './pages/LifeScorePage';
import VisionBoardPage from './pages/VisionBoardPage';
import SchedulePage from './pages/SchedulePage';
import ExperimentsPage from './pages/ExperimentsPage';
import NewspaperPage from './pages/NewspaperPage';
import DreamDiaryPage from './pages/DreamDiaryPage';
import TimelinePage from './pages/TimelinePage';
import BetsPage from './pages/BetsPage';
import BurnoutPage from './pages/BurnoutPage';
import WidgetsPage from './pages/WidgetsPage';
import OnboardingPage from './pages/OnboardingPage';
import ProfilePage from './pages/ProfilePage';
import UpgradePage from './pages/UpgradePage';
import CertificationsPage from './pages/CertificationsPage';
import HabitStatsPage from './pages/HabitStatsPage';
import HelpPage from './pages/HelpPage';
import WeeklyReportPage from './pages/WeeklyReportPage';
import AICoachingPage from './pages/AICoachingPage';
import HabitStacksPage from './pages/HabitStacksPage';
import LifeAreasPage from './pages/LifeAreasPage';
import GoalsPage from './pages/GoalsPage';
import LeaguesPage from './pages/LeaguesPage';
import FocusMiniPlayer from './components/Focus/FocusMiniPlayer';
import Sidebar from './components/Layout/Sidebar';
import Navbar from './components/Layout/Navbar';
import InstallBanner from './components/PWA/InstallBanner';
import OfflineBanner from './components/PWA/OfflineBanner';
import UpdatePrompt from './components/PWA/UpdatePrompt';
import TimerWidget from './components/Timer/TimerWidget';
import SyncStatus from './components/Auth/SyncStatus';
import HelpButton from './components/UI/HelpButton';
import { usePWA } from './hooks/usePWA';
import AIHabitArchitectPage from './pages/AIHabitArchitectPage';
import LifeOSDashboardPage from './pages/LifeOSDashboardPage';
import PredictiveAIPage from './pages/PredictiveAIPage';
import SmartInterventionPage from './pages/SmartInterventionPage';
import MonthlyBehaviorReportPage from './pages/MonthlyBehaviorReportPage';
import HabitROIDashboardPage from './pages/HabitROIDashboardPage';
import HabitTwinPage from './pages/HabitTwinPage';
import WeeklyEmailPage from './pages/WeeklyEmailPage';
import DNAEvolutionPage from './pages/DNAEvolutionPage';
import WhiteGloveOnboardingPage from './pages/WhiteGloveOnboardingPage';
import EliteDashboardPage from './pages/EliteDashboardPage';

function AppContent() {
  const { darkMode } = useHabitContext();
  const navigate = useNavigate();
  const [isTyping, setIsTyping] = useState(false);
  const {
    isInstallable,
    isOffline,
    waitingWorker,
    installApp,
    dismissInstall,
    skipWaiting,
  } = usePWA();

  useEffect(() => {
    const completed = localStorage.getItem('ht_onboarding_complete');
    const selectedPlan = localStorage.getItem('ht_selected_plan');
    const currentPath = window.location.pathname;
    
    if (!completed) {
      if (!selectedPlan && currentPath !== '/landing') {
        navigate('/landing', { replace: true });
      } else if (selectedPlan && currentPath !== '/onboarding' && currentPath !== '/landing') {
        navigate('/onboarding', { replace: true });
      }
    }
  }, [navigate]);

  const currentPath = window.location.pathname;
  const hideNavigation = currentPath === '/landing' || currentPath === '/onboarding';

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        setIsTyping(true);
      } else {
        setIsTyping(false);
      }

      if (e.key === '?' && !isTyping) {
        e.preventDefault();
        navigate('/help');
      }
      if (e.key === 'Escape') {
        document.activeElement?.blur();
      }
      if (e.key === 'a' && !isTyping && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('openAddHabit'));
      }
      if (e.key === 'd' && !isTyping && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        navigate('/');
      }
      if (e.key === 's' && !isTyping && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        navigate('/settings');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate, isTyping]);

  return (
    <div
      className={darkMode ? 'dark' : ''}
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--bg)',
        color: 'var(--text)',
      }}
    >
      <OfflineBanner isOffline={isOffline} />
      <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 1000 }}>
        <SyncStatus />
      </div>
      <TimerWidget />

      <div className="app-container" style={{ display: 'flex', flex: 1 }}>
        {!hideNavigation && (
          <div className="desktop-only desktop-sidebar">
            <Sidebar />
          </div>
        )}

        <main
          className={hideNavigation ? 'main-content' : 'desktop-main-content main-content'}
          style={{
            flex: 1,
            paddingBottom: '80px',
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/habits" element={<AllHabits />} />
            <Route path="/habit-stacks" element={<PlanGuard requiredPlan="pro"><HabitStacksPage /></PlanGuard>} />
            <Route path="/stats" element={<Analytics />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/journal" element={<PlanGuard requiredPlan="pro"><JournalPage /></PlanGuard>} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/certifications" element={<PlanGuard requiredPlan="pro"><CertificationsPage /></PlanGuard>} />
            <Route path="/challenge" element={<ChallengePage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/mood" element={<PlanGuard requiredPlan="pro"><MoodPage /></PlanGuard>} />
            <Route path="/ai-coach" element={<AICoachPage />} />
            <Route path="/ai-coaching" element={<PlanGuard requiredPlan="elite"><AICoachingPage /></PlanGuard>} />
            <Route path="/focus" element={<PlanGuard requiredPlan="pro"><FocusPage /></PlanGuard>} />
            <Route path="/focus-history" element={<FocusHistoryPage />} />
            <Route path="/breathing" element={<BreathingPage />} />
            <Route path="/life-score" element={<PlanGuard requiredPlan="pro"><LifeScorePage /></PlanGuard>} />
            <Route path="/life-areas" element={<PlanGuard requiredPlan="pro"><LifeAreasPage /></PlanGuard>} />
            <Route path="/goals" element={<PlanGuard requiredPlan="pro"><GoalsPage /></PlanGuard>} />
            <Route path="/vision-board" element={<PlanGuard requiredPlan="pro"><VisionBoardPage /></PlanGuard>} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/experiments" element={<ExperimentsPage />} />
            <Route path="/newspaper" element={<NewspaperPage />} />
            <Route path="/dream-diary" element={<DreamDiaryPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/bets" element={<PlanGuard requiredPlan="pro"><BetsPage /></PlanGuard>} />
            <Route path="/leagues" element={<PlanGuard requiredPlan="pro"><LeaguesPage /></PlanGuard>} />
            <Route path="/burnout" element={<BurnoutPage />} />
            <Route path="/widgets" element={<WidgetsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/upgrade" element={<UpgradePage />} />
            <Route path="/habit/:habitId/stats" element={<HabitStatsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/weekly-report" element={<WeeklyReportPage />} />
            <Route path="/elite" element={<PlanGuard requiredPlan="elite"><EliteDashboardPage /></PlanGuard>} />
            <Route path="/ai-architect" element={<PlanGuard requiredPlan="elite"><AIHabitArchitectPage /></PlanGuard>} />
            <Route path="/life-os" element={<PlanGuard requiredPlan="elite"><LifeOSDashboardPage /></PlanGuard>} />
            <Route path="/predictive" element={<PlanGuard requiredPlan="elite"><PredictiveAIPage /></PlanGuard>} />
            <Route path="/intervention" element={<PlanGuard requiredPlan="elite"><SmartInterventionPage /></PlanGuard>} />
            <Route path="/behavior-report" element={<PlanGuard requiredPlan="elite"><MonthlyBehaviorReportPage /></PlanGuard>} />
            <Route path="/habit-roi" element={<PlanGuard requiredPlan="elite"><HabitROIDashboardPage /></PlanGuard>} />
            <Route path="/habit-twin" element={<PlanGuard requiredPlan="elite"><HabitTwinPage /></PlanGuard>} />
            <Route path="/weekly-email" element={<PlanGuard requiredPlan="elite"><WeeklyEmailPage /></PlanGuard>} />
            <Route path="/dna-evolution" element={<PlanGuard requiredPlan="elite"><DNAEvolutionPage /></PlanGuard>} />
            <Route path="/white-glove" element={<PlanGuard requiredPlan="elite"><WhiteGloveOnboardingPage /></PlanGuard>} />
          </Routes>
          
          <FocusMiniPlayer />
        </main>

        {!hideNavigation && (
          <div className="mobile-only" style={{ display: 'block' }}>
            <Navbar />
          </div>
        )}
      </div>

      <InstallBanner
        isInstallable={isInstallable}
        onInstall={installApp}
        onDismiss={dismissInstall}
      />
      <UpdatePrompt waitingWorker={waitingWorker} onUpdate={skipWaiting} />
      <HelpButton />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            fontSize: '14px',
            maxWidth: '320px'
          },
          success: {
            duration: 2500,
            iconTheme: { primary: '#22c55e', secondary: 'white' }
          },
          error: {
            duration: 4000,
            iconTheme: { primary: '#EF4444', secondary: 'white' }
          }
        }}
      />
    </div>
  );
}

function AppWithRouter() {
  const { user, isLoading: authLoading, login, signup, authError } = useAuthContext();
  
  return (
    <AuthGuard
      user={user}
      isLoading={authLoading}
      onLogin={login}
      onSignup={signup}
      authError={authError}
    >
      <AppContent />
    </AuthGuard>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWithRouter />
    </BrowserRouter>
  );
}

export default App;