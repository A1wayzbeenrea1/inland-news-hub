
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { AdBanner } from '@/components/layout/AdBanner';
import { ArticleCard } from '@/components/news/ArticleCard';
import { NewsletterSignup } from '@/components/news/NewsletterSignup';
import { WeatherWidget } from '@/components/news/WeatherWidget';
import { CategoryHeader } from '@/components/news/CategoryHeader';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { getArticlesByCategory, getRecentArticles } from '@/data/mockData';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Article } from '@/types/article';

const HealthCategoryPage = () => {
  const category = "Health";
  const [articles, setArticles] = useState<Article[]>([]);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const [articleData, latestArticleData] = await Promise.all([
          getArticlesByCategory(category),
          getRecentArticles(5)
        ]);
        
        setArticles(articleData);
        setLatestArticles(latestArticleData);
      } catch (error) {
        console.error("Error fetching health category data:", error);
        setArticles([]);
        setLatestArticles([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin h-10 w-10 border-4 border-news-primary border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container px-4 py-8 mx-auto">
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-news-dark font-serif border-b-2 border-news-primary pb-2">
            {category}
          </h1>
          <p className="text-gray-600 mt-2">
            Latest health news, medical breakthroughs, wellness tips, and healthcare coverage for Yucaipa, Redlands, and the Inland Empire.
          </p>
        </div>

        {/* Topic Tabs */}
        <Tabs defaultValue="all" className="w-full mb-8">
          <TabsList className="w-full flex flex-wrap justify-start bg-gray-100 p-1 mb-6">
            <TabsTrigger value="all" className="flex-grow sm:flex-grow-0">All Health News</TabsTrigger>
            <TabsTrigger value="wellness" className="flex-grow sm:flex-grow-0">Wellness</TabsTrigger>
            <TabsTrigger value="covid" className="flex-grow sm:flex-grow-0">COVID-19</TabsTrigger>
            <TabsTrigger value="mental" className="flex-grow sm:flex-grow-0">Mental Health</TabsTrigger>
            <TabsTrigger value="medical" className="flex-grow sm:flex-grow-0">Medical Research</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            {/* Featured Article */}
            {articles.length > 0 && (
              <ArticleCard 
                article={articles[0]}
                variant="featured"
                className="mb-8"
              />
            )}
          </TabsContent>
          
          {["wellness", "covid", "mental", "medical"].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-0">
              {articles.length > 0 && (
                <ArticleCard 
                  article={articles.find(a => a.tags?.includes(tab)) || articles[0]}
                  variant="featured"
                  className="mb-8"
                />
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Ad Banner */}
        <AdBanner size="large" className="mb-8" />

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width on desktop */}
          <div className="lg:col-span-2">
            {/* Article Listing */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Latest {category} Articles</h2>
              <div className="space-y-6">
                {articles.slice(1).map((article) => (
                  <ArticleCard 
                    key={article.id} 
                    article={article} 
                    variant="horizontal"
                  />
                ))}
              </div>
            </div>

            {/* Pagination */}
            <Pagination className="my-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          {/* Sidebar - 1/3 width on desktop */}
          <div className="space-y-8">
            {/* Weather Widget */}
            <WeatherWidget />
            
            {/* Ad Banner */}
            <AdBanner size="small" />
            
            {/* Related Topics */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <CategoryHeader title="Related Topics" className="mb-4" />
              <div className="grid grid-cols-2 gap-2">
                <Link to="/category/public-safety" className="bg-white p-2 rounded border hover:bg-gray-50 text-sm">Public Safety</Link>
                <Link to="/category/environment" className="bg-white p-2 rounded border hover:bg-gray-50 text-sm">Environment</Link>
                <Link to="/category/education" className="bg-white p-2 rounded border hover:bg-gray-50 text-sm">Education</Link>
                <Link to="/communities/yucaipa" className="bg-white p-2 rounded border hover:bg-gray-50 text-sm">Yucaipa</Link>
              </div>
            </div>
            
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
            
            {/* Newsletter Signup */}
            <NewsletterSignup />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HealthCategoryPage;
