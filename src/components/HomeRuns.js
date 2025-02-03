import React, { useState, useEffect } from 'react';

function HomeRuns() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // 使用与 curl 命令相同的请求格式
        const response = await fetch('http://34.56.194.81:8000/api/v1/content/videos/Aaron%20Judge/homeruns', {
          method: 'GET',
          headers: {
            'accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // 过滤并只保留 Aaron Judge 的本垒打视频
        const uniqueVideos = data.videos.filter((video, index, self) => 
          self.findIndex(v => v.play_id === video.play_id) === index &&
          video.title.toLowerCase().includes('aaron judge homers')
        );
        
        setVideos(uniqueVideos);
        setError(null);
      } catch (err) {
        console.error('API Error:', err);
        setError('Error fetching videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
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
  );
}

export default HomeRuns;