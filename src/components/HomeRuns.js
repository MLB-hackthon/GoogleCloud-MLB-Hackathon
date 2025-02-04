import React, { useState, useEffect } from 'react';
import './HomeRuns.css';

function HomeRuns({ playerName }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const backupVideos = {
      "videos": [
        {
          "play_id": "380941da-ac6b-4c38-97cd-fd625274b50a",
          "title": "Aaron Judge homers (13) on a fly ball to right field.",
          "video_url": "https://sporty-clips.mlb.com/MzVENURfWGw0TUFRPT1fQlFsUlhWQUZBbE1BV1FFRUJBQUFVZ1ZlQUZnQ0FBVUFWQUVEQWdZSEJnY0hCUUlI.mp4",
          "exit_velocity": 98.9,
          "launch_angle": 28,
          "hit_distance": 339.1788252,
          "season": "2024",
          "title_en": "Judge's 13th HR, Soto scores",
          "title_ja": "ジャッジ13号ソロ、ソト生還",
          "title_es": "Jonrón 13 de Judge, anota Soto"
        }
      ]
    };

    const fetchVideos = async () => {
      try {
        const response = await fetch(`https://34.56.194.81.nip.io/api/v1/content/videos/${playerName}/homeruns?limit=10&max_chars_title_en=50&max_chars_title_ja=30&max_chars_title_es=45`, {
          method: 'GET',
          headers: {
            'accept': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.videos && data.videos.length > 0) {
          setVideos(data.videos);
          setError(null);
        } else {
          throw new Error('No videos available');
        }

      } catch (error) {
        console.error('Failed to fetch videos:', error);
        setVideos(backupVideos.videos);
        setError('Using backup data');
      } finally {
        setLoading(false);
      }
    };

    // 执行获取
    fetchVideos();

    return () => {
      // 清理函数
      setVideos([]);
      setLoading(true);
      setError(null);
    };
  }, [playerName]); // 依赖于 playerName

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className={`h-full overflow-y-auto home-runs-container theme-${playerName.toLowerCase().replace(' ', '-')}`} style={{ maxHeight: 'calc(100vh - 200px)' }}>
      <div className="p-4">
        <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
          {videos.map((video) => (
            <div key={video.play_id} className="home-run-card">
              <div className="home-run-header">
                <h3 className="home-run-title">{video.title}</h3>
              </div>
              
              <div className="relative">
                <video
                  className="home-run-video"
                  controls
                  playsInline
                  preload="metadata"
                >
                  <source src={video.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              
              <div className="stats-container">
                <div className="grid grid-cols-3 gap-4">
                  <div className="stat-item">
                    <p className="stat-label">Exit Velocity</p>
                    <p className="stat-value">{video.exit_velocity} mph</p>
                  </div>
                  <div className="stat-item">
                    <p className="stat-label">Launch Angle</p>
                    <p className="stat-value">{video.launch_angle}°</p>
                  </div>
                  <div className="stat-item">
                    <p className="stat-label">Distance</p>
                    <p className="stat-value">{Math.round(video.hit_distance)} ft</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomeRuns;