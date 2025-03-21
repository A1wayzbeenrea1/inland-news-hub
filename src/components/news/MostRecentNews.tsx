
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Article } from '@/data/mockData';
import { ArticleCard } from './ArticleCard';
import { CategoryHeader } from './CategoryHeader';
import { fetchLatestNews } from '@/services/newsService';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MostRecentNewsProps {
  localArticles: Article[];
  className?: string;
}

export const MostRecentNews = ({ localArticles, className }: MostRecentNewsProps) => {
  const [allArticles, setAllArticles] = useState<Article[]>(localArticles);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchExternalNews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const externalArticles = await fetchLatestNews();
      
      // Combine with local articles and sort by date
      const combined = [...externalArticles, ...localArticles]
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 8); // Limit to 8 articles
      
      setAllArticles(combined);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to load the latest news. Please try again later.');
      setAllArticles(localArticles);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExternalNews();
    
    // Set up automatic refresh every 30 minutes
    const intervalId = setInterval(fetchExternalNews, 30 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className={className}>
      <div className="flex justify-between items-center mb-4">
        <CategoryHeader title="Most Recent" className="mb-0 flex-1" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            Updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchExternalNews}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {isLoading ? (
          // Skeleton loading state
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))
        ) : (
          allArticles.slice(0, 4).map((article) => (
            <div key={article.id} className="relative">
              <ArticleCard article={article} />
              {article.isExternal && (
                <Badge className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600">
                  {article.source}
                </Badge>
              )}
            </div>
          ))
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {!isLoading && allArticles.slice(4, 8).map((article) => (
          <div key={article.id} className="relative">
            <ArticleCard 
              article={article} 
              variant="minimal" 
            />
            {article.isExternal && (
              <span className="text-xs text-blue-600 font-medium">
                {article.source}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
