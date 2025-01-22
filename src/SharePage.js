// Import necessary React and CSS modules
import React from "react";
import "./SharePage.css";

function SharePage() {
  return (
    <div className="mlb-showcase">
      {/* Left top corner text */}
        <div className ="top-left-logo">
            <img 
                src="/test/logo.png"
                alt="Team logo"
                className="team-logo-image"
            />
        </div>
        
        <div className="top-left-text">
            <h2>MLB Star of the Week</h2>
            <p>Highlighting the best moments in MLB</p>
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
      <div className="bottom-left-video">
        <video controls>
          <source src="/path-to-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Right top corner image */}
      <div className="top-right-image">
        <img
          src="/path-to-additional-image.png" // Replace with the URL of the additional image
          alt="Additional Content"
        />
      </div>

      {/* Right bottom corner audio and chatbot */}
      <div className="bottom-right-audio-chatbot">
        <audio controls>
          <source src="/path-to-audio.mp3" type="audio/mpeg" />
          Your browser does not support the audio tag.
        </audio>
        <div className="chatbot">
          <p>Chat with our MLB Bot!</p>
          <textarea placeholder="Type your message here..." />
          <button>Send</button>
        </div>
      </div>
    </div>
  );
}

export default SharePage;