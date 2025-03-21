import { Link } from 'react-router-dom';
import { Clock, User, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    excerpt: string;
    image: string;
    category: string;
    author: string;
    publishedAt: string;
    slug: string;
    source?: string;
    sourceUrl?: string;
    isExternal?: boolean;
  };
  variant?: 'default' | 'featured' | 'horizontal' | 'minimal';
  className?: string;
}

export const ArticleCard = ({ article, variant = 'default', className }: ArticleCardProps) => {
  // Format the date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  // Determine the appropriate link for the article
  const articleLink = article.isExternal 
    ? article.sourceUrl 
    : `/article/${article.slug}`;

  // Determine if link should open in a new tab
  const linkProps = article.isExternal 
    ? { target: "_blank", rel: "noopener noreferrer" } 
    : {};

  if (variant === 'featured') {
    return (
      <div className={cn("group relative overflow-hidden rounded-lg", className)}>
        <div className="aspect-[16/9] w-full overflow-hidden rounded-lg">
          <img 
            src={article.image} 
            alt={article.title} 
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 flex flex-col justify-end">
          <Badge className="self-start mb-3 bg-news-secondary hover:bg-news-primary border-none">
            {article.category}
          </Badge>
          <Link to={articleLink} {...linkProps}>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 group-hover:text-news-secondary transition-colors">
              {article.title}
              {article.isExternal && <ExternalLink size={18} className="inline-block ml-2" />}
            </h2>
          </Link>
          <p className="text-white/80 mb-4 line-clamp-2">{article.excerpt}</p>
          <div className="flex items-center text-white/70 text-sm">
            <User size={14} className="mr-1" />
            <span className="mr-4">{article.author}</span>
            <Clock size={14} className="mr-1" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className={cn("group flex flex-col md:flex-row gap-4 border-b pb-4 mb-4", className)}>
        <div className="w-full md:w-1/3 aspect-[16/9] overflow-hidden rounded-lg">
          <img 
            src={article.image} 
            alt={article.title} 
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="w-full md:w-2/3">
          <Badge className="mb-2 bg-news-secondary hover:bg-news-primary border-none">
            {article.category}
          </Badge>
          <Link to={articleLink} {...linkProps}>
            <h3 className="text-xl font-bold mb-2 group-hover:text-news-primary transition-colors flex items-center">
              {article.title}
              {article.isExternal && <ExternalLink size={16} className="inline-block ml-2" />}
            </h3>
          </Link>
          <p className="text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
          <div className="flex items-center text-gray-500 text-sm">
            <User size={14} className="mr-1" />
            <span className="mr-4">{article.author}</span>
            <Clock size={14} className="mr-1" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={cn("group border-b pb-3 mb-3", className)}>
        <Link to={articleLink} {...linkProps}>
          <h3 className="text-base font-medium group-hover:text-news-primary transition-colors line-clamp-2 flex items-center">
            {article.title}
            {article.isExternal && <ExternalLink size={14} className="inline-block ml-1 flex-shrink-0" />}
          </h3>
        </Link>
        <div className="flex items-center text-gray-500 text-xs mt-1">
          <Clock size={12} className="mr-1" />
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </div>
    );
  }

  // Default card
  return (
    <div className={cn("group overflow-hidden rounded-lg border bg-white h-full flex flex-col", className)}>
      <div className="aspect-[16/9] w-full overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title} 
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <Badge className="self-start mb-2 bg-news-secondary hover:bg-news-primary border-none">
          {article.category}
        </Badge>
        <Link to={articleLink} {...linkProps} className="flex-1">
          <h3 className="text-lg font-bold mb-2 group-hover:text-news-primary transition-colors flex items-center">
            {article.title}
            {article.isExternal && <ExternalLink size={16} className="inline-block ml-1 flex-shrink-0" />}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
        <div className="flex items-center text-gray-500 text-sm mt-auto">
          <User size={14} className="mr-1" />
          <span className="mr-4">{article.author}</span>
          <Clock size={14} className="mr-1" />
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </div>
    </div>
  );
};
