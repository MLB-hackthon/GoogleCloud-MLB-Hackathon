import React, { useState } from "react";
import "./SharePage.css";
import Chatbot from "./Chatbot";
import ScrollingMasonry from "./components/ScrollingMasonry";
import HomeRuns from './components/HomeRuns';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from './components/LanguageSwitcher';

function SharePage() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('masonry');
  const navigate = useNavigate();

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const tabs = [
    { id: 'masonry', label: 'News' },
    { id: 'homeruns', label: 'Home Runs' }
  ];

  // 将 content 移到组件顶层使用 useMemo
  const content = React.useMemo(() => {
    switch (activeTab) {
      case 'masonry':
        return <ScrollingMasonry />;
      case 'homeruns':
        return <HomeRuns />;
      default:
        return <ScrollingMasonry />;
    }
  }, [activeTab]);

  return (
    <div className="background">
      
      {/* Chat Button - Fixed to left middle */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40">
        <div className="chat-button" onClick={toggleChatbot}>
          <img src="/test/chat.png" alt="Chat Icon" className="chat-icon" />
          <span className="chat-text">CHAT WITH US</span>
        </div>
      </div>

      {/* Header */}
      <header>
        <nav>
          <div className="flex items-center gap-2">
            <img 
              src="/test/logo.png"
              alt="Team logo"
              className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleLogoClick}
            />
            <span className="title">Your Personalized MLB Highlights</span>
          </div>
        </nav>
      </header>

      <div className="content">
        
        <div className="left-section">
          <div className="image-section relative">
            <img 
              src="/test/AaronJudge.jpg" 
              alt="Pitcher"
              className="pitcher-image"
            />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1.5, 1],
                opacity: [0, 1, 1]
              }}
              transition={{ 
                duration: 1.5,
                times: [0, 0.6, 1],
                ease: "easeInOut"
              }}
              className="absolute bottom-4 left-4 transform origin-bottom-left
                         text-white text-7xl font-bold z-10
                         whitespace-nowrap pointer-events-none"
              style={{
                textShadow: `
                  2px 2px 8px rgba(0,0,0,0.8),
                  -2px -2px 8px rgba(0,0,0,0.8),
                  2px -2px 8px rgba(0,0,0,0.8),
                  -2px 2px 8px rgba(0,0,0,0.8),
                  0 0 15px rgba(0,0,0,0.7)
                `,
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              Aaron Judge
            </motion.div>
          </div>
          
          <div className="bottom-sections">
            {/* 左边卡片 */}
            <div className="bottom-section">
              <div className="chart1">
                {/* 预留给图表内容 */}
              </div>
            </div>

            {/* 中间卡片 */}
            <div className="bottom-section">
              <div className="chart2">
                {/* 预留给图表内容 */}
              </div>
            </div>

            {/* 右边卡片 */}
            <div className="bottom-section">
              <div className="chart3">
                {/* 预留给图表内容 */}
              </div>
            </div>
          </div>
        </div>
         

        <div className="right-section">
          <div className="tabs-container">
            <div className="tabs">
              {tabs.map(tab => (
                <motion.button
                  key={tab.id}
                  className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {tab.label}
                </motion.button>
              ))}
            </div>
            <motion.div 
              className="tab-indicator"
              initial={false}
              animate={{
                x: activeTab === 'masonry' ? '0%' : '100%'
              }}
              transition={{ 
                type: "spring", 
                stiffness: 400,
                damping: 40,
                mass: 0.8
              }}
            />
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.15,
                ease: "easeOut"
              }}
              className="tab-content"
            >
              {content} {/* 使用缓存的内容 */}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} />}

      {/* 右下角的语言切换器 */}
      <div className="LanguageSwitcher">
        <LanguageSwitcher />
      </div>
    </div>
  );
}

export default SharePage;