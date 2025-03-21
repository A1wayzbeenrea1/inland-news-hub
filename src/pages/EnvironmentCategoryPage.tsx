
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Leaf, Droplets, Thermometer, AlertTriangle } from 'lucide-react';
import { Article } from '@/types/article';

const EnvironmentCategoryPage = () => {
  const category = "Environment";
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
        console.error("Error fetching environment category data:", error);
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
            Environmental news, climate reports, conservation efforts, and sustainability initiatives for the Inland Empire region.
          </p>
        </div>

        {/* Environment Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center text-green-800"><Leaf className="mr-1 h-4 w-4" /> Air Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-700">Good</p>
              <p className="text-xs text-green-600">AQI: 42</p>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center text-blue-800"><Droplets className="mr-1 h-4 w-4" /> Water Supply</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-yellow-600">Moderate</p>
              <p className="text-xs text-blue-600">Reservoir levels: 68%</p>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50 border-red-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center text-red-800"><Thermometer className="mr-1 h-4 w-4" /> Temperature</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">+2.1°F</p>
              <p className="text-xs text-red-600">Above 10-year average</p>
            </CardContent>
          </Card>
          
          <Card className="bg-orange-50 border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center text-orange-800"><AlertTriangle className="mr-1 h-4 w-4" /> Fire Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-600">High</p>
              <p className="text-xs text-orange-600">Due to dry conditions</p>
            </CardContent>
          </Card>
        </div>

        {/* Topic Tabs */}
        <Tabs defaultValue="all" className="w-full mb-8">
          <TabsList className="w-full flex flex-wrap justify-start bg-gray-100 p-1 mb-6">
            <TabsTrigger value="all" className="flex-grow sm:flex-grow-0">All Environment News</TabsTrigger>
            <TabsTrigger value="climate" className="flex-grow sm:flex-grow-0">Climate</TabsTrigger>
            <TabsTrigger value="conservation" className="flex-grow sm:flex-grow-0">Conservation</TabsTrigger>
            <TabsTrigger value="pollution" className="flex-grow sm:flex-grow-0">Pollution</TabsTrigger>
            <TabsTrigger value="wildlife" className="flex-grow sm:flex-grow-0">Wildlife</TabsTrigger>
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
          
          {["climate", "conservation", "pollution", "wildlife"].map((tab) => (
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

            {/* External Resources */}
            <div className="mb-8 p-4 bg-green-50 rounded-lg">
              <h2 className="text-xl font-bold mb-4 text-green-800">Environmental Resources</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a href="https://www.epa.gov/" target="_blank" rel="noopener noreferrer" 
                   className="flex items-center p-2 bg-white rounded border border-green-200 hover:bg-green-100">
                  <span>EPA</span>
                  <ExternalLink className="ml-auto h-4 w-4 text-green-700" />
                </a>
                <a href="https://ww2.arb.ca.gov/" target="_blank" rel="noopener noreferrer" 
                   className="flex items-center p-2 bg-white rounded border border-green-200 hover:bg-green-100">
                  <span>California Air Resources Board</span>
                  <ExternalLink className="ml-auto h-4 w-4 text-green-700" />
                </a>
                <a href="https://www.calrecycle.ca.gov/" target="_blank" rel="noopener noreferrer" 
                   className="flex items-center p-2 bg-white rounded border border-green-200 hover:bg-green-100">
                  <span>CalRecycle</span>
                  <ExternalLink className="ml-auto h-4 w-4 text-green-700" />
                </a>
                <a href="https://www.energy.ca.gov/" target="_blank" rel="noopener noreferrer" 
                   className="flex items-center p-2 bg-white rounded border border-green-200 hover:bg-green-100">
                  <span>California Energy Commission</span>
                  <ExternalLink className="ml-auto h-4 w-4 text-green-700" />
                </a>
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
                <Link to="/category/health" className="bg-white p-2 rounded border hover:bg-gray-50 text-sm">Health</Link>
                <Link to="/category/politics" className="bg-white p-2 rounded border hover:bg-gray-50 text-sm">Politics</Link>
                <Link to="/category/business" className="bg-white p-2 rounded border hover:bg-gray-50 text-sm">Business</Link>
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

export default EnvironmentCategoryPage;
