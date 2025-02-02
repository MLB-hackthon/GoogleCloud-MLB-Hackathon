import React, { useState, useEffect, useRef } from "react";
import masonryData from '../data/masonry-data.json';
import Masonry from 'react-masonry-css';
import NewsCard from './NewsCard';
import './ScrollingMasonry.css';

// 创建一个函数来检查脚本是否已加载
const isGettyScriptLoaded = () => {
  return document.querySelector('script[src*="embed-cdn.gettyimages.com/widgets.js"]') !== null;
};

const data = masonryData;

// 测试数据
const MOCK_NEWS = {
  "news": [
    {
      "url": "https://www.mlb.com/news/ranking-the-best-position-groups-for-2025",
      "domain": "wwwmlb.com",
      "title": "Ranking the most stacked positions of 2025",
      "snippet": "He is the 22nd player to have his number retired by New York, by far the most among major league teams.",
      "image_url": "https://img.mlbstatic.com/mlb-images/image/upload/t_16x9/t_w2208/mlb/alooqfx5lkof5mmwi9ah"
    },
    {
      "url": "https://www.espn.com/mlb/story/_/id/38679320/shohei-ohtani-dodgers-historic-deal",
      "domain": "www.espn.com",
      "title": "Shohei Ohtani agrees to record $700 million deal with Dodgers",
      "snippet": "Two-way superstar Shohei Ohtani has agreed to a record-breaking 10-year, $700 million contract with the Los Angeles Dodgers.",
      "image_url": "https://a.espncdn.com/photo/2023/1209/r1263329_1296x729_16-9.jpg"
    }
  ]
};

