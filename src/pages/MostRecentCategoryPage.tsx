
import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ArticleCard } from '@/components/news/ArticleCard';
import { CategoryHeader } from '@/components/news/CategoryHeader';
import { AdBanner } from '@/components/layout/AdBanner';
import { getMostRecentArticles, Article } from '@/data/mockData';
import { MetaTags } from '@/components/common/MetaTags';

const MostRecentCategoryPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true);
      try {
        // Explicitly load most recent articles, including admin stories
        const mostRecent = await getMostRecentArticles(30);
        setArticles(mostRecent);
      } catch (error) {
        console.error('Error loading most recent articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, []);

  return (
    <Layout>
      <MetaTags
        title="Most Recent News | Inland Empire True News"
        description="The latest news stories from across the Inland Empire region"
      />
      <div className="container mx-auto px-4 py-8">
        <CategoryHeader title="Most Recent News" />
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-4 text-gray-600">Loading the latest stories...</p>
          </div>
        ) : (
          <>
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No recent articles found.</p>
              </div>
            )}
          </>
        )}
        
        <AdBanner size="large" className="my-12" />
      </div>
    </Layout>
  );
};

export default MostRecentCategoryPage;
