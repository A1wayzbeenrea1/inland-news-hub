
import { cn } from '@/lib/utils';

interface CategoryHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export const CategoryHeader = ({ title, description, className }: CategoryHeaderProps) => {
  return (
    <div className={cn("border-b-2 border-news-primary pb-2 mb-6", className)}>
      <h2 className="text-2xl md:text-3xl font-bold text-news-dark font-serif">{title}</h2>
      {description && <p className="text-gray-600 mt-1">{description}</p>}
    </div>
  );
};
