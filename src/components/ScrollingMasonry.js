import React, { useState, useEffect, useRef } from "react";
import masonryData from '../data/masonry-data.json';
import Masonry from 'react-masonry-css';

// 创建一个函数来检查脚本是否已加载
const isGettyScriptLoaded = () => {
  return document.querySelector('script[src*="embed-cdn.gettyimages.com/widgets.js"]') !== null;
};

const data = masonryData;

export default function ScrollingMasonry() {
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredDomain, setHoveredDomain] = useState(null);
  const containerRef = useRef(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [imageAspectRatios, setImageAspectRatios] = useState({});

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

  const handleClick = (url) => {
    window.open(url, '_blank');  
  };

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
        className="flex w-full gap-0.5"
        columnClassName="flex flex-col gap-0.5 [&:nth-child(2)]:mt-4"
      >
        {leftColumn.map((item, index) => {
          const isWide = imageAspectRatios[index];
          return (
            <div
              key={`left-${item.id}-${index}`}
              className="w-full bg-white rounded-lg overflow-hidden shadow-sm"
              style={{ 
                aspectRatio: isWide ? '4/3' : '3/4'
              }}
              onMouseEnter={() => setHoveredDomain(item.domain)}
              onMouseLeave={() => setHoveredDomain(null)}
            >
              <div 
                className="flex-grow w-full relative" 
                style={{ 
                  height: isWide ? '75%' : '85%'
                }}
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
                    className="w-full h-full object-cover"
                  />
                )}
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
        {rightColumn.map((item, index) => {
          const isWide = imageAspectRatios[index];
          return (
            <div
              key={`right-${item.id}-${index}`}
              className="w-full bg-white rounded-lg overflow-hidden shadow-sm"
              style={{ 
                aspectRatio: isWide ? '4/3' : '3/4'
              }}
              onMouseEnter={() => setHoveredDomain(item.domain)}
              onMouseLeave={() => setHoveredDomain(null)}
            >
              <div 
                className="flex-grow w-full relative" 
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
    </div>
  );
}
