import React from 'react';

interface LoadingProps {
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ message = 'Loading...' }) => {
  return (
    <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn'>
      {/* Multi-dot bouncing loader */}
      <div className='flex items-center gap-3 mb-5'>
        {[...Array(3)].map((_, i) => (
          <span
            key={i}
            className='w-5 h-5 rounded-full shadow-lg bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-bounce'
            style={{ animationDelay: `${i * 0.2}s` }}
          ></span>
        ))}
      </div>

      {/* Animated loading text */}
      <p className='text-xl font-bold text-white animate-pulse drop-shadow-lg'>
        {message}
      </p>
    </div>
  );
};
