
import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ArticleCard } from '@/components/news/ArticleCard';
import { CategoryHeader } from '@/components/news/CategoryHeader';
import { AdBanner } from '@/components/layout/AdBanner';
import { getMostRecentArticles, Article } from '@/data/mockData';
import { MetaTags } from '@/components/common/MetaTags';
import { useToast } from '@/hooks/use-toast';

const MostRecentCategoryPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true);
      try {
        // Force a fresh load to ensure we get the latest admin stories
        const mostRecent = await getMostRecentArticles(30);
        console.log('Most Recent Articles loaded:', mostRecent.length);
        
        // Debug date information
        if (mostRecent.length > 0) {
          const datesSorted = mostRecent.map(article => ({
            id: article.id,
            title: article.title,
            date: new Date(article.publishedAt),
            dateStr: article.publishedAt
          }));
          console.log('Articles dates (sorted by most recent first):', datesSorted);
        }
        
        // Check if we have admin stories
        const adminStories = localStorage.getItem("adminStories");
        if (adminStories) {
          const parsedStories = JSON.parse(adminStories);
          console.log('Admin stories found in localStorage:', parsedStories.length);
          
          // Debug admin stories dates
          if (parsedStories.length > 0) {
            const adminDatesSorted = parsedStories.map((story: Article) => ({
              id: story.id,
              title: story.title,
              date: new Date(story.publishedAt),
              dateStr: story.publishedAt
            }));
            console.log('Admin stories dates:', adminDatesSorted);
            
            // Check if admin stories are included in most recent
            const adminIdsInMostRecent = mostRecent.filter(article => 
              parsedStories.some((adminStory: Article) => adminStory.id === article.id)
            );
            console.log(`Found ${adminIdsInMostRecent.length} admin stories in most recent articles:`, 
              adminIdsInMostRecent.map(a => a.title));
          }
        } else {
          console.log('No admin stories found in localStorage');
        }
        
        setArticles(mostRecent);
        
        // Show toast if articles were loaded
        if (mostRecent.length > 0) {
          toast({
            title: "Articles Loaded",
            description: `Loaded ${mostRecent.length} most recent articles`,
            duration: 3000,
          });
        }
      } catch (error) {
        console.error('Error loading most recent articles:', error);
        toast({
          title: "Error Loading Articles",
          description: "There was a problem loading the most recent articles",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, [toast]);

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
