import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const StartPage = () => {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-black flex items-center justify-center">
      {showIntro ? (
        <Intro />
      ) : (
        <MainPage />
      )}
    </div>
  );
};

const Intro = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="text-4xl font-bold text-black"
    >
      IT IS ALL ABOUT BASEBALL
    </motion.div>
  );
};

const MainPage = () => {
  return (
    <div className="relative flex flex-col items-center text-center w-1/2 mx-auto">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 2,
          opacity: { delay: 0.5 }  // 延迟开始淡入
        }}
        className="text-[15rem] font-bold mb-4 text-black absolute z-20 whitespace-nowrap"
      >
        THE PITCH
      </motion.div>
      <BaseballAnimation />
    </div>
  );
};

const BaseballAnimation = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      setMousePosition({ x: clientX, y: clientY });
      
      // 计算旋转角度
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
      setRotation(angle);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const textStyles = [
    { text: 'STRAIGHT FACTS, NO CURVEBALLS', color: '#CCCCCC', fontSize: '5rem', radius: 300, animationDuration: '25s', direction: 'normal' },
    { text: 'STRAIGHT FACTS, NO CURVEBALLS', color: '#666666', fontSize: '4rem', radius: 250, animationDuration: '25s', direction: 'reverse' },
    { text: 'STRAIGHT FACTS, NO CURVEBALLS', color: '#333333', fontSize: '3rem', radius: 200, animationDuration: '25s', direction: 'normal' },
  ];

  return (
    <div className="min-h-screen text-black flex items-center justify-center">
      <div className="relative w-[800px] h-[800px] flex items-center justify-center font-['Cormorant',sans-serif]">
        <div className="relative z-0">
          <motion.img 
            src="/test/baseball.png" 
            alt="Baseball"
            className="w-[200px] h-[200px] object-contain"
            animate={{ rotate: rotation }}
            transition={{ type: "spring", stiffness: 100 }}
          />
        </div>
        {textStyles.map((style, index) => (
          <div
            key={index}
            className="absolute rounded-full"
            style={{
              width: `${style.radius * 2}px`,
              height: `${style.radius * 2}px`,
              animation: `spin-${index} ${style.animationDuration} linear infinite`,
              zIndex: 10 + index,
              fontFamily: 'Cormorant, sans-serif'
            }}
          >
            <svg
              width={style.radius * 2}
              height={style.radius * 2}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                overflow: 'visible',
                fontFamily: 'Cormorant, sans-serif'
              }}
            >
              <defs>
                <path
                  id={`circlePath-${index}`}
                  d={`M 0,${style.radius} A ${style.radius},${style.radius} 0 1,1 ${style.radius * 2},${style.radius} A ${style.radius},${style.radius} 0 1,1 0,${style.radius}`}
                />
              </defs>
              <text style={{ fontFamily: 'Cormorant, sans-serif' }}>
                <textPath
                  href={`#circlePath-${index}`}
                  startOffset="0%"
                  style={{
                    fill: style.color,
                    fontSize: style.fontSize,
                    fontFamily: 'Cormorant, sans-serif',
                    letterSpacing: '0.2em',
                  }}
                >
                  {`${style.text} • ${style.text} • ${style.text}`}
                </textPath>
              </text>
            </svg>
          </div>
        ))}
        <style jsx global>{`
          @keyframes spin-0 {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes spin-1 {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          @keyframes spin-2 {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default StartPage;
