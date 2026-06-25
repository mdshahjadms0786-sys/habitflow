import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useHabitContext } from './context/HabitContext';
import { useAuthContext } from './context/AuthContext';
import { usePlanContext } from './context/PlanContext';
import AuthGuard from './components/Auth/AuthGuard';
import AuthCallback from './components/Auth/AuthCallback';
import PlanGuard from './components/Auth/PlanGuard';
// Layout & utility components (not lazy — always needed)
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
import { isSupabaseConfigured } from './services/supabaseClient';
// Lazy-loaded pages grouped by feature
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AllHabits = lazy(() => import('./pages/AllHabits'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Achievements = lazy(() => import('./pages/Achievements'));
const ChallengePage = lazy(() => import('./pages/ChallengePage'));
const Settings = lazy(() => import('./pages/Settings'));
const MoodPage = lazy(() => import('./pages/MoodPage'));
const AICoachPage = lazy(() => import('./pages/AICoachPage'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const JournalPage = lazy(() => import('./pages/JournalPage'));
const FocusPage = lazy(() => import('./pages/FocusPage'));
const FocusHistoryPage = lazy(() => import('./pages/FocusHistoryPage'));
const BreathingPage = lazy(() => import('./pages/BreathingPage'));
const LifeScorePage = lazy(() => import('./pages/LifeScorePage'));
const VisionBoardPage = lazy(() => import('./pages/VisionBoardPage'));
const SchedulePage = lazy(() => import('./pages/SchedulePage'));
const ExperimentsPage = lazy(() => import('./pages/ExperimentsPage'));
const NewspaperPage = lazy(() => import('./pages/NewspaperPage'));
const DreamDiaryPage = lazy(() => import('./pages/DreamDiaryPage'));
const TimelinePage = lazy(() => import('./pages/TimelinePage'));
const BetsPage = lazy(() => import('./pages/BetsPage'));
const BurnoutPage = lazy(() => import('./pages/BurnoutPage'));
const WidgetsPage = lazy(() => import('./pages/WidgetsPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const UpgradePage = lazy(() => import('./pages/UpgradePage'));
const CertificationsPage = lazy(() => import('./pages/CertificationsPage'));
const HabitStatsPage = lazy(() => import('./pages/HabitStatsPage'));
const HelpPage = lazy(() => import('./pages/HelpPage'));
const WeeklyReportPage = lazy(() => import('./pages/WeeklyReportPage'));
const AICoachingPage = lazy(() => import('./pages/AICoachingPage'));
const HabitStacksPage = lazy(() => import('./pages/HabitStacksPage'));
const LifeAreasPage = lazy(() => import('./pages/LifeAreasPage'));
const GoalsPage = lazy(() => import('./pages/GoalsPage'));
const LeaguesPage = lazy(() => import('./pages/LeaguesPage'));
const AIHabitArchitectPage = lazy(() => import('./pages/AIHabitArchitectPage'));
const LifeOSDashboardPage = lazy(() => import('./pages/LifeOSDashboardPage'));
const PredictiveAIPage = lazy(() => import('./pages/PredictiveAIPage'));
const SmartInterventionPage = lazy(() => import('./pages/SmartInterventionPage'));
const MonthlyBehaviorReportPage = lazy(() => import('./pages/MonthlyBehaviorReportPage'));
const HabitROIDashboardPage = lazy(() => import('./pages/HabitROIDashboardPage'));
const HabitTwinPage = lazy(() => import('./pages/HabitTwinPage'));
const WeeklyEmailPage = lazy(() => import('./pages/WeeklyEmailPage'));
const DNAEvolutionPage = lazy(() => import('./pages/DNAEvolutionPage'));
const WhiteGloveOnboardingPage = lazy(() => import('./pages/WhiteGloveOnboardingPage'));
const EliteDashboardPage = lazy(() => import('./pages/EliteDashboardPage'));
const PointsPage = lazy(() => import('./pages/PointsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));

const PageLoading = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    color: 'var(--text-secondary)',
    fontSize: '14px',
    gap: '12px',
  }}>
    <div style={{
      width: '20px',
      height: '20px',
      border: '2px solid var(--border)',
      borderTopColor: 'var(--primary)',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    Loading...
  </div>
);

function AppContent() {
  const { darkMode } = useHabitContext();
  const navigate = useNavigate();
  const [isTyping, setIsTyping] = useState(false);
  const { user, isLoading: authLoading } = useAuthContext();
  const { isProfileLoading } = usePlanContext();
  const {
    isInstallable,
    isOffline,
    installApp,
    dismissInstall,
  } = usePWA();

  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    if (authLoading || isProfileLoading) return;

    const completed = localStorage.getItem('ht_onboarding_complete');
    const selectedPlan = localStorage.getItem('ht_selected_plan');

    if (currentPath === '/auth/callback') return;

    if (user) {
      if (!completed) {
        if (currentPath !== '/onboarding') {
          navigate('/onboarding', { replace: true });
        }
      } else {
        if (currentPath === '/landing' || currentPath === '/onboarding') {
          navigate('/', { replace: true });
        }
      }
    } else {
      if (!completed) {
        if (!selectedPlan && currentPath !== '/landing') {
          navigate('/landing', { replace: true });
        } else if (selectedPlan && currentPath !== '/login' && currentPath !== '/landing') {
          navigate('/login', { replace: true });
        }
      }
    }
  }, [user, authLoading, isProfileLoading, navigate, currentPath]);

  const hideNavigation = currentPath === '/landing' || currentPath === '/onboarding' || currentPath === '/auth/callback' || currentPath === '/login' || currentPath === '/forgot-password' || currentPath === '/reset-password';

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

  useEffect(() => {
    const initCapacitor = async () => {
      try {
        const { SplashScreen } = await import('@capacitor/splash-screen')
        await SplashScreen.hide()
      } catch (e) {
        // Ignore splash screen imports on web/non-capacitor
      }
      try {
        const { App } = await import('@capacitor/app')
        await App.addListener('backButton', ({ canGoBack }) => {
          if (canGoBack) {
            navigate(-1)
          } else {
            const confirmed = window.confirm('Exit HabitFlow?')
            if (confirmed) {
              App.exitApp()
            }
          }
        })
      } catch (e) {
        // Ignore App imports on web/non-capacitor
      }
    }
    initCapacitor()
  }, [navigate])

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
          <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
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
            <Route path="/dream-diary" element={<PlanGuard requiredPlan="elite"><DreamDiaryPage /></PlanGuard>} />
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
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/points" element={<PointsPage />} />
          </Routes>
          </Suspense>
          
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
      <UpdatePrompt />
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
  const { user, isLoading: authLoading, login, signup, authError, loginLockRemaining } = useAuthContext();
  
  return (
    <AuthGuard
      user={user}
      isLoading={authLoading}
      onLogin={login}
      onSignup={signup}
      authError={authError}
      loginLockRemaining={loginLockRemaining}
    >
      <AppContent />
    </AuthGuard>
  );
}

function App() {
  return (
    <>
      {!isSupabaseConfigured && (
        <div style={{
          background: '#ef4444',
          color: 'white',
          padding: '12px',
          textAlign: 'center',
          fontSize: '14px'
        }}>
          Server connection issue. Please contact support.
        </div>
      )}
      <BrowserRouter>
        <AppWithRouter />
      </BrowserRouter>
    </>
  );
}

export default App;
