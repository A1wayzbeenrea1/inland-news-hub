
import React from 'react';

interface SectionHeaderProps {
  title: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <div className="border-b border-gray-200 pb-2 mb-4">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    </div>
  );
};
