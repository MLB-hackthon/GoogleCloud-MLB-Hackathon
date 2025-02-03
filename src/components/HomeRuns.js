import React, { useState, useEffect } from 'react';

function HomeRuns() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const backupVideo = {
        "play_id": "380941da-ac6b-4c38-97cd-fd625274b50a",
        "title": "Aaron Judge homers (13) on a fly ball to right field.    Juan Soto scores.",
        "video_url": "https://sporty-clips.mlb.com/MzVENURfWGw0TUFRPT1fQlFsUlhWQUZBbE1BV1FFRUJBQUFVZ1ZlQUZnQ0FBVUFWQUVEQWdZSEJnY0hCUUlI.mp4",
        "exit_velocity": 98.9,
        "launch_angle": 28,
        "hit_distance": 339.1788252,
        "season": "2024"
    };

    const fetchVideos = async () => {
      try {
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch('http://34.56.194.81:8000/api/v1/content/videos/Aaron%20Judge/homeruns', {
          method: 'GET',
          headers: {
            'accept': 'application/json'
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // 检查返回的数据是否有效
        if (!data || !data.videos || data.videos.length === 0) {
          throw new Error('Invalid or empty response');
        }
        return data;

      } catch (error) {
        // 捕获所有可能的错误，包括：
        // - 超时
        // - 网络错误
        // - API 错误
        // - 数据格式错误
        console.log('Error occurred:', error.message);
        setVideos([backupVideo]);
        setError('Unable to fetch videos from API, showing backup data');
        return { videos: [backupVideo] };
      }
    };

    const handleData = async (data) => {
      try {
        const uniqueVideos = data.videos.filter((video, index, self) => 
          self.findIndex(v => v.play_id === video.play_id) === index &&
          (video.title.toLowerCase().includes('aaron judge homers') || video.play_id === 'backup-video-001')
        );
        
        if (uniqueVideos.length === 0) {
          throw new Error('No valid videos found');
        }

        setVideos(uniqueVideos);
        setError(null);
      } catch (error) {
        console.log('Error in handling data:', error.message);
        setVideos([backupVideo]);
        setError('Unable to process videos, showing backup data');
      } finally {
        setLoading(false);
      }
    };

    const handleFetch = async () => {
      setLoading(true);
      try {
        const data = await fetchVideos();
        await handleData(data);
      } catch (error) {
        console.log('Error in handleFetch:', error.message);
        setError('Unable to fetch videos from API, showing backup data');
      }
    };

    handleFetch();
  }, []);

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
    <div className="h-full overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
      <div className="p-4">
        <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
          {videos.map((video) => (
            <div key={video.play_id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">{video.title}</h3>
              </div>
              
              <div className="relative">
                <video
                  className="w-full"
                  controls
                  playsInline
                  preload="metadata"
                >
                  <source src={video.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              
              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Exit Velocity</p>
                    <p className="font-semibold text-gray-800">{video.exit_velocity} mph</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Launch Angle</p>
                    <p className="font-semibold text-gray-800">{video.launch_angle}°</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Distance</p>
                    <p className="font-semibold text-gray-800">{Math.round(video.hit_distance)} ft</p>
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