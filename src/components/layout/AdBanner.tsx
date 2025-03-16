
import { cn } from '@/lib/utils';

interface AdBannerProps {
  size: 'large' | 'medium' | 'small';
  className?: string;
}

export const AdBanner = ({ size, className }: AdBannerProps) => {
  const dimensions = {
    large: 'h-28 md:h-32',
    medium: 'h-24 md:h-28',
    small: 'h-16 md:h-20',
  };

  return (
    <div 
      className={cn(
        "bg-gray-100 border border-gray-200 rounded flex items-center justify-center w-full mb-6",
        dimensions[size],
        className
      )}
    >
      <div className="text-center px-4">
        <p className="text-gray-500 text-sm">Advertisement</p>
        <p className="text-gray-400 text-xs">Your ad could be here</p>
      </div>
    </div>
  );
};
