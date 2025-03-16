
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdBanner } from '@/components/layout/AdBanner';
import { TopStories } from '@/components/news/TopStories';
import { ArticleCard } from '@/components/news/ArticleCard';
import { CategoryHeader } from '@/components/news/CategoryHeader';
import { WeatherWidget } from '@/components/news/WeatherWidget';
import { NewsletterSignup } from '@/components/news/NewsletterSignup';
import { EventsCalendar } from '@/components/news/EventsCalendar';
import { getFeaturedArticles, getArticlesByCategory, getRecentArticles } from '@/data/mockData';

const Index = () => {
  const featuredArticles = getFeaturedArticles();
  const publicSafetyArticles = getArticlesByCategory('Public Safety');
  const politicsArticles = getArticlesByCategory('Politics');
  const businessArticles = getArticlesByCategory('Business');
  const educationArticles = getArticlesByCategory('Education');
  const latestArticles = getRecentArticles(5);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <div className="container px-4 py-8 mx-auto">
          {/* Featured Top Stories Slider */}
          <TopStories articles={featuredArticles} className="mb-8" />
          
          {/* Ad Banner */}
          <AdBanner size="large" className="my-8" />

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
      </main>

      <Footer />
    </div>
  );
};

export default Index;
