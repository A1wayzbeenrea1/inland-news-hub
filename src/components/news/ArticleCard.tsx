
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

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
  };
  variant?: "default" | "featured" | "horizontal" | "minimal";
  className?: string;
  badgeText?: string;
}

export const ArticleCard = ({
  article,
  variant = "default",
  className,
  badgeText
}: ArticleCardProps) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn(`Invalid date encountered: ${dateString}`);
        return "Recently";
      }
      return format(date, "MMM d, yyyy");
    } catch (error) {
      console.error(`Error formatting date ${dateString}:`, error);
      return "Recently";
    }
  };

  if (variant === "featured") {
    return (
      <div className={cn("relative h-[600px] group overflow-hidden rounded-lg", className)}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />
        <img
          src={article.image}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
          <div className="flex items-center mb-2">
            <span className="bg-news-primary text-white px-3 py-1 text-xs uppercase tracking-wider rounded-full">
              {article.category}
            </span>
            {badgeText && (
              <span className="bg-news-secondary ml-2 text-white px-3 py-1 text-xs uppercase tracking-wider rounded-full">
                {badgeText}
              </span>
            )}
          </div>
          <Link to={`/article/${article.slug}`} className="block">
            <h2 className="text-3xl font-bold text-white mb-3 line-clamp-3">{article.title}</h2>
          </Link>
          <p className="text-gray-200 mb-4 line-clamp-3">{article.excerpt}</p>
          <div className="flex justify-between items-center text-gray-300 text-sm">
            <span>{article.author}</span>
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "horizontal") {
    return (
      <div className={cn("flex mb-6 group", className)}>
        <Link to={`/article/${article.slug}`} className="shrink-0">
          <img
            src={article.image}
            alt={article.title}
            className="w-32 h-24 object-cover rounded-md transition-transform group-hover:scale-105"
          />
        </Link>
        <div className="ml-4">
          <div className="flex items-center mb-1 gap-1">
            <span className="text-xs text-news-primary uppercase">{article.category}</span>
            {badgeText && (
              <span className="text-xs text-news-secondary uppercase ml-1">· {badgeText}</span>
            )}
          </div>
          <Link to={`/article/${article.slug}`} className="block group-hover:text-news-primary transition-colors">
            <h3 className="font-bold line-clamp-2">{article.title}</h3>
          </Link>
          <div className="flex justify-between text-gray-500 text-xs mt-1">
            <span>{article.author}</span>
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={cn("border-b border-gray-200 pb-3 last:border-0 group", className)}>
        <div className="flex items-center mb-1 gap-1">
          <span className="text-xs text-news-primary uppercase">{article.category}</span>
          {badgeText && (
            <span className="text-xs text-news-secondary uppercase ml-1">· {badgeText}</span>
          )}
        </div>
        <Link to={`/article/${article.slug}`} className="block group-hover:text-news-primary transition-colors">
          <h3 className="font-medium line-clamp-2 text-sm">{article.title}</h3>
        </Link>
        <span className="text-gray-500 text-xs">{formatDate(article.publishedAt)}</span>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group", className)}>
      <Link to={`/article/${article.slug}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-2 left-2 flex gap-1">
            <span className="bg-news-primary text-white px-2 py-1 text-xs uppercase tracking-wider rounded-sm">
              {article.category}
            </span>
            {badgeText && (
              <span className="bg-news-secondary text-white px-2 py-1 text-xs uppercase tracking-wider rounded-sm">
                {badgeText}
              </span>
            )}
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/article/${article.slug}`} className="block group-hover:text-news-primary transition-colors">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{article.title}</h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{article.excerpt}</p>
        <div className="flex justify-between items-center text-gray-500 text-xs">
          <span>{article.author}</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </div>
    </div>
  );
};
