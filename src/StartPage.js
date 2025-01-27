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
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
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
      className="text-4xl font-bold"
    >
      IT IS ALL ABOUT BASEBALL
    </motion.div>
  );
};

const MainPage = () => {
  return (
    <div className="relative flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
        className="text-6xl font-bold mb-4"
      >
        THE PITCH
      </motion.div>
      <BaseballAnimation />
    </div>
  );
};

const BaseballAnimation = () => {
  const textStyles = [
    { text: 'CURVEBALLS', color: '#ffffff', fontSize: '1.5rem', radius: 120, animationDuration: '10s' },
    { text: 'STRAIGHT FACTS', color: '#cccccc', fontSize: '1.25rem', radius: 90, animationDuration: '7s' },
    { text: 'NO CURVES', color: '#999999', fontSize: '1rem', radius: 60, animationDuration: '5s' },
  ];

  return (
    <div className="relative w-[300px] h-[300px] flex items-center justify-center">
      <div className="relative z-10">
        <div className="w-[100px] h-[100px] bg-white rounded-full" />
      </div>
      {textStyles.map((style, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            width: `${style.radius * 2}px`,
            height: `${style.radius * 2}px`,
            borderRadius: '50%',
            animation: `spin-${index} ${style.animationDuration} linear infinite`,
            zIndex: 5 - index, 
          }}
        >
          <svg
            viewBox="0 0 200 200"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}
          >
            <path
              id={`circlePath-${index}`}
              d={`M 100, 100 m -${style.radius}, 0 a ${style.radius},${style.radius} 0 1,1 ${style.radius * 2},0 a ${style.radius},${style.radius} 0 1,1 -${style.radius * 2},0`}
              fill="none"
            />
            <text fill={style.color} fontSize={style.fontSize} textAnchor="middle">
              <textPath href={`#circlePath-${index}`} startOffset="50%">
                {style.text.repeat(10)}
              </textPath>
            </text>
          </svg>
        </div>
      ))}

      <style jsx global>{`
        @keyframes spin-0 {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spin-1 {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spin-2 {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default StartPage;
