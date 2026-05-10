import { motion } from 'framer-motion';

const steps = [
  { 
    number: 1, 
    title: 'Download Ollama', 
    description: 'Get the installer for your computer',
    link: 'https://ollama.com'
  },
  { 
    number: 2, 
    title: 'Install Ollama', 
    description: 'Run the installer and follow the setup instructions',
  },
  { 
    number: 3, 
    title: 'Pull a model', 
    description: 'Open your terminal and run this command:',
    code: 'ollama pull llama3'
  },
  { 
    number: 4, 
    title: 'Refresh this page', 
    description: 'Click "Check Again" below once Ollama is running',
  },
];

const OllamaSetup = ({ onCheckAgain }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid var(--border)',
        maxWidth: '500px',
        margin: '0 auto',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: '700', color: 'var(--text)' }}>
          Set up AI Coach 🤖
        </h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
          Get started with local AI to analyze your habits
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '14px',
              backgroundColor: 'var(--bg)',
              borderRadius: '12px',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#534AB7',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: '13px',
                flexShrink: 0,
              }}
            >
              {step.number}
            </div>
            <div style={{ flex: 1 }}>
              {step.link ? (
                <a 
                  href={step.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#534AB7', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}
                >
                  {step.title} →
                </a>
              ) : (
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
                  {step.title}
                </h3>
              )}
              <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                {step.description}
              </p>
              {step.code && (
                <code style={{
                  display: 'block',
                  marginTop: '8px',
                  padding: '10px 14px',
                  backgroundColor: '#1e1e2e',
                  color: '#cdd6f4',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                }}>
                  {step.code}
                </code>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onCheckAgain}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '12px',
          backgroundColor: '#534AB7',
          color: '#ffffff',
          border: 'none',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
        }}
      >
        Check Again
      </motion.button>
    </motion.div>
  );
};

export default OllamaSetup;