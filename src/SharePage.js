import React, { useState} from "react";
import "./SharePage.css";
import Chatbot from "./Chatbot";
import ScrollingMasonry from "./ScrollingMasonry";

function SharePage() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  const description = "If there’s been a theme of this baseball offseason … well, OK, it’s the Dodgers signing every member of your extended family. But if there’s another theme, it’s that starting pitchers have been doing quite well in free agency. In a sport desperate for pitching, the starting pitching market got moving fast, and ended up with a number of veteran arms being well-compensated, usually somewhat more than projections would have expected.Except, that is, for Jack Flaherty, who is the only unsigned member of MLB.com’s pre-Hot Stove Top 10 Free Agent Starters list.According to FanGraphs, only three starters remain who are projected for even 2 WAR, which is to say average. Since Flaherty is 29 and unencumbered by a Qualifying Offer, as opposed to Nick Pivetta (32, with an Offer) and Max Scherzer (a living legend, but also turning 41 this summer), it’s not a hard case to make that Flaherty is the best free agent starter still available.You could argue, too, that his hometown Dodgers don’t get to and win the World Series without him, given how paper-thin their rotation was last fall.And yet: he remains on the market, with little buzz. What’s going on – and what might teams hope to get?"; 
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
          <div className="description-container">
            <p className="description">
              {description}
            </p>
          </div>

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
        <img
                src="/test/image2.png"
                alt="MLB Player"
            className="pitcher-image"
            />
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