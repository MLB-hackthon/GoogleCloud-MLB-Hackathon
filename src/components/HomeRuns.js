import React, { useState, useEffect } from 'react';
import './HomeRuns.css';

function HomeRuns() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const backupVideos = {
            "videos": [
              {
                "play_id": "380941da-ac6b-4c38-97cd-fd625274b50a",
                "title": "Aaron Judge homers (13) on a fly ball to right field.    Juan Soto scores.",
                "video_url": "https://sporty-clips.mlb.com/MzVENURfWGw0TUFRPT1fQlFsUlhWQUZBbE1BV1FFRUJBQUFVZ1ZlQUZnQ0FBVUFWQUVEQWdZSEJnY0hCUUlI.mp4",
                "exit_velocity": 98.9,
                "launch_angle": 28,
                "hit_distance": 339.1788252,
                "season": "2024",
                "title_en": "Judge's 13th HR, Soto scores",
                "title_ja": "ジャッジ13号ソロ、ソト生還",
                "title_es": "Jonrón 13 de Judge, anota Soto"
              },
              {
                "play_id": "4ff4e46c-01bc-49b6-9a66-9a3cc150910f",
                "title": "Aaron Judge homers (11) on a fly ball to left field.",
                "video_url": "https://sporty-clips.mlb.com/NjQxdllfWGw0TUFRPT1fQWxjSFVBRUFVRkVBQ0ZOUUJRQUFDRlJRQUZoVVZWY0FDd1FHVTFBRUJBTmNBUUlB.mp4",
                "exit_velocity": 113,
                "launch_angle": 30,
                "hit_distance": 466.723728,
                "season": "2024",
                "title_en": "Judge hits 11th home run",
                "title_ja": "ジャッジ11号ホームラン",
                "title_es": "Judge conecta su jonrón 11"
              },
              {
                "play_id": "9fcd7c59-a925-439c-804f-867a137c1c0b",
                "title": "Aaron Judge homers (9) on a fly ball to center field.",
                "video_url": "https://sporty-clips.mlb.com/NU53TjBfWGw0TUFRPT1fRDFjQ0FGTlhVd3NBV1ZzQVV3QUFBZzhGQUZrRlZ3Y0FDbE1DVVFJR0JsQlVVd0lF.mp4",
                "exit_velocity": 115.7,
                "launch_angle": 29,
                "hit_distance": 473.2069755,
                "season": "2024",
                "title_en": "Judge hits 9th home run",
                "title_ja": "ジャッジ9号ホームラン",
                "title_es": "Jonrón número 9 para Judge"
              },
              {
                "play_id": "da43ae69-ea6d-4674-a3ad-bd4ecc8a76fa",
                "title": "Umpire reviewed (home run), call on the field was upheld: Aaron Judge homers (22) on a line drive to left center field.",
                "video_url": "https://sporty-clips.mlb.com/YUs5S0JfV0ZRVkV3dEdEUT09X1VsQlZWd1ZSVUFzQVhRTUVBZ0FBQndGU0FBQUdBZ1VBVUFFQlZWQldDVkpTQmxRSA==.mp4",
                "exit_velocity": 108.1,
                "launch_angle": 19,
                "hit_distance": 386.2093728,
                "season": "2024",
                "title_en": "Judge's 22nd HR upheld on review",
                "title_ja": "ジャッジ22号HR判定覆らず",
                "title_es": "HR 22 de Judge confirmado"
              },
              {
                "play_id": "4065b57a-33c9-494b-9b91-6e8c4e8ccbad",
                "title": "Aaron Judge homers (6) on a line drive to left center field.",
                "video_url": "https://sporty-clips.mlb.com/MzVEYVFfWGw0TUFRPT1fQWdGWFVRWUJVVk1BQzFGUlh3QUFDQUlFQUZoWFdsQUFCQUFOVXdkUUNWQUdVbE1D.mp4",
                "exit_velocity": 115.9,
                "launch_angle": 20,
                "hit_distance": 440.6250147,
                "season": "2024",
                "title_en": "Judge hits 6th home run",
                "title_ja": "ジャッジ6号ホームラン",
                "title_es": "Jonrón número 6 para Judge"
              },
              {
                "play_id": "429adeb8-1408-4352-a7dc-914e917b3007",
                "title": "Gleyber Torres homers (3) on a fly ball to left center field.   Aaron Judge scores.    Anthony Rizzo scores.",
                "video_url": "https://sporty-clips.mlb.com/dzcwN2xfWGw0TUFRPT1fQWdOWUJRQlJCQW9BQ1ZZQ1hnQUFBZ05VQUFBQ0J3SUFDMVFCVlFvRUJsRldBQUpS.mp4",
                "exit_velocity": 103.9,
                "launch_angle": 32,
                "hit_distance": 391.6808859,
                "season": "2024",
                "title_en": "Torres' 3rd HR, Judge & Rizzo score",
                "title_ja": "トーレス3号、ジャッジ＆リゾ生還",
                "title_es": "Torres HR (3), anotan Judge y Rizzo"
              },
              {
                "play_id": "fdf90077-99db-48d2-acae-806a9d851177",
                "title": "Aaron Judge homers (38) on a fly ball to left field.",
                "video_url": "https://sporty-clips.mlb.com/QnZ6YTlfWGw0TUFRPT1fVUZVSFhWUUVVUVVBQVZ0V0JBQUFDVkpVQUFCV0FnUUFDbFVEVVFwUkNRWlVBUVZS.mp4",
                "exit_velocity": 105,
                "launch_angle": 35,
                "hit_distance": 405.8674246,
                "season": "2024",
                "title_en": "Judge hits 38th home run",
                "title_ja": "ジャッジ38号ホームラン",
                "title_es": "Jonrón 38 para Judge"
              },
              {
                "play_id": "b4cd8502-176b-44e3-88c2-49597961a7e7",
                "title": "Aaron Judge homers (40) on a fly ball to left center field.   Juan Soto scores.",
                "video_url": "https://sporty-clips.mlb.com/MkJEQk5fWGw0TUFRPT1fVkFVQ0FGd0JWZ0FBQ1ZVRUJBQUFCVk5WQUZrTkFGTUFCbHdBQ1FRTUJ3SUVCMWRS.mp4",
                "exit_velocity": 117.5,
                "launch_angle": 28,
                "hit_distance": 477.0476031,
                "season": "2024",
                "title_en": "Judge's 40th HR, Soto scores",
                "title_ja": "ジャッジ40号、ソト生還",
                "title_es": "Jonrón 40 de Judge, anota Soto"
              },
              {
                "play_id": "12b46c50-a19b-4bac-b748-c3f15e4733e6",
                "title": "Aaron Judge homers (37) on a fly ball to left center field.",
                "video_url": "https://sporty-clips.mlb.com/QVlNeDJfV0ZRVkV3dEdEUT09X0J3TURVRkpYVXdJQVdWTUxCQUFBVTFjRkFBTUNWMWtBVVZaVEFRWlFCUVJXQTFkUQ==.mp4",
                "exit_velocity": 110.6,
                "launch_angle": 33,
                "hit_distance": 432.1752847,
                "season": "2024",
                "title_en": "Judge hits 37th home run",
                "title_ja": "ジャッジ37号ホームラン",
                "title_es": "Jonrón 37 para Judge"
              },
              {
                "play_id": "022bf205-a102-4af8-ab2e-33b455bff60b",
                "title": "Aaron Judge homers (42) on a fly ball to right center field.",
                "video_url": "https://sporty-clips.mlb.com/TVpSd2RfWGw0TUFRPT1fQmdOVEJnSUdWZ2NBV1ZNQ1ZBQUFVRkJlQUFCWFVRUUFBVlpYQkFZQVUxVURCZ0lF.mp4",
                "exit_velocity": 108.4,
                "launch_angle": 37,
                "hit_distance": 373.6384572,
                "season": "2024",
                "title_en": "Judge hits 42nd home run",
                "title_ja": "ジャッジ42号ホームラン",
                "title_es": "Jonrón 42 para Judge"
              }
            ]
        
    };

    const fetchVideos = async () => {
      try {
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
        if (!data || !data.videos || data.videos.length === 0) {
          throw new Error('Invalid or empty response');
        }
        return data;

      } catch (error) {
        console.log('Error occurred:', error.message);
        setVideos(backupVideos.videos);
        setError('Unable to fetch videos from API, showing backup data');
        return backupVideos;
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
        setVideos(backupVideos.videos);
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
    <div className="h-full overflow-y-auto home-runs-container" style={{ maxHeight: 'calc(100vh - 200px)' }}>
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