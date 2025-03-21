
import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { AdBanner } from '@/components/layout/AdBanner';
import { TopStories } from '@/components/news/TopStories';
import { ArticleCard } from '@/components/news/ArticleCard';
import { CategoryHeader } from '@/components/news/CategoryHeader';
import { WeatherWidget } from '@/components/news/WeatherWidget';
import { NewsletterSignup } from '@/components/news/NewsletterSignup';
import { EventsCalendar } from '@/components/news/EventsCalendar';
import { getFeaturedArticles, getArticlesByCategory, getRecentArticles, getMostRecentArticles, Article } from '@/data/mockData';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

const Index = () => {
  // State for async loaded data
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [mostRecentArticles, setMostRecentArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Synchronous article data
  const publicSafetyArticles = getArticlesByCategory('Public Safety');
  const politicsArticles = getArticlesByCategory('Politics');
  const businessArticles = getArticlesByCategory('Business');
  const educationArticles = getArticlesByCategory('Education');
  const healthArticles = getArticlesByCategory('Health');
  const environmentArticles = getArticlesByCategory('Environment');
  const latestArticles = getRecentArticles(5);

  // Load async data on component mount
  useEffect(() => {
    const loadAsyncData = async () => {
      setIsLoading(true);
      try {
        const [featured, recent] = await Promise.all([
          getFeaturedArticles(),
          getMostRecentArticles(6)
        ]);
        
        setFeaturedArticles(featured);
        setMostRecentArticles(recent);
      } catch (error) {
        console.error('Error loading articles:', error);
        // Fallback to mock data if API fails
        setFeaturedArticles(getFeaturedArticles() as unknown as Article[]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAsyncData();
    
    // Set up recurring updates every 15 minutes
    const interval = setInterval(() => {
      loadAsyncData();
      console.log('Refreshed news data at', new Date().toLocaleTimeString());
    }, 15 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <div className="container px-4 py-8 mx-auto">
        {/* Featured Top Stories Slider */}
        <TopStories articles={isLoading ? [] : featuredArticles} className="mb-8" />
        
        {/* Ad Banner */}
        <AdBanner size="large" className="my-8" />

        {/* Most Recent News Section - NEW SECTION */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-news-dark font-serif border-b-2 border-news-primary pb-2">Most Recent</h2>
            <Link to="/category/most-recent" className="text-news-primary hover:underline text-sm">View All</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mostRecentArticles.slice(0, 6).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        {/* Quick Category Navigation */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-2 scrollbar-thin">
          <Link to="/category/public-safety" className="px-4 py-2 bg-news-primary text-white rounded-full whitespace-nowrap hover:bg-news-primary/90 transition-colors">
            Public Safety
          </Link>
          <Link to="/category/politics" className="px-4 py-2 bg-news-secondary text-white rounded-full whitespace-nowrap hover:bg-news-secondary/90 transition-colors">
            Politics
          </Link>
          <Link to="/category/business" className="px-4 py-2 bg-blue-600 text-white rounded-full whitespace-nowrap hover:bg-blue-600/90 transition-colors">
            Business
          </Link>
          <Link to="/category/education" className="px-4 py-2 bg-green-600 text-white rounded-full whitespace-nowrap hover:bg-green-600/90 transition-colors">
            Education
          </Link>
          <Link to="/category/health" className="px-4 py-2 bg-red-500 text-white rounded-full whitespace-nowrap hover:bg-red-500/90 transition-colors">
            Health
          </Link>
          <Link to="/category/environment" className="px-4 py-2 bg-emerald-600 text-white rounded-full whitespace-nowrap hover:bg-emerald-600/90 transition-colors">
            Environment
          </Link>
          <Link to="/communities" className="px-4 py-2 bg-purple-600 text-white rounded-full whitespace-nowrap hover:bg-purple-600/90 transition-colors">
            Communities
          </Link>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width on desktop */}
          <div className="lg:col-span-2">
            {/* Public Safety Section */}
            <section className="mb-12">
              <CategoryHeader title="Public Safety" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {publicSafetyArticles.slice(0, 4).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </section>

            {/* Politics Section */}
            <section className="mb-12">
              <CategoryHeader title="Politics" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {politicsArticles.slice(0, 2).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </section>

            {/* Ad Banner */}
            <AdBanner size="medium" className="mb-12" />

            {/* New Categories: Health and Environment */}
            <Tabs defaultValue="health" className="w-full mb-12">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="health">Health</TabsTrigger>
                <TabsTrigger value="environment">Environment</TabsTrigger>
              </TabsList>
              <TabsContent value="health" className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-news-dark font-serif">Health News</h2>
                  <Link to="/category/health" className="text-news-primary hover:underline text-sm">View All</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {healthArticles.slice(0, 2).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="environment" className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-news-dark font-serif">Environment News</h2>
                  <Link to="/category/environment" className="text-news-primary hover:underline text-sm">View All</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {environmentArticles.slice(0, 2).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Business and Education in two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <section>
                <CategoryHeader title="Business" />
                {businessArticles.slice(0, 2).map((article) => (
                  <ArticleCard 
                    key={article.id} 
                    article={article} 
                    variant="horizontal"
                  />
                ))}
              </section>
              <section>
                <CategoryHeader title="Education" />
                {educationArticles.slice(0, 2).map((article) => (
                  <ArticleCard 
                    key={article.id} 
                    article={article} 
                    variant="horizontal"
                  />
                ))}
              </section>
            </div>
          </div>

          {/* Sidebar - 1/3 width on desktop */}
          <div className="space-y-8">
            {/* Weather Widget */}
            <WeatherWidget />
            
            {/* Latest News */}
            <div>
              <CategoryHeader title="Latest News" />
              <div className="space-y-4">
                {latestArticles.map((article) => (
                  <ArticleCard 
                    key={article.id} 
                    article={article} 
                    variant="minimal"
                  />
                ))}
              </div>
            </div>
            
            {/* Ad Banner */}
            <AdBanner size="small" />
            
            {/* Events Calendar */}
            <EventsCalendar />
            
            {/* Newsletter Signup */}
            <NewsletterSignup />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
