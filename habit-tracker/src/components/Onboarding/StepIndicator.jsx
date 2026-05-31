import { motion } from 'framer-motion';

const StepIndicator = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto 32px',
        padding: '0 20px'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}
      >
        <span
          style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            fontWeight: '500'
          }}
        >
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '16px'
        }}
      >
        {Array.from({ length: totalSteps }).map((_, index) => (
          <motion.div
            key={index}
            initial={false}
            animate={{
              scale: index + 1 === currentStep ? 1.2 : 1,
              backgroundColor: index + 1 <= currentStep ? 'var(--primary)' : 'var(--border)'
            }}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>
      
      <div
        style={{
          height: '4px',
          backgroundColor: 'var(--border)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
          style={{
            height: '100%',
            backgroundColor: 'var(--primary)',
            borderRadius: '2px'
          }}
        />
      </div>
    </div>
  );
};

export default StepIndicator;