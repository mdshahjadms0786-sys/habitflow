import { useState, useEffect } from 'react';

export default function SyncStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div style={{
      padding: '6px 12px',
      borderRadius: '8px',
      backgroundColor: '#ef4444',
      color: '#fff',
      fontSize: '12px',
      fontWeight: '600',
    }}>
      Offline
    </div>
  );
}
