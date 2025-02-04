import React, { useState, useEffect } from "react";
import "./SharePage.css";
import Chatbot from "./Chatbot";
import ScrollingMasonry from "./components/ScrollingMasonry";
import HomeRuns from './components/HomeRuns';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import LanguageSwitcher from './components/LanguageSwitcher';

function SharePage() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('masonry');
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedPlayer = 'Juan Soto', pushFrequency = 'daily' } = location.state || {};
  const [currentPlayer, setCurrentPlayer] = useState(selectedPlayer);

  useEffect(() => {
    // 当 selectedPlayer 变化时更新 currentPlayer
    setCurrentPlayer(selectedPlayer);
  }, [selectedPlayer]);

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
        return <ScrollingMasonry playerName={currentPlayer} />;
      case 'homeruns':
        return <HomeRuns playerName={currentPlayer} />;
      default:
        return <ScrollingMasonry playerName={currentPlayer} />;
    }
  }, [activeTab, currentPlayer]);

  // 更新玩家相关的信息
  const playerInfo = {
    'Aaron Judge': {
      name: 'Aaron Judge',
      image: '/test/AaronJudge.jpg',
      logo: '/test/logo/AaronJudge.png',
      position: 'CF',
      batsThrows: 'R/R',
      height: "6' 7\"",
      weight: '282LBS',
      age: '32',
      draft: '2013',
      team: 'New York Yankees',
      college: 'Fresno State',
      careerHomers: 315,
      battingRunValue: 100,
      baserunningRunValue: 54,
      fieldingRunValue: 27,
    },
    'Juan Soto': {
      name: 'Juan Soto',
      image: '/test/JuanSoto.jpg',
      logo: '/test/logo/JuanSoto.png',
      position: 'RF',
      batsThrows: 'L/L',
      height: "6' 2\"",
      weight: '224LBS',
      age: '26',
      draft: '2015',
      team: 'New York Mets',
      college: 'N/A',
      careerHomers: 201,
      battingRunValue: 79,
      baserunningRunValue: -3,
      fieldingRunValue: -1,
    }
  };

  const currentPlayerInfo = playerInfo[currentPlayer];

  const getThemeClass = (playerName) => {
    const formattedName = playerName.replace(/\s+/g, '-').toLowerCase();
    return `theme-${formattedName}`;
  };

  return (
    <div className={`${getThemeClass(currentPlayer)} share-page-bg`}>
        {/* Chat Button - Fixed to left middle */}
        <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40">
          <div className="chat-button" onClick={toggleChatbot}>
            <img src="/test/chat.png" alt="Chat Icon" className="chat-icon" />
            <span className="chat-text">The Dugout Oracle</span>
          </div>
        </div>

        {/* Header */}
        <header>
          <nav>
            <div className="flex items-center gap-2">
              <img 
                src={currentPlayerInfo.logo}
                alt="Team logo"
                className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleLogoClick}
              />
              <span className={"title"}>Your Personalized MLB Highlights</span>
            </div>
          </nav>
        </header>

      <div className="content">
        <div className="left-section">
          <div className="image-section relative">
            <img 
              src={currentPlayerInfo.image}
              alt={currentPlayerInfo.name}
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
              className="player-name"
            >
              {currentPlayerInfo.name}
            </motion.div>
          </div>
          
          <div className="bottom-sections">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4" style={{ height: '30vh' }}>
              {/* 左边卡片 */}
              <div className={`${getThemeClass(currentPlayer)} bottom-section`}>
                <div className="chart1 h-full flex flex-col items-center justify-center">
                  <div className="career-homers">
                    {currentPlayerInfo.careerHomers}
                  </div>
                  <div className="career-homers-label">
                    Career Home Runs
                  </div>
                </div>
              </div>

              {/* 中间卡片 */}
              <div className={`${getThemeClass(currentPlayer)} bottom-section`}>
                <div className="chart2 h-full p-4 flex flex-col justify-center">
                  <div className="space-y-4 md:space-y-6">
                    {/* Batting Run Value */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className={`text-sm ${getThemeClass(currentPlayer)}-text`}>Batting Run Value</span>
                        <span className={`text-sm font-semibold ${getThemeClass(currentPlayer)}-text`}>{currentPlayerInfo.battingRunValue}</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${currentPlayerInfo.battingRunValue}%` }}
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
                        <span className={`text-sm ${getThemeClass(currentPlayer)}-text`}>Baserunning Run Value</span>
                        <span className={`text-sm font-semibold ${getThemeClass(currentPlayer)}-text`}>{currentPlayerInfo.baserunningRunValue}</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${currentPlayerInfo.baserunningRunValue}%` }}
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
                        <span className={`text-sm ${getThemeClass(currentPlayer)}-text`}>Fielding Run Value</span>
                        <span className={`text-sm font-semibold ${getThemeClass(currentPlayer)}-text`}>{currentPlayerInfo.fieldingRunValue}</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${currentPlayerInfo.fieldingRunValue}%` }}
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
              <div className={`${getThemeClass(currentPlayer)} bottom-section`}>
                <div className="chart3 h-full p-4 flex flex-col justify-center">
                  <div className="space-y-2 md:space-y-3">
                    {/* 名字 */}
                    <div className="player-info-name">
                      {currentPlayerInfo.name}
                    </div>
                    
                    {/* 主要信息 */}
                    <div className="player-main-info">
                      <div className={`flex flex-wrap gap-1 md:gap-2 text-xs md:text-sm ${getThemeClass(currentPlayer)}-text`}>
                        <span className="font-semibold">{currentPlayerInfo.position}</span>
                        <span className="text-gray-500">|</span>
                        <span>Bats/Throws: {currentPlayerInfo.batsThrows}</span>
                      </div>
                    </div>
                    
                    {/* 选秀信息 */}
                    <div className="player-details">
                      <div className="text-xs md:text-sm text-gray-300 leading-relaxed">
                        <div className="flex items-center gap-1 md:gap-2">
                          <span className="text-blue-400 font-semibold">Height | Weight</span>
                          <span className={`info-value ${getThemeClass(currentPlayer)}-text`}>{currentPlayerInfo.height} | {currentPlayerInfo.weight}</span>
                        </div>
                        <div className="flex items-center gap-1 md:gap-2">
                          <span className="text-blue-400 font-semibold">Age</span>
                          <span className={`info-value ${getThemeClass(currentPlayer)}-text`}>{currentPlayerInfo.age}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Draft:</span>
                          <span className={`info-value ${getThemeClass(currentPlayer)}-text`}>{currentPlayerInfo.draft}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Selected:</span>
                          <span className={`info-value ${getThemeClass(currentPlayer)}-text`}>{currentPlayerInfo.team}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">College:</span>
                          <span className={`info-value ${getThemeClass(currentPlayer)}-text`}>{currentPlayerInfo.college}</span>
                        </div>
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