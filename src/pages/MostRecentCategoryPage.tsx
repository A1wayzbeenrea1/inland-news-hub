
import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ArticleCard } from '@/components/news/ArticleCard';
import { CategoryHeader } from '@/components/news/CategoryHeader';
import { AdBanner } from '@/components/layout/AdBanner';
import { getMostRecentArticles, Article, getRssArticles } from '@/data/mockData';
import { MetaTags } from '@/components/common/MetaTags';
import { useToast } from '@/hooks/use-toast';
import { setupRssFeedRefresh } from '@/services/rssFeedService';

const MostRecentCategoryPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let rssRefreshInterval: ReturnType<typeof setInterval> | null = null;
    
    const loadArticles = async () => {
      setIsLoading(true);
      try {
        // Check for force refresh
        const forceRefresh = localStorage.getItem("forceRefresh");
        const shouldForceRefresh = forceRefresh && (Date.now() - parseInt(forceRefresh)) < 10000; // Force if less than 10 seconds old
        
        // Force a fresh load to ensure we get the latest stories
        const mostRecent = await getMostRecentArticles(30);
        console.log('Most Recent Articles loaded:', mostRecent.length);
        
        // Debug date information
        if (mostRecent.length > 0) {
          const datesSorted = mostRecent.map(article => ({
            id: article.id,
            title: article.title,
            source: article.source || 'Unknown',
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
              dateStr: story.publishedAt,
              source: story.source || 'Admin'
            }));
            console.log('Admin stories dates:', adminDatesSorted);
            
            // Check if admin stories are included in most recent
            const adminIdsInMostRecent = mostRecent.filter(article => 
              parsedStories.some((adminStory: Article) => adminStory.id === article.id)
            );
            console.log(`Found ${adminIdsInMostRecent.length} admin stories in most recent articles:`, 
              adminIdsInMostRecent.map(a => a.title));
            
            // If admin stories are missing from mostRecent, manually combine them
            if (adminIdsInMostRecent.length < parsedStories.length) {
              console.log("Adding missing admin stories to the articles list");
              
              // Get admin stories that aren't in mostRecent
              const missingAdminStories = parsedStories.filter((adminStory: Article) => 
                !mostRecent.some(article => article.id === adminStory.id)
              );
              
              // Manually add the missing admin stories
              if (missingAdminStories.length > 0) {
                console.log(`Adding ${missingAdminStories.length} missing admin stories`);
                
                // Combine and sort by date
                const combinedArticles = [...mostRecent, ...missingAdminStories].sort((a, b) => 
                  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
                );
                
                setArticles(combinedArticles);
                
                toast({
                  title: "Articles Loaded",
                  description: `Loaded ${combinedArticles.length} articles including ${missingAdminStories.length} admin stories`,
                  duration: 3000,
                });
                
                setIsLoading(false);
                return;
              }
            }
          }
        } else {
          console.log('No admin stories found in localStorage');
        }
        
        // Check for RSS articles
        const rssArticles = await getRssArticles(shouldForceRefresh);
        console.log(`Loaded ${rssArticles.length} articles from RSS feeds`);
        
        // RSS articles should already be in mostRecent, but log to confirm
        const rssInMostRecent = mostRecent.filter(article => 
          article.id.startsWith('rss-')
        );
        console.log(`Found ${rssInMostRecent.length} RSS articles in most recent:`, 
          rssInMostRecent.map(a => a.title));
        
        setArticles(mostRecent);
        
        // Show toast if articles were loaded
        if (mostRecent.length > 0) {
          toast({
            title: "Articles Loaded",
            description: `Loaded ${mostRecent.length} most recent articles including RSS feeds`,
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

    // Set up RSS feed refreshing
    rssRefreshInterval = setupRssFeedRefresh(async () => {
      console.log("RSS feeds refreshed, reloading articles");
      await loadArticles();
    }, 15); // Refresh every 15 minutes
    
    // Initial load
    loadArticles();
    
    // Cleanup function
    return () => {
      if (rssRefreshInterval !== null) {
        clearInterval(rssRefreshInterval);
      }
    };
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
                  <ArticleCard 
                    key={article.id} 
                    article={article} 
                    badgeText={article.source && (article.id.startsWith('rss-') || article.source === 'Admin') ? article.source : undefined}
                  />
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
