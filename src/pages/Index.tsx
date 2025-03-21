
import { useEffect, useState, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ArticleCard } from '@/components/news/ArticleCard';
import { CategoryHeader } from '@/components/news/CategoryHeader';
import { AdBanner } from '@/components/layout/AdBanner';
import { getFeaturedArticles, getArticlesByCategory, Article } from '@/data/mockData';
import { MetaTags } from '@/components/common/MetaTags';
import { SectionHeader } from '@/components/common/SectionHeader';
import { useToast } from '@/hooks/use-toast';
import { setupRssFeedRefresh } from '@/services/rssFeedService';

const Index = () => {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [categoryArticles, setCategoryArticles] = useState<{ [key: string]: Article[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const feedspotWidgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rssRefreshInterval: ReturnType<typeof setInterval> | null = null;
    
    const loadAsyncData = async () => {
      setIsLoading(true);
      
      try {
        // Check for force refresh
        const forceRefresh = localStorage.getItem("forceRefresh");
        const shouldForceRefresh = forceRefresh && (Date.now() - parseInt(forceRefresh)) < 10000; // Force if less than 10 seconds old
        
        // Load data from all required endpoints
        const [featuredArticlesData, publicSafetyArticles, educationArticles, politicsArticles, businessArticles] = await Promise.all([
          getFeaturedArticles(),
          getArticlesByCategory('Public Safety'),
          getArticlesByCategory('Education'),
          getArticlesByCategory('Politics'),
          getArticlesByCategory('Business')
        ]);
        
        // Check if admin stories are loaded
        const adminStories = localStorage.getItem("adminStories");
        if (adminStories) {
          const parsedStories = JSON.parse(adminStories);
          console.log(`Index: Found ${parsedStories.length} admin stories in localStorage`);
        }
        
        // Update state with loaded data
        setFeaturedArticles(featuredArticlesData);
        setCategoryArticles({
          'Public Safety': publicSafetyArticles,
          'Education': educationArticles,
          'Politics': politicsArticles,
          'Business': businessArticles,
        });
        
        // Remove the force refresh flag after loading
        if (shouldForceRefresh) {
          localStorage.removeItem("forceRefresh");
        }
        
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial load
    loadAsyncData();
    
    // Set up RSS feed refreshing
    rssRefreshInterval = setupRssFeedRefresh(async () => {
      console.log("RSS feeds refreshed, reloading articles");
      await loadAsyncData();
    }, 15); // Refresh every 15 minutes
    
    // Initialize Feedspot widget
    const loadFeedspotWidget = () => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.id = 'iframecontent';
      script.src = 'https://www.feedspot.com/widgets/Assets/js/wd-iframecontent.js';
      script.setAttribute('data-wd-id', 'vcIef44b1196');
      script.setAttribute('data-script', '');
      script.setAttribute('data-host', '');
      
      // Clear the ref content before adding script to avoid duplications
      if (feedspotWidgetRef.current) {
        feedspotWidgetRef.current.innerHTML = '';
        feedspotWidgetRef.current.appendChild(script);
      }
    };
    
    // Load widget once data is loaded
    if (!isLoading) {
      loadFeedspotWidget();
    }
    
    // Cleanup function
    return () => {
      if (rssRefreshInterval !== null) {
        clearInterval(rssRefreshInterval);
      }
    };
  }, [isLoading]);

  return (
    <Layout>
      <MetaTags
        title="Inland Empire True News"
        description="Your source for local news in the Inland Empire region"
      />
      
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-4 text-gray-600">Loading the latest stories...</p>
          </div>
        ) : (
          <>
            {featuredArticles.length > 0 && (
              <section className="mb-8">
                <SectionHeader title="Featured Stories" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                  {featuredArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} badgeText={article.source} />
                  ))}
                </div>
              </section>
            )}

            {/* Feedspot Widget Section */}
            <section className="mb-8">
              <SectionHeader title="News From Around The Web" />
              <div ref={feedspotWidgetRef} className="mt-4 rounded-lg shadow-md p-4 bg-white"></div>
            </section>

            {Object.entries(categoryArticles).map(([category, articles]) => (
              articles.length > 0 && (
                <section key={category} className="mb-8">
                  <CategoryHeader title={category} />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {articles.map((article) => (
                      <ArticleCard key={article.id} article={article} badgeText={article.source} />
                    ))}
                  </div>
                </section>
              )
            ))}
          </>
        )}
        
        <AdBanner size="large" className="my-12" />
      </div>
    </Layout>
  );
};

export default Index;
