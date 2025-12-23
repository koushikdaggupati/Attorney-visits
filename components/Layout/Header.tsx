import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-black text-white shadow-md z-50 border-b-4 border-nyc-gold">
      <div className="flex items-center h-24 px-4 md:px-8 w-full max-w-7xl mx-auto">
        
        <div className="flex flex-col justify-center">
          <h1 className="font-black text-2xl md:text-3xl leading-none tracking-tight uppercase text-white font-sans">
            NYC Department of Correction
          </h1>
          <span className="text-nyc-gold text-xs md:text-sm font-bold tracking-widest uppercase mt-1">
            Visit Scheduler
          </span>
        </div>

      </div>
    </header>
  );
};