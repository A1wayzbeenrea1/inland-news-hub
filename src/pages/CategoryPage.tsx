
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { AdBanner } from '@/components/layout/AdBanner';
import { ArticleCard } from '@/components/news/ArticleCard';
import { NewsletterSignup } from '@/components/news/NewsletterSignup';
import { WeatherWidget } from '@/components/news/WeatherWidget';
import { Separator } from '@/components/ui/separator';
import { getArticlesByCategory, getRecentArticles } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { fetchLatestNews, categorizeArticle } from '@/services/newsService';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const formattedCategory = category
    ? category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : '';
  
  const [articles, setArticles] = useState(getArticlesByCategory(formattedCategory));
  const [latestArticles, setLatestArticles] = useState(getRecentArticles(5));
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Fetch external articles and filter for this category
    const fetchCategoryNews = async () => {
      setIsLoading(true);
      try {
        const externalArticles = await fetchLatestNews();
        const filteredExternal = externalArticles.filter(
          article => categorizeArticle(article.title, article.excerpt) === formattedCategory
        );
        
        // Combine with local articles
        const localArticles = getArticlesByCategory(formattedCategory);
        const combined = [...filteredExternal, ...localArticles]
          .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        
        setArticles(combined);
      } catch (error) {
        console.error('Error fetching category news:', error);
        setArticles(getArticlesByCategory(formattedCategory));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategoryNews();
  }, [category, formattedCategory]);

  return (
    <Layout>
      <main className="flex-grow">
        <div className="container px-4 py-8 mx-auto">
          {/* Category Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-news-dark font-serif border-b-2 border-news-primary pb-2">
              {formattedCategory}
            </h1>
            <p className="text-gray-600 mt-2">
              Latest {formattedCategory.toLowerCase()} news coverage for Yucaipa, Redlands, Rialto, Ontario and the Inland Empire.
            </p>
          </div>

          {/* Featured Article */}
          {articles.length > 0 && (
            <>
              <ArticleCard 
                article={articles[0]}
                variant="featured"
                className="mb-8"
              />
              
              {/* Ad Banner */}
              <AdBanner size="large" className="mb-8" />
            </>
          )}

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - 2/3 width on desktop */}
            <div className="lg:col-span-2">
              {/* Article Listing */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">All {formattedCategory} Articles</h2>
                
                {isLoading ? (
                  <div className="space-y-6">
                    {Array(5).fill(0).map((_, i) => (
                      <div key={i} className="flex animate-pulse">
                        <div className="w-1/3 bg-gray-200 h-32 rounded-md mr-4"></div>
                        <div className="w-2/3 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {articles.slice(1).map((article) => (
                      <ArticleCard 
                        key={article.id} 
                        article={article} 
                        variant="horizontal"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {articles.length > 10 && (
                <div className="flex justify-center my-8">
                  <div className="flex space-x-1">
                    <Button variant="outline" className="w-10 h-10 p-0">1</Button>
                    <Button variant="outline" className="w-10 h-10 p-0">2</Button>
                    <Button variant="outline" className="w-10 h-10 p-0">3</Button>
                    <span className="flex items-center justify-center w-10 h-10">...</span>
                    <Button variant="outline" className="w-10 h-10 p-0">8</Button>
                    <Button variant="outline" className="w-10 h-10 p-0 text-news-primary">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - 1/3 width on desktop */}
            <div className="space-y-8">
              {/* Weather Widget */}
              <WeatherWidget />
              
              {/* Ad Banner */}
              <AdBanner size="small" />
              
              {/* Latest News */}
              <div>
                <h2 className="text-xl font-bold mb-4">Latest News</h2>
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
      </main>
    </Layout>
  );
};

export default CategoryPage;
