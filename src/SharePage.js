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
    <div className="mlb-showcase">
      {/* Left top corner text */}
        <div className ="logo">
            <img 
                src="/test/logo.png"
                alt="Team logo"
                className="team-logo-image"
            />
        </div>
        
        <div className="top-left-text">
            <h2>MLB Star of the Week</h2>
            <p>Highlighting the best moments in MLB</p>
            {/* <p>
            There were six balls hit 120 mph or harder during the 2024 season. 
            Cruz had four of them, and those were the four hardest-hit balls of the year. 
            The very hardest was a dramatic clutch hit -- a game-tying double with two outs 
            in the ninth inning off a 100.3 mph cutter from Giants closer Camilo Doval. 
            Cruz's 121.5 mph double was the fifth-hardest batted ball in the Statcast era (since 2015), 
            and by far the hardest-hit ball off a 100-plus mph pitch. 
            The previous hardest was a 115.4 mph single by Giancarlo Stanton off Shintaro Fujinami in 2023.
            </p> */}
        </div>

      {/* Main player section */}
      <div className="main-player">
        <h1 className="player-title">Player Name</h1>
        <div className="player-image">
            <img
                src="/test/Image.png"
                alt="MLB Player"
            className="player-image"
            />
        </div>
       </div>


      {/* Left bottom corner video */}
      <div className="highlight-video">
        <video controls>
          <source src="/test/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Right top corner image */}
      <div className="top-right-image">
        <img
          src="/test/additional-image.png" 
          alt="Additional Content"
        />
      </div>

      {/* Right bottom corner audio and chatbot */}
      <div className="audio">
        <audio controls>
          <source src="/path-to-audio.mp3" type="audio/mpeg" />
          Your browser does not support the audio tag.
        </audio>
        </div>
        
     <Chatbot />

      <div className="photo-gallery">
        <div className="arrow left" onClick={handlePrev}>
          &#9664;
        </div>
        <div
          className="gallery-container"
          style={{
            transform: `translateX(-${currentIndex * 33.33}%)`,
            transition: isTransitioning ? "transform 0.3s ease-in-out" : "none",
          }}
        >
         {extendedImages.map((src, index) => (
            <div className="gallery-item" key={index}>
              <img src={src} alt={`Gallery ${index + 1}`} />
            </div>
          ))}
        </div>
        <div className="arrow right" onClick={handleNext}>
          &#9654;
        </div>
      </div>
    </div>
  );
}

export default SharePage;