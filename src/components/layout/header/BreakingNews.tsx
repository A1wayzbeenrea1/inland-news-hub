
import React from 'react';

export const BreakingNews = () => {
  return (
    <div className="bg-news-secondary text-white py-2 overflow-hidden">
      <div className="flex whitespace-nowrap animate-ticker">
        <span className="font-bold px-4">BREAKING:</span>
        <span className="px-2">Wildfire containment reaches 60% in Yucaipa area as firefighters continue battling blaze</span>
        <span className="px-4">|</span>
        <span className="px-2">Redlands City Council approves new downtown development plan at Wednesday meeting</span>
        <span className="px-4">|</span>
        <span className="px-2">Ontario International Airport reports record passenger numbers for third consecutive month</span>
        <span className="px-4">|</span>
        <span className="px-2">Rialto school district announces new STEM program partnership with local tech companies</span>
      </div>
    </div>
  );
};
