import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaPaperPlane, FaTimes, FaRobot, FaUser, FaGraduationCap, FaSpinner } from 'react-icons/fa';
import { BsChatDots, BsArrowUp } from 'react-icons/bs';
import { MdSend, MdClose, MdSchool } from 'react-icons/md';

const API_URL = 'https://educstation-backend-production.up.railway.app/api/chatbot/message';

const Chatbot = () => {
  const { colors, isDarkMode } = useTheme();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '¡Hola! Soy el asistente de EducStation. ¿En qué tema educativo puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Enfocar el input cuando se abre el chat
    if (open && inputRef.current && !minimized) {
      inputRef.current.focus();
    }
  }, [messages, open, minimized]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput('');
    setLoading(true);
    setTyping(true);
    
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      
      // Simular efecto de escritura
      setTimeout(() => {
        setTyping(false);
        setMessages((msgs) => [
          ...msgs,
          { sender: 'bot', text: data.response || 'No he podido responderte en este momento.' }
        ]);
      }, 500);
    } catch (err) {
      setTyping(false);
      setMessages((msgs) => [
        ...msgs,
        { sender: 'bot', text: 'Ha ocurrido un error. Intenta de nuevo más tarde.' }
      ]);
    }
    setLoading(false);
  };

  const toggleMinimize = () => {
    setMinimized(!minimized);
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
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
      color: colors.white,
      border: 'none',
      borderRadius: '50%',
      width: 60,
      height: 60,
      fontSize: '1.5rem',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: 'translateZ(0)',
      '&:hover': {
        transform: 'scale(1.05) translateZ(0)',
      }
    },
    toggleIcon: {
      fontSize: '1.5rem',
      transition: 'transform 0.3s ease',
      animation: 'pulse 2s infinite'
    },
    window: {
      width: 360,
      height: minimized ? 60 : 500,
      background: isDarkMode ? colors.background : '#fff',
      borderRadius: 20,
      boxShadow: '0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: 'all 0.3s ease-in-out',
      border: `1px solid ${isDarkMode ? colors.gray300 : colors.gray200}`
    },
    header: {
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
      color: colors.white,
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${colors.primaryLight}`,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    headerTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontWeight: 600,
      fontSize: '1.1rem',
    },
    headerIcon: {
      fontSize: '1.2rem',
    },
    headerControls: {
      display: 'flex',
      gap: '10px',
    },
    controlButton: {
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      borderRadius: '50%',
      width: 28,
      height: 28,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'background 0.2s',
      color: colors.white,
      '&:hover': {
        background: 'rgba(255,255,255,0.3)',
      }
    },
    messages: {
      flex: 1,
      padding: 16,
      overflowY: 'auto',
      background: isDarkMode ? colors.background : '#fff',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      transition: 'all 0.2s ease',
      opacity: minimized ? 0 : 1,
      maxHeight: minimized ? 0 : '100%',
    },
    message: {
      maxWidth: '85%',
      padding: '10px 14px',
      borderRadius: 18,
      fontSize: '0.95rem',
      lineHeight: 1.5,
      wordBreak: 'break-word',
      position: 'relative',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      transition: 'all 0.2s ease',
      animation: 'fadeIn 0.3s ease',
    },
    user: {
      alignSelf: 'flex-end',
      background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent} 100%)`,
      color: colors.primaryDark,
      borderBottomRightRadius: 5,
    },
    bot: {
      alignSelf: 'flex-start',
      background: isDarkMode 
        ? `linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.primary} 100%)` 
        : `linear-gradient(135deg, ${colors.gray100} 0%, ${colors.gray200} 100%)`,
      color: isDarkMode ? colors.white : colors.textPrimary,
      borderBottomLeftRadius: 5,
    },
    messageIcon: {
      position: 'absolute',
      top: -15,
      left: isDarkMode ? -5 : -8,
      background: isDarkMode ? colors.primary : colors.gray100,
      borderRadius: '50%',
      padding: 5,
      fontSize: '0.8rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      color: isDarkMode ? colors.white : colors.primary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 24,
      height: 24,
    },
    userIcon: {
      left: 'auto',
      right: -5,
      background: colors.secondary,
      color: colors.primaryDark,
    },
    typingIndicator: {
      alignSelf: 'flex-start',
      background: isDarkMode ? colors.primaryLight : colors.gray200,
      borderRadius: 18,
      padding: '8px 16px',
      color: isDarkMode ? colors.white : colors.textPrimary,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: '0.9rem',
      animation: 'fadeIn 0.3s ease',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: isDarkMode ? colors.white : colors.primary,
      opacity: 0.7,
    },
    dot1: {
      animation: 'bounce 1.4s infinite ease-in-out',
      animationDelay: '0s',
    },
    dot2: {
      animation: 'bounce 1.4s infinite ease-in-out',
      animationDelay: '0.2s',
    },
    dot3: {
      animation: 'bounce 1.4s infinite ease-in-out',
      animationDelay: '0.4s',
    },
    inputArea: {
      display: 'flex',
      padding: '12px 16px',
      background: isDarkMode ? colors.gray100 : colors.background,
      borderTop: `1px solid ${isDarkMode ? colors.gray300 : colors.gray200}`,
      transition: 'all 0.2s ease',
      opacity: minimized ? 0 : 1,
      maxHeight: minimized ? 0 : 60,
      overflow: 'hidden',
    },
    inputWrapper: {
      flex: 1,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      background: isDarkMode ? colors.gray200 : colors.white,
      borderRadius: 30,
      border: `1px solid ${isDarkMode ? colors.gray300 : colors.gray200}`,
      transition: 'all 0.2s ease',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      '&:focus-within': {
        boxShadow: `0 0 0 2px ${colors.primaryLight}`,
        border: `1px solid ${colors.primary}`,
      }
    },
    input: {
      flex: 1,
      border: 'none',
      borderRadius: 30,
      padding: '10px 14px',
      fontSize: '0.95rem',
      outline: 'none',
      background: 'transparent',
      color: isDarkMode ? colors.white : colors.textPrimary,
    },
    sendBtn: {
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
      color: colors.white,
      border: 'none',
      borderRadius: '50%',
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: loading ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      opacity: loading || !input.trim() ? 0.7 : 1,
      marginLeft: 8,
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      transform: loading || !input.trim() ? 'scale(0.95)' : 'scale(1)',
      '&:hover': {
        transform: loading || !input.trim() ? 'scale(0.95)' : 'scale(1.05)',
      }
    },
    sendIcon: {
      fontSize: '1rem',
    },
    spinner: {
      animation: 'spin 1s linear infinite',
    },
    '@keyframes fadeIn': {
      from: { opacity: 0, transform: 'translateY(10px)' },
      to: { opacity: 1, transform: 'translateY(0)' }
    },
    '@keyframes bounce': {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-5px)' }
    },
    '@keyframes pulse': {
      '0%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.1)' },
      '100%': { transform: 'scale(1)' }
    },
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' }
    }
  };

  // Aplicar estilos CSS para animaciones
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .chatbot-toggle-icon {
        animation: pulse 2s infinite;
      }
      .chatbot-message {
        animation: fadeIn 0.3s ease;
      }
      .chatbot-dot-1 {
        animation: bounce 1.4s infinite ease-in-out;
        animation-delay: 0s;
      }
      .chatbot-dot-2 {
        animation: bounce 1.4s infinite ease-in-out;
        animation-delay: 0.2s;
      }
      .chatbot-dot-3 {
        animation: bounce 1.4s infinite ease-in-out;
        animation-delay: 0.4s;
      }
      .chatbot-spinner {
        animation: spin 1s linear infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={styles.container}>
      {open ? (
        <div style={styles.window}>
          <div style={styles.header}>
            <div style={styles.headerTitle}>
              <MdSchool style={styles.headerIcon} />
              <span>Asistente EducStation</span>
            </div>
            <div style={styles.headerControls}>
              <button 
                onClick={toggleMinimize} 
                style={styles.controlButton}
                title={minimized ? "Expandir" : "Minimizar"}
              >
                <BsArrowUp style={{ transform: minimized ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
              </button>
              <button 
                onClick={() => setOpen(false)} 
                style={styles.controlButton}
                title="Cerrar"
              >
                <MdClose />
              </button>
            </div>
          </div>
          
          {!minimized && (
            <div style={styles.messages}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className="chatbot-message"
                  style={{
                    ...styles.message,
                    ...(msg.sender === 'user' ? styles.user : styles.bot)
                  }}
                >
                  <div 
                    style={{
                      ...styles.messageIcon,
                      ...(msg.sender === 'user' ? styles.userIcon : {})
                    }}
                  >
                    {msg.sender === 'user' ? <FaUser /> : <FaGraduationCap />}
                  </div>
                  {msg.text}
                </div>
              ))}
              
              {typing && (
                <div style={styles.typingIndicator}>
                  <span>Escribiendo</span>
                  <div className="chatbot-dot-1" style={{...styles.dot, ...styles.dot1}}></div>
                  <div className="chatbot-dot-2" style={{...styles.dot, ...styles.dot2}}></div>
                  <div className="chatbot-dot-3" style={{...styles.dot, ...styles.dot3}}></div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
          
          {!minimized && (
            <form style={styles.inputArea} onSubmit={sendMessage}>
              <div style={styles.inputWrapper}>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Escribe tu pregunta sobre educación..."
                  disabled={loading}
                  style={styles.input}
                  ref={inputRef}
                />
              </div>
              <button 
                type="submit" 
                disabled={loading || !input.trim()} 
                style={styles.sendBtn}
                title="Enviar mensaje"
              >
                {loading ? 
                  <FaSpinner className="chatbot-spinner" style={styles.sendIcon} /> : 
                  <MdSend style={styles.sendIcon} />
                }
              </button>
            </form>
          )}
        </div>
      ) : (
        <button 
          style={styles.toggle} 
          onClick={() => setOpen(true)} 
          title="Abrir asistente de educación"
        >
          <BsChatDots className="chatbot-toggle-icon" style={styles.toggleIcon} />
        </button>
      )}
    </div>
  );
};

export default Chatbot; 