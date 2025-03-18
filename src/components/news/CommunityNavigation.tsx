
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface CommunityNavigationProps {
  className?: string;
}

const communities = [
  { name: 'Redlands', slug: 'redlands' },
  { name: 'Yucaipa', slug: 'yucaipa' },
  { name: 'Rialto', slug: 'rialto' },
  { name: 'Ontario', slug: 'ontario' },
  { name: 'Loma Linda', slug: 'loma-linda' },
];

export const CommunityNavigation = ({ className }: CommunityNavigationProps) => {
  return (
    <nav className={cn("flex flex-wrap items-center gap-2 overflow-x-auto", className)}>
      <div className="flex items-center mr-2 text-news-secondary">
        <MapPin className="h-4 w-4 mr-1" />
        <span className="text-sm font-medium">Communities:</span>
      </div>
      {communities.map((community) => (
        <Link 
          key={community.slug}
          to={`/community/${community.slug}`}
          className="text-sm text-gray-700 hover:text-news-primary py-1 px-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          {community.name}
        </Link>
      ))}
    </nav>
  );
};
