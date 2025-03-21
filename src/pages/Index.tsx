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
  const redlandsFeedspotWidgetRef = useRef<HTMLDivElement>(null);
  const yucaipaFeedspotWidgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rssRefreshInterval: ReturnType<typeof setInterval> | null = null;
    
    const loadAsyncData = async () => {
      setIsLoading(true);
      
      try {
        const forceRefresh = localStorage.getItem("forceRefresh");
        const shouldForceRefresh = forceRefresh && (Date.now() - parseInt(forceRefresh)) < 10000;
        
        const [featuredArticlesData, publicSafetyArticles, educationArticles, politicsArticles, businessArticles] = await Promise.all([
          getFeaturedArticles(),
          getArticlesByCategory('Public Safety'),
          getArticlesByCategory('Education'),
          getArticlesByCategory('Politics'),
          getArticlesByCategory('Business')
        ]);
        
        const adminStories = localStorage.getItem("adminStories");
        if (adminStories) {
          const parsedStories = JSON.parse(adminStories);
          console.log(`Index: Found ${parsedStories.length} admin stories in localStorage`);
        }
        
        setFeaturedArticles(featuredArticlesData);
        setCategoryArticles({
          'Public Safety': publicSafetyArticles,
          'Education': educationArticles,
          'Politics': politicsArticles,
          'Business': businessArticles,
        });
        
        if (shouldForceRefresh) {
          localStorage.removeItem("forceRefresh");
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAsyncData();
    
    rssRefreshInterval = setupRssFeedRefresh(async () => {
      console.log("RSS feeds refreshed, reloading articles");
      await loadAsyncData();
    }, 26.25);
    
    const loadFeedspotWidgets = () => {
      if (feedspotWidgetRef.current) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.id = 'iframecontent';
        script.src = 'https://www.feedspot.com/widgets/Assets/js/wd-iframecontent.js';
        script.setAttribute('data-wd-id', 'vcIef44b1196');
        script.setAttribute('data-script', '');
        script.setAttribute('data-host', '');
        
        feedspotWidgetRef.current.innerHTML = '';
        feedspotWidgetRef.current.appendChild(script);
      }
      
      if (redlandsFeedspotWidgetRef.current) {
        const iframe = document.createElement('iframe');
        iframe.className = 'widget_preview_iframe';
        iframe.frameBorder = '0';
        iframe.allow = 'autoplay; encrypted-media';
        iframe.allowFullscreen = true;
        iframe.scrolling = 'no';
        iframe.style.width = '100%';
        iframe.style.height = '476px';
        iframe.style.visibility = 'visible';
        iframe.src = 'https://www.feedspot.com/widgets/lookup/vciG7f40a3c5';
        
        redlandsFeedspotWidgetRef.current.innerHTML = '';
        redlandsFeedspotWidgetRef.current.appendChild(iframe);
      }
      
      if (yucaipaFeedspotWidgetRef.current) {
        const iframe = document.createElement('iframe');
        iframe.className = 'widget_preview_iframe';
        iframe.frameBorder = '0';
        iframe.allow = 'autoplay; encrypted-media';
        iframe.allowFullscreen = true;
        iframe.scrolling = 'no';
        iframe.style.width = '100%';
        iframe.style.height = '476px';
        iframe.style.visibility = 'visible';
        iframe.src = 'https://www.feedspot.com/widgets/lookup/vciG7f40a3c5';
        
        yucaipaFeedspotWidgetRef.current.innerHTML = '';
        yucaipaFeedspotWidgetRef.current.appendChild(iframe);
      }
    };
    
    if (!isLoading) {
      loadFeedspotWidgets();
    }
    
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

            <section className="mb-8">
              <SectionHeader title="News From Around The Web" />
              <div ref={feedspotWidgetRef} className="mt-4 rounded-lg shadow-md p-4 bg-white"></div>
            </section>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <section className="mb-8">
                <SectionHeader title="Redlands Community News" />
                <div ref={redlandsFeedspotWidgetRef} className="mt-4 rounded-lg shadow-md p-4 bg-white"></div>
              </section>
              
              <section className="mb-8">
                <SectionHeader title="Yucaipa Community News" />
                <div ref={yucaipaFeedspotWidgetRef} className="mt-4 rounded-lg shadow-md p-4 bg-white"></div>
              </section>
            </div>

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
