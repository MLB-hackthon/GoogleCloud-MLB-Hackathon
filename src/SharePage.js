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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4" style={{ height: '30vh' }}>
              {/* 左边卡片 */}
              <div className="bottom-section bg-[#1E2A47] rounded-lg shadow-lg overflow-hidden">
                <div className="chart1 h-full flex flex-col items-center justify-center">
                  <div 
                    className="text-5xl md:text-6xl lg:text-8xl font-bold"
                    style={{
                      color: '#FFD700',
                      textShadow: `
                        2px 2px 8px rgba(255, 215, 0, 0.3),
                        -2px -2px 8px rgba(255, 215, 0, 0.3),
                        2px -2px 8px rgba(255, 215, 0, 0.3),
                        -2px 2px 8px rgba(255, 215, 0, 0.3)
                      `
                    }}
                  >
                    315
                  </div>
                  <div 
                    className="text-xs md:text-sm mt-2"
                    style={{
                      color: 'rgba(255, 215, 0, 0.8)',
                      fontWeight: '500'
                    }}
                  >
                    Career Home Runs
                  </div>
                </div>
              </div>

              {/* 中间卡片 */}
              <div className="bottom-section bg-[#1E2A47] rounded-lg shadow-lg overflow-hidden">
                <div className="chart2 h-full p-4 flex flex-col justify-center">
                  <div className="space-y-4 md:space-y-6">
                    {/* Batting Run Value */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-300">Batting Run Value</span>
                        <span className="text-sm font-semibold text-gray-200">100</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ 
                            duration: 1.5,
                            ease: "easeOut"
                          }}
                          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Baserunning Run Value */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-300">Baserunning Run Value</span>
                        <span className="text-sm font-semibold text-gray-200">54</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '54%' }}
                          transition={{ 
                            duration: 1.5,
                            ease: "easeOut",
                            delay: 0.2
                          }}
                          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Fielding Run Value */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-300">Fielding Run Value</span>
                        <span className="text-sm font-semibold text-gray-200">27</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '27%' }}
                          transition={{ 
                            duration: 1.5,
                            ease: "easeOut",
                            delay: 0.4
                          }}
                          className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 右边卡片 */}
              <div className="bottom-section bg-[#1E2A47] rounded-lg shadow-lg overflow-hidden">
                <div className="chart3 h-full p-4 flex flex-col justify-center">
                  <div className="space-y-2 md:space-y-4">
                    {/* 名字 */}
                    <div 
                      className="text-xl md:text-2xl font-bold"
                      style={{
                        color: '#FFD700',
                        textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                      }}
                    >
                      Aaron Judge
                    </div>
                    
                    {/* 主要信息 */}
                    <div className="flex flex-wrap gap-1 md:gap-2 text-xs md:text-sm text-gray-300">
                      <span className="font-semibold">CF</span>
                      <span className="text-gray-500">|</span>
                      <span>Bats/Throws: R/R</span>
                    </div>
                    
                    {/* 选秀信息 */}
                    <div className="text-xs md:text-sm text-gray-300 leading-relaxed">

                    <div className="flex items-center gap-1 md:gap-2">
                        <span className="text-blue-400 font-semibold">Height | Weight</span>
                        <span>6' 7" | 282LBS</span>
                      </div>

                    <div className="flex items-center gap-1 md:gap-2">
                        <span className="text-blue-400 font-semibold">Age</span>
                        <span>32</span>
                      </div>

                      <div className="flex items-center gap-1 md:gap-2">
                        <span className="text-blue-400 font-semibold">Draft:</span>
                        <span>2013</span>
                      </div>
                      <div className="flex items-center gap-1 md:gap-2">
                        <span className="text-blue-400 font-semibold">Selected:</span>
                        <span>Rd: 1, #32, New York Yankees</span>
                      </div>
                      <div className="flex items-center gap-1 md:gap-2">
                        <span className="text-blue-400 font-semibold">College:</span>
                        <span>Fresno State</span>
                      </div>
                    </div>
                  </div>
                </div>
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