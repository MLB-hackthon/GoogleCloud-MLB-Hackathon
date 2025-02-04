import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

function Chatbot({ onClose }) {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", isBot: true }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = inputText;
    
    // Clear input and add user message
    setInputText('');
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    
    // Add initial empty bot message
    setMessages(prev => [...prev, { text: '', isBot: true }]);
    setIsTyping(true);

    try {
      const response = await fetch('http://34.56.194.81:8000/api/v1/chat/send', {
        method: 'POST',
        headers: {
          'user_id': '1',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Convert chunk to text
        const text = new TextDecoder().decode(value);
        
        // Process each line in the chunk
        const lines = text.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const content = line.slice(6); // Remove 'data: ' prefix
            
            try {
              // Check if it's metadata
              const jsonData = JSON.parse(content);
              if (jsonData.type === 'metadata') continue;
            } catch {
              // If not metadata, immediately append to the last message
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                lastMessage.text += content;
                return [...newMessages];
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I encountered an error. Please try again.",
        isBot: true 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3>CHAT WITH US</h3>
        <div className="header-buttons">
          <button 
            className="minimize-button"
            onClick={onClose}
            title="Minimize"
          >
            −
          </button>
          <button 
            className="close-button"
            onClick={onClose}
            title="Close"
          >
            ×
          </button>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.isBot ? 'bot' : 'user'}`}
          >
            {message.text}
          </div>
        ))}
        {isTyping && (
          <div className="message bot">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="input-container">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          className="message-input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
}

export default Chatbot;
