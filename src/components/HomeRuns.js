import React, { useState, useEffect } from 'react';
import HighlightCard from './HighlightCard';

// 测试数据
const MOCK_VIDEOS = {
  "videos": [
    {
      "url": "https://mlb-cuts-diamond.mlb.com/FORGE/2023/2023-09/24/d419235c-358b9f9d-2f5f4b1a-prod.mp4",
      "title": "Judge's 37th homer of the season",
      "description": "Aaron Judge crushes a solo home run to left field, his 37th of the season, giving the Yankees a 2-0 lead in the top of the 1st inning",
      "thumbnail": "/highlight_thumbnail.png",
      "stats": {
        "exit_velocity": "108.9 mph",
        "distance": "403 ft",
        "launch_angle": "28 deg"
      }
    }
  ]
};

const HomeRuns = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useTestData, setUseTestData] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        if (useTestData) {
          setTimeout(() => {
            setVideos(MOCK_VIDEOS.videos);
            setLoading(false);
          }, 1000);
          return;
        }

        const response = await fetch('/api/v1/content/videos/aaron_judge/homeruns', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data || !data.videos) {
          throw new Error('Invalid data format');
        }
        setVideos(data.videos);
      } catch (err) {
        console.error('Fetch Error:', err);
        setError(err.message);
        // 如果API失败，使用测试数据
        setVideos(MOCK_VIDEOS.videos);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [useTestData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-4 overflow-y-auto h-full">
      <div className="grid gap-6">
        {videos.map((video, index) => (
          <HighlightCard
            key={index}
            title={video.title}
            description={video.description}
            thumbnail={video.thumbnail}
            stats={video.stats}
            url={video.url}
          />
        ))}
        {videos.length === 0 && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeRuns; 