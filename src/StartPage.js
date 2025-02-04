import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUser } from "./context/UserContext";

const StartPage = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState('Aaron Judge');
  const [pushFrequency, setPushFrequency] = useState('daily');
  const navigate = useNavigate();
  const CLIENT_ID = "218661372917-r65cdbmtlha18e38dgkmq6baq1au3ahh.apps.googleusercontent.com";

  // 定义选项数据
  const players = [
    { value: 'Aaron Judge', label: 'Aaron Judge' },
    { value: 'Juan Soto', label: 'Juan Soto' }
  ];

  const frequencies = [
    { value: 'realtime', label: 'Real-time' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showIntro) {
      const loadGoogleScript = () => {
        if (window.google) {
          initializeGoogleSignIn();
        } else {
          const script = document.createElement('script');
          script.src = 'https://accounts.google.com/gsi/client';
          script.async = true;
          script.defer = true;
          script.onload = initializeGoogleSignIn;
          document.body.appendChild(script);
        }
      };

      const initializeGoogleSignIn = () => {
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: handleGoogleLogin,
          auto_select: false,
          cancel_on_tap_outside: true
        });

        const buttonContainer = document.getElementById('google-login-button');
        if (buttonContainer) {
          window.google.accounts.id.renderButton(
            buttonContainer,
            { 
              theme: 'outline', 
              size: 'large',
              width: 250,
              text: 'continue_with',
              shape: 'rectangular',
              type: 'standard'
            }
          );
        }
      };

      loadGoogleScript();
    }
  }, [showIntro]);

  const handleGoogleLogin = async (response) => {
    try {
      if (!response.credential) {
        console.error('No credential received');
        return;
      }

      const decoded = JSON.parse(atob(response.credential.split('.')[1]));
      const userInfo = {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        token: response.credential
      };

      navigate('/share');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-black flex items-center justify-center">
      {showIntro ? (
        <Intro />
      ) : (
        <div className="relative flex flex-col w-full h-screen">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 2,
              opacity: { delay: 0.5 },
            }}
            className="text-[15rem] font-bold text-black absolute z-20 whitespace-nowrap"
            style={{ 
              left: '5%',
              top: '5%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            THE PITCH
          </motion.div>

          <div className="flex w-full h-full relative mt-48">
            {/* Left Side - Login Box */}
            <div className="w-1/3 flex items-start justify-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 2, delay: 1 }}
                className="flex items-start justify-center pt-48 pl-20"
              >
                <div className="login-box bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl text-center 
                              border border-gray-100 w-[500px] relative overflow-hidden">
                  {/* 装饰性背景元素 */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-red-500"></div>
                  
                  {/* MLB Logo或图标 */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.5 }}
                    className="mb-6"
                  >
                  </motion.div>

                  {/* 标题和副标题 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.7 }}
                    className="w-full text-center"
                  >
                    <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-red-500 
                                   text-transparent bg-clip-text mx-auto">
                      Welcome to MLB Highlights
                    </h1>
                    <p className="text-gray-500 mb-6 text-base mx-auto">
                      Your gateway to baseball's greatest moments
                    </p>
                  </motion.div>

                  {/* Google登录按钮容器 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.9 }}
                    className="relative z-10"
                  >
                    {/* Settings Panel */}
                    <div className="mb-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="text-sm font-semibold text-gray-700 block mb-1">Select Player</label>
                          <select
                            value={selectedPlayer}
                            onChange={(e) => setSelectedPlayer(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          >
                            {players.map((player) => (
                              <option key={player.value} value={player.value}>
                                {player.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex-1">
                          <label className="text-sm font-semibold text-gray-700 block mb-1">Push Frequency</label>
                          <select
                            value={pushFrequency}
                            onChange={(e) => setPushFrequency(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          >
                            {frequencies.map((freq) => (
                              <option key={freq.value} value={freq.value}>
                                {freq.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div 
                      id="google-login-button"
                      className="google-login-button flex justify-center"
                    ></div>
                  </motion.div>

                  {/* 底部装饰 */}
                  <div className="absolute bottom-0 left-0 w-full h-32 opacity-10">
                    <div className="absolute bottom-0 left-0 w-full h-full 
                                  bg-gradient-to-t from-blue-500/20 to-transparent"></div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Side - Baseball Animation */}
            <div className="w-2/3 relative">
              <motion.div 
                initial={{ 
                  x: "0%", 
                  left: "0%",
                  width: "100%" 
                }}
                animate={{ 
                  x: "0%", 
                  left: "20%",
                  width: "100%" 
                }}
                transition={{ 
                  duration: 2.5,
                  ease: "easeInOut" 
                }}
                className="absolute h-full flex items-center justify-center"
              >
                <BaseballAnimation />
              </motion.div>
            </div>
          </div>
        </div>
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
  const navigate = useNavigate();
  const { updateUser } = useUser();
  const CLIENT_ID =
    "218661372917-r65cdbmtlha18e38dgkmq6baq1au3ahh.apps.googleusercontent.com";

  useEffect(() => {
    const loadGoogleScript = () => {
      if (window.google) {
        initializeGoogleSignIn();
      } else {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleSignIn;
        document.body.appendChild(script);
      }
    };

    const initializeGoogleSignIn = () => {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleGoogleLogin,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-login-button"),
        {
          theme: "outline",
          size: "large",
          width: 250,
          text: "continue_with",
          shape: "rectangular",
          type: "standard",
        }
      );
    };

    loadGoogleScript();
  }, []);

  const handleGoogleLogin = async (response) => {
    try {
      if (!response.credential) {
        console.error("No credential received");
        return;
      }

      const decoded = JSON.parse(atob(response.credential.split(".")[1]));
      const userInfo = {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        token: response.credential,
      };

      updateUser(userInfo);
      navigate("/share");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="relative flex flex-col w-full h-screen">
      {/* Top Section - THE PITCH */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 2,
          opacity: { delay: 0.5 },
        }}
        className="text-[15rem] font-bold text-black absolute z-20 whitespace-nowrap"
        style={{ 
          position: 'absolute',
        }}
      >
        THE PITCH
      </motion.div>

      {/* Bottom Section Container */}
      <div className="flex w-full h-full relative mt-48">
        {/* Left Section - Login */}
        <div className="w-1/3 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-lg shadow-lg text-center"
          >
            <h1 className="text-2xl font-bold mb-4">
              Welcome to MLB Highlights
            </h1>
            <p className="text-gray-600 mb-6">Sign in to continue</p>
            <div id="google-login-button"></div>
          </motion.div>
        </div>

        {/* Right Section - Baseball Animation */}
        <div className="w-2/3 flex items-center justify-center">
          <BaseballAnimation />
        </div>
      </div>
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
      const angle =
        Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
      setRotation(angle);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const textStyles = [
    {
      text: "STRAIGHT FACTS, NO CURVEBALLS",
      color: "#CCCCCC",
      fontSize: "5rem",
      radius: 300,
      animationDuration: "25s",
      direction: "normal",
    },
    {
      text: "STRAIGHT FACTS, NO CURVEBALLS",
      color: "#666666",
      fontSize: "4rem",
      radius: 250,
      animationDuration: "25s",
      direction: "reverse",
    },
    {
      text: "STRAIGHT FACTS, NO CURVEBALLS",
      color: "#333333",
      fontSize: "3rem",
      radius: 200,
      animationDuration: "25s",
      direction: "normal",
    },
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
              fontFamily: "Cormorant, sans-serif",
            }}
          >
            <svg
              width={style.radius * 2}
              height={style.radius * 2}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                overflow: "visible",
                fontFamily: "Cormorant, sans-serif",
              }}
            >
              <defs>
                <path
                  id={`circlePath-${index}`}
                  d={`M 0,${style.radius} A ${style.radius},${
                    style.radius
                  } 0 1,1 ${style.radius * 2},${style.radius} A ${
                    style.radius
                  },${style.radius} 0 1,1 0,${style.radius}`}
                />
              </defs>
              <text style={{ fontFamily: "Cormorant, sans-serif" }}>
                <textPath
                  href={`#circlePath-${index}`}
                  startOffset="0%"
                  style={{
                    fill: style.color,
                    fontSize: style.fontSize,
                    fontFamily: "Cormorant, sans-serif",
                    letterSpacing: "0.2em",
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
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          @keyframes spin-1 {
            from {
              transform: rotate(360deg);
            }
            to {
              transform: rotate(0deg);
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
    </div>
  );
};

export default StartPage;
