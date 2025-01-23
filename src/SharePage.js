import React, { useState, useEffect } from "react";
import "./SharePage.css";
import Chatbot from "./Chatbot";

function SharePage() {
const galleryImages = [
    "/test/photo1.jpg",
    "/test/photo2.jpg",
    "/test/photo3.jpg",
    "/test/photo4.jpg",
    "/test/photo5.jpg",
  ];

  const extendedImages = [
    galleryImages[galleryImages.length - 1], 
    ...galleryImages,
    galleryImages[0], 
  ];

  const [currentIndex, setCurrentIndex] = useState(1); 
  const [isTransitioning, setIsTransitioning] = useState(false); 

  const handleNext = () => {
    if (!isTransitioning) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrev = () => {
    if (!isTransitioning) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };


  useEffect(() => {
    const interval = setInterval(handleNext, 5000); 
    return () => clearInterval(interval); 
  }, []);

  useEffect(() => {
    if (currentIndex === 0) {
      setTimeout(() => {
        setIsTransitioning(false); 
        setCurrentIndex(galleryImages.length); 
      }, 300); 
    } else if (currentIndex === extendedImages.length - 1) {
      setTimeout(() => {
        setIsTransitioning(false); 
        setCurrentIndex(1); 
      }, 300); 
    } else {
      setIsTransitioning(true); 
    }
  }, [currentIndex, extendedImages.length, galleryImages.length]);


  return (
    <div className="background">
      <div className="content">
        <div className="team-logo-wrapper">
            <img 
                src="/test/logo.png"
                alt="Team logo"
                className="team-logo"
            />  
        </div>

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
        </div>
        <div className="center-section">
        <img
                src="/test/Image.png"
                alt="MLB Player"
            className="pitcher-image"
            />
        </div>

        <div className="right-section">
          <div className="stats">
            <h3>Batting</h3>
            <div className="stat-row">
              <span>xwOBA</span>
              <div className="stat-bar red" style={{ width: "62%" }}></div>
            </div>
            <div className="stat-row">
              <span>xBA</span>
              <div className="stat-bar blue" style={{ width: "27%" }}></div>
            </div>
          </div>
        </div>

        <div className="chat-button">
          <img 
                src="/test/chat.png"
                alt="Chat Icon"
                className="chat-icon"
            />  
          <span>Chat with Us</span>
        </div>
      </div>
    </div>
  );
}

export default SharePage;