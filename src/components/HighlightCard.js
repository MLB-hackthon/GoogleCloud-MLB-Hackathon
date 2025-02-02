import React from "react";

const HighlightCard = ({ title, description, thumbnail, stats, url }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-md hover:shadow-lg transition-shadow">
      {/* Header Section */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img src="/aaron_judge_avatar.png" alt="Aaron Judge" className="w-full h-full object-cover" />
        </div>
        <div>
          <span className="text-sm font-semibold bg-blue-100 text-blue-600 px-2 py-1 rounded">Home Run</span>
          <p className="text-sm mt-1">
            {description}
          </p>
        </div>
      </div>
      
      {/* Video Section */}
      <div className="relative mt-3 rounded-lg overflow-hidden">
        <video
          src={url}
          className="w-full rounded-lg"
          controls
          playsInline
          poster={thumbnail}
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
      </div>
      
      {/* Stats */}
      <div className="flex justify-between mt-3 text-sm font-medium text-gray-700">
        <div>
          <p className="text-gray-500">Exit Velocity</p>
          <p className="text-black">{stats.exit_velocity}</p>
        </div>
        <div>
          <p className="text-gray-500">Distance</p>
          <p className="text-black">{stats.distance}</p>
        </div>
        <div>
          <p className="text-gray-500">Launch Angle</p>
          <p className="text-black">{stats.launch_angle}</p>
        </div>
      </div>
    </div>
  );
};

export default HighlightCard; 