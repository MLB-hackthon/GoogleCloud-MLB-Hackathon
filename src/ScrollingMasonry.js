import React, { useState, useEffect, useRef } from "react";
import masonryData from './data/masonry-data.json';

// 创建一个函数来检查脚本是否已加载
const isGettyScriptLoaded = () => {
  return document.querySelector('script[src*="embed-cdn.gettyimages.com/widgets.js"]') !== null;
};

const data = masonryData;

export default function ScrollingMasonry() {
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredDomain, setHoveredDomain] = useState('');
  const containerRef = useRef(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

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
        setHoveredDomain('');
      }}
    >
      <div className="flex gap-0">
        {/* 左列 */}
        <div className="flex-1 px-1">
          {leftColumn.map((item, index) => (
            <div
              key={`left-${item.id}-${index}`}
              className="flex flex-col items-center bg-gray-100 rounded-lg mb-4 overflow-hidden cursor-pointer"
              style={{ 
                transition: 'all 0.5s ease-in-out',
                maxHeight: '400px',  
                height: 'auto',
                width: '100%'
              }}
              onClick={() => handleClick(item.url)}
              onMouseEnter={() => setHoveredDomain(item.domain)}
              onMouseLeave={() => setHoveredDomain('')}
            >
              <div className="flex-grow w-full relative" style={{ maxHeight: '85%' }}>
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
                    style={{ maxHeight: '400px' }} 
                  />
                )}
                {hoveredDomain === item.domain && (
                  <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {item.domain}
                  </div>
                )}
              </div>
              <div className="w-full bg-gray-800 flex items-center p-3" style={{ minHeight: '15%' }}>
                <p className="text-left font-medium text-white text-base leading-tight line-clamp-2">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 右列 */}
        <div className="flex-1 px-1">
          {rightColumn.map((item, index) => (
            <div
              key={`right-${item.id}-${index}`}
              className="flex flex-col items-center bg-gray-100 rounded-lg mb-4 overflow-hidden cursor-pointer"
              style={{ 
                transition: 'all 0.5s ease-in-out',
                maxHeight: '400px',  
                height: 'auto',
                width: '100%'
              }}
              onClick={() => handleClick(item.url)}
              onMouseEnter={() => setHoveredDomain(item.domain)}
              onMouseLeave={() => setHoveredDomain('')}
            >
              <div className="flex-grow w-full relative" style={{ maxHeight: '85%' }}>
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  style={{ maxHeight: '400px' }} 
                />
                {hoveredDomain === item.domain && (
                  <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {item.domain}
                  </div>
                )}
              </div>
              <div className="w-full bg-gray-800 flex items-center p-3" style={{ minHeight: '15%' }}>
                <p className="text-left font-medium text-white text-base leading-tight line-clamp-2">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
