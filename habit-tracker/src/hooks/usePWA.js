import { useState, useEffect, useCallback } from 'react';

const DISMISSAL_KEY = 'pwa_install_dismissed';
const DISMISSAL_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isDismissed, setIsDismissed] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);

  // Check if dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISSAL_KEY);
    if (dismissed) {
      const { timestamp } = JSON.parse(dismissed);
      if (Date.now() - timestamp < DISMISSAL_DURATION) {
        setIsDismissed(true);
      } else {
        localStorage.removeItem(DISMISSAL_KEY);
      }
    }
  }, []);

  // Listen for install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Listen for online/offline
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Listen for service worker updates
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const handleControllerChange = () => {
        navigator.serviceWorker.ready.then((reg) => {
          if (reg.waiting) {
            setWaitingWorker(reg.waiting);
          }
        });
      };

      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

      navigator.serviceWorker.ready.then((reg) => {
        if (reg.waiting) {
          setWaitingWorker(reg.waiting);
        }

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setWaitingWorker(newWorker);
              }
            });
          }
        });
      });

      return () => {
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      };
    }
  }, []);

  const installApp = useCallback(async () => {
    if (!deferredPrompt) return false;

    const result = await deferredPrompt.prompt();
    if (result.outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
      return true;
    }
    return false;
  }, [deferredPrompt]);

  const dismissInstall = useCallback(() => {
    setIsDismissed(true);
    setIsInstallable(false);
    localStorage.setItem(DISMISSAL_KEY, JSON.stringify({ timestamp: Date.now() }));
  }, []);

  const skipWaiting = useCallback(() => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      waitingWorker.addEventListener('statechange', (e) => {
        if (e.target.state === 'activated') {
          window.location.reload();
        }
      });
    }
  }, [waitingWorker]);

  return {
    isInstallable: isInstallable && !isDismissed,
    isInstalled,
    isOffline,
    waitingWorker,
    installApp,
    dismissInstall,
    skipWaiting,
  };
};
