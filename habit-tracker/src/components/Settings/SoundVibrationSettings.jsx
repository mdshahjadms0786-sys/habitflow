import { useSoundVibration } from '../../hooks/useSoundVibration';

const SoundVibrationSettings = () => {
  const { soundEnabled, vibrationEnabled, toggleSound, toggleVibration } = useSoundVibration();

  return (
    <div>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
        Sound & Vibration 🔊
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: 'var(--text)' }}>Completion Sound</span>
          <button
            onClick={toggleSound}
            style={{
              width: '52px',
              height: '28px',
              borderRadius: '14px',
              backgroundColor: soundEnabled ? 'var(--primary)' : 'var(--border)',
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
                left: soundEnabled ? '26px' : '2px',
                transition: 'transform 0.2s',
              }}
            />
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: 'var(--text)' }}>Vibration</span>
          <button
            onClick={toggleVibration}
            style={{
              width: '52px',
              height: '28px',
              borderRadius: '14px',
              backgroundColor: vibrationEnabled ? 'var(--primary)' : 'var(--border)',
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
                left: vibrationEnabled ? '26px' : '2px',
                transition: 'transform 0.2s',
              }}
            />
          </button>
        </div>

        <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
          Test by completing a habit!
        </p>
      </div>
    </div>
  );
};

export default SoundVibrationSettings;