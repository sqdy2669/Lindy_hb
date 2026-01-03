
import React from 'react';

interface CakeProps {
  isLit: boolean;
}

const Cake: React.FC<CakeProps> = ({ isLit }) => {
  return (
    <div className="relative flex flex-col items-center justify-center transform scale-90 md:scale-110 transition-all duration-1000">
      {/* Candles on top */}
      <div className="flex space-x-6 mb-[-8px] z-30">
        {[1, 2, 3].map((i) => (
          <div key={i} className="relative flex flex-col items-center">
            {/* Flame */}
            <div 
              className={`w-4 h-7 bg-orange-400 rounded-full blur-[1px] transition-all duration-500 animate-pulse ${
                isLit ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-0 translate-y-4'
              }`}
              style={{
                boxShadow: '0 0 25px 8px rgba(255, 165, 0, 0.7)',
                background: 'radial-gradient(circle at 50% 50%, #fff 0%, #ffdf00 40%, #ff8c00 100%)'
              }}
            />
            {/* Candle Body */}
            <div className={`w-2 h-10 rounded-full transition-colors duration-500 ${i % 2 === 0 ? 'bg-blue-400' : 'bg-pink-400'}`} />
          </div>
        ))}
      </div>

      {/* Cake Tiers */}
      <div className="relative flex flex-col items-center">
        {/* Top Tier */}
        <div className="w-32 h-16 bg-white rounded-t-xl relative z-20 shadow-lg flex items-center justify-center border-b-2 border-pink-100">
          <div className="absolute top-0 w-full flex justify-around overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-6 h-4 bg-pink-200 rounded-b-full -mt-1" />
            ))}
          </div>
          <span className="text-pink-500 font-bold text-lg mt-2 select-none">生 日</span>
        </div>

        {/* Middle Tier */}
        <div className="w-48 h-20 bg-pink-50 rounded-t-xl relative z-10 -mt-2 shadow-xl flex items-center justify-center border-b-2 border-pink-200">
          <div className="absolute top-0 w-full flex justify-around overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-8 h-5 bg-white rounded-b-full -mt-1 shadow-sm" />
            ))}
          </div>
          <span className="text-pink-400 font-black text-xl mt-4 select-none">快 乐</span>
        </div>

        {/* Bottom Tier */}
        <div className="w-64 h-24 bg-white rounded-t-2xl relative z-0 -mt-2 shadow-2xl flex items-end justify-center pb-4">
          <div className="absolute top-0 w-full flex justify-around overflow-hidden">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-8 h-6 bg-pink-100 rounded-b-full -mt-1" />
            ))}
          </div>
          {/* Decorative dots */}
          <div className="flex space-x-2 mb-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-pink-300 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>

        {/* Plate */}
        <div className="w-80 h-4 bg-gray-200 rounded-full shadow-md -mt-1" />
      </div>

      {isLit && (
        <div className="absolute inset-0 -z-10 bg-yellow-500/20 blur-[120px] rounded-full animate-pulse" />
      )}
    </div>
  );
};

export default Cake;
