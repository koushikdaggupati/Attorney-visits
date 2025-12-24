import React from 'react';
import docLogo from '../DOC Logo Vector (2).svg';

export const Header: React.FC = () => {
  return (
    <header className="bg-black text-white shadow-md z-50 border-b-4 border-nyc-gold">
      <div className="flex items-center h-24 px-4 md:px-8 w-full max-w-7xl mx-auto">
        <img
          src={docLogo}
          alt="NYC Department of Correction logo"
          className="h-12 w-auto mr-4 md:mr-6"
        />
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
