
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdBanner } from '@/components/layout/AdBanner';
import { ArticleCard } from '@/components/news/ArticleCard';
import { NewsletterSignup } from '@/components/news/NewsletterSignup';
import { WeatherWidget } from '@/components/news/WeatherWidget';
import { Separator } from '@/components/ui/separator';
import { getArticlesByCategory, getRecentArticles } from '@/data/mockData';
import { Article } from '@/types/article';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const formattedCategory = category
    ? category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : '';
  
  const articles = getArticlesByCategory(formattedCategory);
  const latestArticles = getRecentArticles(5);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [category]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
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

      <Footer />
    </div>
  );
};

export default CategoryPage;
