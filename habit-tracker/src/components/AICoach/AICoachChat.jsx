import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { streamCompletion } from '../../utils/ollamaService';
import { getQuickPrompt } from '../../utils/aiCoachUtils';

const quickActions = [
  { label: '📊 Analyze my week', type: 'analyze_week' },
  { label: '😊 Mood patterns', type: 'mood_pattern' },
  { label: '🔥 Improve streaks', type: 'improve_streaks' },
  { label: '🎯 Focus today', type: 'focus_today' },
];

const AICoachChat = ({ habits, moodLog }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your AI Coach 🤖 I can analyze your habits, explain mood patterns, and help you improve. What would you like to know?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (prompt) => {
    if (!prompt.trim() || isLoading) return;

    const userMessage = { role: 'user', content: prompt, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiMessage = { role: 'assistant', content: '', timestamp: new Date() };
    setMessages(prev => [...prev, aiMessage]);

    try {
      await streamCompletion({
        prompt,
        onChunk: (chunk) => {
          setMessages(prev => {
            const updated = [...prev];
            const lastMsg = updated[updated.length - 1];
            lastMsg.content += chunk;
            return updated;
          });
        },
        onDone: () => {
          setIsLoading(false);
        },
        onError: () => {
          setIsLoading(false);
          setMessages(prev => {
            const updated = [...prev];
            const lastMsg = updated[updated.length - 1];
            lastMsg.content = 'Sorry, AI service unavailable. Try again.';
            return updated;
          });
        }
      });
    } catch {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (type) => {
    const prompt = getQuickPrompt(type, habits, moodLog);
    sendMessage(prompt);
  };

  const handlePaste = (e) => {
    try {
      const hasImage = Array.from(e.clipboardData?.items || []).some(item => item.type.startsWith('image/'));
      if (hasImage) {
        e.preventDefault();
        alert('Images are not supported. This AI model only accepts text.');
      }
    } catch {
      // Ignore clipboard errors
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const hasImage = Array.from(e.dataTransfer?.items || []).some(item => item.type.startsWith('image/'));
    if (hasImage) {
      alert('Images are not supported. This AI model only accepts text.');
      return;
    }
    const hasFiles = Array.from(e.dataTransfer?.files || []).length > 0;
    if (hasFiles) {
      alert('File attachments are not supported. This AI model only accepts text.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {quickActions.map((action, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleQuickAction(action.type)}
            disabled={isLoading}
            style={{
              padding: '8px 12px',
              borderRadius: '20px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              color: 'var(--text)',
              fontSize: '13px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {action.label}
          </motion.button>
        ))}
      </div>

      {/* Messages */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          flex: 1,
          overflowY: 'auto',
          maxHeight: '450px',
          padding: '16px',
          backgroundColor: 'var(--bg)',
          borderRadius: '12px',
          marginBottom: '16px',
        }}
      >
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '12px',
                flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '80%',
                  padding: '12px 16px',
                  borderRadius: '12px 12px 0 12px',
                  backgroundColor: msg.role === 'user' ? '#534AB7' : 'var(--surface)',
                  color: msg.role === 'user' ? '#ffffff' : 'var(--text)',
                  border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
                }}
              >
                {msg.role === 'assistant' && (
                  <span style={{ marginRight: '6px' }}>🤖</span>
                )}
                <span>{msg.content}</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {formatTime(msg.timestamp)}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}
          >
            <div style={{ padding: '12px 16px', borderRadius: '12px 12px 12px 0', backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
              <span style={{ display: 'flex', gap: '4px' }}>
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3], translateY: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                    style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--text-secondary)' }}
                  />
                ))}
              </span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPaste={handlePaste}
          placeholder="Ask your AI coach anything..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '24px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            color: 'var(--text)',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isLoading || !input.trim()}
          style={{
            padding: '12px 20px',
            borderRadius: '24px',
            backgroundColor: isLoading || !input.trim() ? 'var(--border)' : '#534AB7',
            color: '#ffffff',
            border: 'none',
            cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
            fontSize: '14px',
          }}
        >
          Send
        </motion.button>
      </form>
    </div>
  );
};

export default AICoachChat;