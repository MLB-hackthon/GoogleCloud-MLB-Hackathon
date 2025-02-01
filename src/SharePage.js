import React, { useState } from "react";
import "./SharePage.css";
import Chatbot from "./Chatbot";
import ScrollingMasonry from "./components/ScrollingMasonry";
import DataCharts from './components/DataCharts';
import HomeRuns from './components/HomeRuns';
import youtubeData from './data/youtube_search_results.json';
import { motion, AnimatePresence } from 'framer-motion';

function SharePage() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('masonry');

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  const description = "If there's been a theme of this baseball offseason ... well, OK, it's the Dodgers signing every member of your extended family. But if there's another theme, it's that starting pitchers have been doing quite well in free agency. In a sport desperate for pitching, the starting pitching market got moving fast, and ended up with a number of veteran arms being well-compensated, usually somewhat more than projections would have expected.Except, that is, for Jack Flaherty, who is the only unsigned member of MLB.com's pre-Hot Stove Top 10 Free Agent Starters list.According to FanGraphs, only three starters remain who are projected for even 2 WAR, which is to say average. Since Flaherty is 29 and unencumbered by a Qualifying Offer, as opposed to Nick Pivetta (32, with an Offer) and Max Scherzer (a living legend, but also turning 41 this summer), it's not a hard case to make that Flaherty is the best free agent starter still available.You could argue, too, that his hometown Dodgers don't get to and win the World Series without him, given how paper-thin their rotation was last fall.And yet: he remains on the market, with little buzz. What's going on - and what might teams hope to get?";
  
  // 从 embed_code 中提取视频 URL
  const embedCode = youtubeData.items[0]?.embed_code || "";
  const videoUrl = embedCode.match(/src="([^"]+)"/)?.[1] || "";

  const tabs = [
    { id: 'masonry', label: 'News' },
    { id: 'charts', label: 'Charts' },
    { id: 'homeruns', label: 'Home Runs' }
  ];

  const renderRightContent = () => {
    switch (activeTab) {
      case 'masonry':
        return <ScrollingMasonry />;
      case 'charts':
        return <DataCharts />;
      case 'homeruns':
        return <HomeRuns />;
      default:
        return <ScrollingMasonry />;
    }
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
          <div className="description-container">
            <p className="description">
              {description}
            </p>
          </div>
          
          <div className="video-container">
            <iframe
              src={videoUrl}
              title="Pitcher Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
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
            src="./test/image.png"
            alt="MLB Player"
            className="pitcher-image"
          />
        </div>

        <div className="right-section">
          <div className="tabs-container">
            <div className="tabs">
              {tabs.map(tab => (
                <motion.button
                  key={tab.id}
                  className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tab.label}
                </motion.button>
              ))}
            </div>
            <motion.div 
              className="tab-indicator"
              initial={false}
              animate={{
                x: activeTab === 'masonry' ? '0%' : 
                   activeTab === 'charts' ? '100%' : '200%'
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="tab-content"
            >
              {renderRightContent()}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} />}
    </div>
  );
}

export default SharePage;