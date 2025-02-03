import React, { useState, useEffect, useRef } from "react";
import Masonry from 'react-masonry-css';
import './ScrollingMasonry.css';

// 创建一个函数来检查脚本是否已加载
const isGettyScriptLoaded = () => {
  return document.querySelector('script[src*="embed-cdn.gettyimages.com/widgets.js"]') !== null;
};

const BACKUP_NEWS = {
  "news": [
    {
      "url": "https://www.mlb.com/news/baseball-writers-association-of-america-awards-dinner-2025",
      "domain": "www.mlb.com",
      "title": "Stars come out at BBWAA awards dinner in New York",
      "snippet": "Baseball's biggest stars were out in full force in New York on Saturday night.",
      "image_url": "https://img.mlbstatic.com/mlb-images/image/upload/t_16x9,w_640/mlb/xyfhftl7gfbubfpsum2x"
    },

    {
      "url": "https://www.mlb.com/news/aaron-judge-s-all-rise-foundation-hosts-all-star-gala",
      "domain": "www.mlb.com",
      "title": "Judge's star-studded All-Star Gala",
      "snippet": "This story was excerpted from Bryan Hoch's Yankees Beat newsletter.",
      "image_url": "https://img.mlbstatic.com/mlb-images/image/upload/t_16x9,w_640/v1732501276/mlb/fezafbpgcilp5m6fi5ig"
    },
    
    {
      "url": "https://www.mlb.com/news/aaron-judge-to-move-back-to-right-field-for-yankees",
      "domain": "www.mlb.com",
      "title": "Judge expected to move back to RF",
      "snippet": "DALLAS – Juan Soto's decision to cross borough lines from the Bronx to Queens could prompt another relocation of sorts.",
      "image_url": "https://img.mlbstatic.com/mlb-images/image/upload/t_16x9,w_640/mlb/bismofyowhubohaloqcc"
    }
  ]
};

export default function ScrollingMasonry() {
  const [isPaused, setIsPaused] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [hoveredDomain, setHoveredDomain] = useState(null);
  const containerRef = useRef(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [imageAspectRatios, setImageAspectRatios] = useState({});
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [useTestData, setUseTestData] = useState(true); // 添加测试数据开关
  const userScrollTimeout = useRef(null);

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

    if (!isPaused) {  // 只在鼠标悬停时暂停
      scrollInterval = setInterval(() => {
        if (container) {
          // 如果用户正在滚动，加快自动滚动速度
          const scrollSpeed = isUserScrolling ? 2 : 1;
          container.scrollTop += scrollSpeed;
          
          if (container.scrollTop >= container.scrollHeight - container.clientHeight) {
            container.scrollTop = 0;
          }
        }
      }, 30);
    }

    return () => clearInterval(scrollInterval);
  }, [isPaused, isUserScrolling]);  // 依赖项包含 isUserScrolling 以响应用户滚动状态变化

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch('http://34.56.194.81:8000/api/v1/content/news/Aaron%20Judge%20?limit=20&target_language=English&max_chars_title=50&max_chars_summary=50', {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data || !data.news || data.news.length === 0) {
          throw new Error('No data available');
        }

        const shuffledNews = [...data.news, ...data.news].sort(() => Math.random() - 0.5);
        setApiData(shuffledNews);
        setError(null);
        return true;

      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Request timed out');
        }
        throw error;
      }
    };

    // 立即显示备用数据，不显示错误信息
    const backupNewsArray = [...BACKUP_NEWS.news, ...BACKUP_NEWS.news];
    setApiData(backupNewsArray);
    setError(null);  // 不设置错误信息
    setLoading(false);

    // 后台持续尝试获取数据的函数
    const backgroundFetch = async () => {
      try {
        const success = await fetchNews();
        if (success) {
          console.log('Successfully fetched live news');
          return true;
        }
      } catch (error) {
        console.log('Background fetch attempt failed, will retry...');
        return false;
      }
    };

    // 开始后台轮询
    const startPolling = () => {
      const pollInterval = setInterval(async () => {
        const success = await backgroundFetch();
        if (success) {
          clearInterval(pollInterval);
          console.log('Live data fetched successfully, stopping polling');
        }
      }, 2000);

      // 返回清理函数
      return () => clearInterval(pollInterval);
    };

    // 启动轮询
    const cleanup = startPolling();

    // 组件卸载时清理
    return () => {
      cleanup();
    };
  }, []); // 只在组件挂载时运行一次

  // 检查图片方向
  const checkImageOrientation = (imageUrl, index) => {
    const img = new Image();
    img.onload = () => {
      setImageAspectRatios(prev => ({
        ...prev,
        [index]: img.width > 3 * img.height  // 如果宽度大于高度的1.5倍，则为横向图片
      }));
    };
    img.src = imageUrl;
  };

  // 初始化时检查所有图片
  useEffect(() => {
    apiData.forEach((item, index) => {
      checkImageOrientation(item.image_url, index);
    });
  }, [apiData]);  // 当 apiData 更新时重新检查

  const handleNewsClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleRetry = () => {
    setLoading(true);
    setRetryCount(prev => prev + 1);
  };

  // 处理用户滚动
  const handleScroll = () => {
    if (!isUserScrolling) {
      setIsUserScrolling(true);
    }

    // 清除之前的超时
    if (userScrollTimeout.current) {
      clearTimeout(userScrollTimeout.current);
    }

    // 用户停止滚动1秒后恢复正常速度
    userScrollTimeout.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        Error: {error}
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
      onScroll={handleScroll}
      style={{ overflowY: 'auto' }}
    >
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-full gap-4 p-4"
        columnClassName="flex flex-col gap-4 [&:nth-child(2)]:mt-4"
      >
        {apiData.map((item, index) => {
          const isWide = imageAspectRatios[index];
          return (
            <div
              key={index}
              className="newImageCard"
              style={{ aspectRatio: isWide ? '9/6' : '3/4' }}
              onClick={() => handleNewsClick(item.url)}
              onMouseEnter={() => setHoveredDomain(item.domain)}
              onMouseLeave={() => setHoveredDomain(null)}
            >
              <div 
                className="newImageCard-image"
                style={{ height: '75%' }}
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                />
                {hoveredDomain === item.domain && (
                  <div className="newImageCard-domain">
                    {item.domain}
                  </div>
                )}
              </div>
              <div 
                className="newImageCard-title"
                style={{ height: '25%' }}
              >
                <p>{item.title}</p>
              </div>
            </div>
          );
        })}
      </Masonry>
    </div>
  );
}
