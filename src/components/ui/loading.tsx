import React from 'react';

interface LoadingProps {
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ text = 'Yükleniyor...' }) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-4">
          {/* Coffee cup */}
          <div className="absolute inset-0 border-4 border-coffee-700 rounded-b-3xl rounded-t-lg animate-pulse"></div>
          {/* Coffee steam */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-2 h-4 bg-coffee-700/30 rounded-full animate-steam"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  transform: `translateY(${i * 2}px)`
                }}
              />
            ))}
          </div>
          {/* Coffee liquid */}
          <div className="absolute inset-2 bg-coffee-700/20 rounded-b-2xl rounded-t-sm animate-wave"></div>
        </div>
        <p className="text-coffee-700 dark:text-coffee-300 font-medium animate-pulse">
          {text}
        </p>
      </div>
    </div>
  );
};

// Add these animations to your tailwind.config.js
// extend: {
//   keyframes: {
//     steam: {
//       '0%, 100%': { transform: 'translateY(0) scale(1)' },
//       '50%': { transform: 'translateY(-4px) scale(1.2)' }
//     },
//     wave: {
//       '0%, 100%': { transform: 'translateY(0)' },
//       '50%': { transform: 'translateY(-2px)' }
//     }
//   },
//   animation: {
//     steam: 'steam 2s ease-in-out infinite',
//     wave: 'wave 2s ease-in-out infinite'
//   }
// } 