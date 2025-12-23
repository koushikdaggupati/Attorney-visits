import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-gray-500 py-4 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 text-center text-[10px] uppercase tracking-wider font-medium">
        &copy; {new Date().getFullYear()} City of New York Department of Correction. All Rights Reserved.
      </div>
    </footer>
  );
};