export default function ScrollingMasonry() {
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredDomain, setHoveredDomain] = useState(null);
  const containerRef = useRef(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [imageAspectRatios, setImageAspectRatios] = useState({});
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [useTestData, setUseTestData] = useState(true); // 添加测试数据开关

  const breakpointColumnsObj = {
    default: 2,  // 默认两列
    1100: 2,    // 屏幕宽度 <= 1100px 时保持两列
    700: 1      // 屏幕宽度 <= 700px 时变成一列
  };

  useEffect(() => {
    // 只在脚本未加载时加载脚本
    if (!isGettyScriptLoaded()) {
      const script = document.createElement('script');
      script.src = 'https://embed-cdn.gettyimages.com/widgets.js';
      script.async = true;
      script.onload = () => {
        setIsScriptLoaded(true);
        // 初始化 Getty Images widget
        if (window.gie && window.gie.widgets) {
          window.gie(function(){
            window.gie.widgets.load({
              id: 'M69qFxwlQiBnf5gCeRWivg',
              sig: 'FRBNKSFwo87XtFeBLiOBTZ85QVCGZ6U5aVouo8hprbQ=',
              w: '100%',
              h: '100%',
              items: '1474925731',
              caption: false,
              tld: 'com',
              is360: false
            });
          });
        }
      };
      script.onerror = (error) => {
        console.error('Getty Images script failed to load:', error);
      };
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    let scrollInterval;

    if (!isPaused) {
      scrollInterval = setInterval(() => {
        if (container) {
          container.scrollTop += 1;
          if (container.scrollTop >= container.scrollHeight - container.clientHeight) {
            container.scrollTop = 0;
          }
        }
      }, 30);
    }

    return () => clearInterval(scrollInterval);
  }, [isPaused]);

  // 创建两倍的数据以确保滚动循环
  const duplicatedData = [...data, ...data];
  
  // 分成左右两列
  const leftColumn = duplicatedData.filter((_, index) => index % 2 === 0);
  const rightColumn = duplicatedData.filter((_, index) => index % 2 === 1);

  // 检查图片方向
  const checkImageOrientation = (imageUrl, index) => {
    const img = new Image();
    img.onload = () => {
      setImageAspectRatios(prev => ({
        ...prev,
        [index]: img.width > 1.5 *img.height
      }));
    };
    img.src = imageUrl;
  };

  // 初始化时检查所有图片
  useEffect(() => {
    leftColumn.forEach((item, index) => {
      checkImageOrientation(item.image_url, index);
    });
    rightColumn.forEach((item, index) => {
      checkImageOrientation(item.image_url, index);
    });
  }, []);

  const handleNewsClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        if (useTestData) {
          // 使用测试数据
          setTimeout(() => {
            setNews(MOCK_NEWS.news);
            setLoading(false);
          }, 1000); // 模拟加载时间
          return;
        }

        const response = await fetch('http://34.56.194.81:8000/api/v1/content/news/RokiSasaki?limit=10', {
          method: 'GET',
          headers: {
            'accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error Response:', errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data || !data.news) {
          throw new Error('Invalid data format');
        }

        // 随机打乱新闻顺序
        const shuffledNews = [...data.news].sort(() => Math.random() - 0.5);
        setNews(shuffledNews);
      } catch (err) {
        console.error('Fetch Error:', err);
        setError(err.message);
        // 如果API失败，使用测试数据
        setNews(MOCK_NEWS.news);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [useTestData]);

  const handleRetry = () => {
    setLoading(true);
    setRetryCount(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4" />
        {retryCount > 0 && (
          <div className="text-sm text-gray-500">
            Retrying... Attempt {retryCount}/3
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <div className="text-red-500 mb-4">Error: {error}</div>
        {retryCount < 3 && (
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry Now
          </button>
        )}
        <div className="text-sm text-gray-500 mt-2">
          {retryCount >= 3 ? 
            "Maximum retry attempts reached. Please try again later." : 
            "Having trouble connecting to the server."
          }
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="overflow-hidden h-full w-full relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setHoveredDomain(null);
      }}
    >
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-full gap-4 p-4"
        columnClassName="flex flex-col gap-4 [&:nth-child(2)]:mt-4"
      >
        {leftColumn.map((item, index) => {
          const isWide = imageAspectRatios[index];
          return (
            <div
              key={`left-${item.id}-${index}`}
              className="newImageCard"
              style={{ aspectRatio: isWide ? '4/3' : '3/4' }}
              onClick={() => handleNewsClick(item.url)}
              onMouseEnter={() => setHoveredDomain(item.domain)}
              onMouseLeave={() => setHoveredDomain(null)}
            >
              <div 
                className="newImageCard-image"
                style={{ height: isWide ? '75%' : '85%' }}
              >
                {item.isGetty ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: item.gettyHtml }}
                    style={{ height: '100%', width: '100%' }}
                  />
                ) : (
                  <img
                    src={item.image_url}
                    alt={item.title}
                  />
                )}
                {hoveredDomain === item.domain && (
                  <div className="newImageCard-domain">
                    {item.domain}
                  </div>
                )}
              </div>
              <div 
                className="newImageCard-title"
                style={{ height: isWide ? '25%' : '15%' }}
              >
                <p>{item.title}</p>
              </div>
            </div>
          );
        })}
        {rightColumn.map((item, index) => {
          const isWide = imageAspectRatios[index];
          return (
            <div
              key={`right-${item.id}-${index}`}
              className="w-full bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer transform transition-transform hover:scale-[1.02]"
              style={{ 
                aspectRatio: isWide ? '4/3' : '3/4'
              }}
              onClick={() => handleNewsClick(item.url)}
              onMouseEnter={() => setHoveredDomain(item.domain)}
              onMouseLeave={() => setHoveredDomain(null)}
            >
              <div 
                className="flex-grow w-full relative rounded-lg overflow-hidden"
                style={{ 
                  height: isWide ? '75%' : '85%' 
                }}
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {hoveredDomain === item.domain && (
                  <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {item.domain}
                  </div>
                )}
              </div>
              <div 
                className="w-full bg-gray-800 flex items-center p-2"
                style={{ 
                  height: isWide ? '25%' : '15%' 
                }}
              >
                <p className="text-left font-medium text-white text-sm leading-tight line-clamp-2">
                  {item.title}
                </p>
              </div>
            </div>
          );
        })}
      </Masonry> 
      {/* <div className="p-4 overflow-y-auto h-full">
        <div className="grid grid-cols-1 gap-4 auto-rows-max">
          {news && news.length > 0 ? (
            news.map((item, index) => (
              <NewsCard key={index} news={item} />
            ))
          ) : (
            <div className="flex justify-center items-center h-64 w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
          )}
        </div>
      </div> */}
    </div>
  );
}
