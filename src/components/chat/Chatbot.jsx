import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../../services/chatService';

// Importamos nuestra nueva hoja de estilos
import '../../styles/Chatbot.css'; 

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isLoading, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    const updatedHistory = [
      ...history,
      { role: 'user', parts: [{ text: userMessage }] }
    ];
    setHistory(updatedHistory);

    try {
      const replyText = await sendChatMessage(userMessage, history);
      setHistory([
        ...updatedHistory,
        { role: 'model', parts: [{ text: replyText }] }
      ]);
    } catch (error) {
      setHistory([
        ...updatedHistory,
        { role: 'model', parts: [{ text: 'Lo siento, tuve un problema al conectarme. ¿Podrías intentar de nuevo?' }] }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      
      {/* BOTÓN FLOTANTE */}
      <button className="chatbot-toggle-btn" onClick={toggleChat}>
        {isOpen ? (
          // Icono Cerrar (X)
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          // Icono Chat
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>

      {/* VENTANA DEL CHAT */}
      {isOpen && (
        <div className="chatbot-window">
          
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-icon">
              {/* Icono de Viajes/Brújula minimalista */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
              </svg>
            </div>
            <span>Asistente ViajesFácil</span>
          </div>

          {/* Cuerpo de Mensajes */}
          <div className="chatbot-body">
            {history.length === 0 && (
              <div className="chatbot-empty-state">
                ¡Hola! Soy tu asesor virtual. ¿A dónde te gustaría viajar hoy?
              </div>
            )}
            
            {history.map((msg, index) => (
              <div 
                key={index} 
                className={`chat-bubble ${msg.role === 'user' ? 'user' : 'model'}`}
              >
                {msg.parts[0].text}
              </div>
            ))}

            {/* Indicador de Carga */}
            {isLoading && (
              <div className="chat-typing">
                Escribiendo...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Formulario de Entrada */}
          <form onSubmit={handleSubmit} className="chatbot-input-area">
            <input 
              type="text" 
              className="chatbot-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="chatbot-send-btn"
              disabled={isLoading || !message.trim()}
            >
              {/* Icono Enviar */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
          
        </div>
      )}
    </div>
  );
}