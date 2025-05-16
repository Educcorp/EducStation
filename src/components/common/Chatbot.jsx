import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const API_URL = 'https://educstation-backend-production.up.railway.app/api/chatbot/message';

const Chatbot = () => {
  const { colors, isDarkMode } = useTheme();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '¡Hola! Soy el asistente de EducStation. ¿En qué tema educativo puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages((msgs) => [
        ...msgs,
        { sender: 'bot', text: data.response || 'No he podido responderte en este momento.' }
      ]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { sender: 'bot', text: 'Ha ocurrido un error. Intenta de nuevo más tarde.' }
      ]);
    }
    setLoading(false);
  };

  // Estilos en línea para adaptar el diseño al tema
  const styles = {
    container: {
      position: 'fixed',
      bottom: 24,
      right: 24,
      zIndex: 9999,
      fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    toggle: {
      background: colors.primary,
      color: colors.white,
      border: 'none',
      borderRadius: '50%',
      width: 56,
      height: 56,
      fontSize: '2rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      cursor: 'pointer',
      transition: 'background 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    window: {
      width: 340,
      height: 420,
      background: colors.background,
      borderRadius: 16,
      boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      animation: 'fadeIn 0.2s',
      border: `1.5px solid ${colors.primaryLight}`
    },
    header: {
      background: colors.primary,
      color: colors.white,
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontWeight: 600,
      fontSize: '1.1rem',
      letterSpacing: '0.5px',
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      color: colors.white,
      fontSize: '1.3rem',
      cursor: 'pointer',
    },
    messages: {
      flex: 1,
      padding: 16,
      overflowY: 'auto',
      background: colors.white,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    },
    message: {
      maxWidth: '80%',
      padding: '8px 12px',
      borderRadius: 12,
      marginBottom: 2,
      fontSize: '0.98rem',
      lineHeight: 1.4,
      wordBreak: 'break-word',
    },
    user: {
      alignSelf: 'flex-end',
      background: colors.secondary,
      color: colors.primaryDark,
    },
    bot: {
      alignSelf: 'flex-start',
      background: colors.primaryLight,
      color: colors.white,
    },
    inputArea: {
      display: 'flex',
      padding: '12px 10px',
      background: colors.background,
      borderTop: `1px solid ${colors.gray200}`,
    },
    input: {
      flex: 1,
      border: `1px solid ${colors.gray200}`,
      borderRadius: 8,
      padding: 8,
      fontSize: '1rem',
      outline: 'none',
      marginRight: 8,
      background: colors.white,
      color: colors.textPrimary,
    },
    sendBtn: {
      background: colors.primary,
      color: colors.white,
      border: 'none',
      borderRadius: 8,
      padding: '8px 16px',
      fontSize: '1rem',
      cursor: loading ? 'not-allowed' : 'pointer',
      transition: 'background 0.2s',
      opacity: loading ? 0.7 : 1,
    }
  };

  return (
    <div style={styles.container}>
      {open ? (
        <div style={styles.window}>
          <div style={styles.header}>
            <span>Asistente EducStation</span>
            <button style={styles.closeBtn} onClick={() => setOpen(false)}>×</button>
          </div>
          <div style={styles.messages}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.message,
                  ...(msg.sender === 'user' ? styles.user : styles.bot)
                }}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form style={styles.inputArea} onSubmit={sendMessage}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Escribe tu pregunta sobre educación..."
              disabled={loading}
              style={styles.input}
            />
            <button type="submit" disabled={loading || !input.trim()} style={styles.sendBtn}>
              {loading ? '...' : 'Enviar'}
            </button>
          </form>
        </div>
      ) : (
        <button style={styles.toggle} onClick={() => setOpen(true)} title="Abrir asistente de educación">
          <span role="img" aria-label="chat">💬</span>
        </button>
      )}
    </div>
  );
};

export default Chatbot; 