import React, { useState } from "react";
import "./SharePage.css";
import Chatbot from "./Chatbot";
import ScrollingMasonry from "./ScrollingMasonry";
import UserInfo from "./components/UserInfo";

function SharePage() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <div className="background">
      <div className="team-logo-wrapper">
        <img 
          src="/test/logo.png"
          alt="Team logo"
          className="team-logo"
        />  
      </div>

      <div className="content">
        <div className="left-section">
          <h1>ROKI SASAKI</h1>
          <p>
            There were six balls hit 120 mph or harder during the 2024 season.
            Cruz had four of them, and those were the four hardest-hit balls of
            the year. The very hardest was a dramatic clutch hit -- a game-tying
            double with two outs in the ninth inning off a 100.3 mph cutter from
            Giants closer Camilo Doval. Cruz's 121.5 mph double was the
            fifth-hardest batted ball in the Statcast era (since 2015), and by
            far the hardest-hit ball off a 100-plus mph pitch. The previous
            hardest was a 115.4 mph single by Giancarlo Stanton off Shintaro
            Fujinami in 2023.
          </p>

          <div className="chat-button" onClick={toggleChatbot}>
            <img 
                src="/test/chat.png"
                alt="Chat Icon"
                className="chat-icon"
            />  
            <span>Chat with Us</span>
          </div>
        
        </div>

        <div className="center-section">
          <UserInfo />
        </div>

        <div className="right-section">
          <ScrollingMasonry />
        </div>

      </div>

      {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} />}
    </div>
  );
}

export default SharePage;