import React, { useState } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const toggleChatbot = () => setIsOpen(!isOpen);

  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => setDragging(false);

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { user: true, text: input }]);
      setInput("");
      // Add bot response logic here
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { user: false, text: "I'm here to help!" },
        ]);
      }, 1000);
    }
  };

  return (
    <div
      className="chatbot-icon"
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="icon" onClick={toggleChatbot}>
        🤖
      </div>
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">MLB Chatbot</div>
          <div className="chatbot-body">
            {messages.map((msg, index) => (
              <p
                key={index}
                className={msg.user ? "chat-user" : "chat-bot"}
              >
                {msg.text}
              </p>
            ))}
          </div>
          <textarea
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
