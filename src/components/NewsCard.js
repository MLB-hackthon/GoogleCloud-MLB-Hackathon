import React from 'react';

const NewsCard = ({ news }) => {
  return (
    <a 
      href={news.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {news.image_url && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={news.image_url}
            alt={news.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-news-image.png'; 
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-24" />
        </div>
      )}
      <div className="p-4">
        <div className="text-xs text-gray-500 mb-2">{news.domain}</div>
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{news.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">{news.snippet}</p>
      </div>
    </a>
  );
};

export default NewsCard; 