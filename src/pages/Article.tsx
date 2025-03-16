
import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Share2, Printer, BookmarkPlus, Calendar, User, Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdBanner } from '@/components/layout/AdBanner';
import { ArticleCard } from '@/components/news/ArticleCard';
import { NewsletterSignup } from '@/components/news/NewsletterSignup';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { getArticleBySlug, getRelatedArticles } from '@/data/mockData';

const Article = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const article = getArticleBySlug(slug || '');
  const relatedArticles = getRelatedArticles(slug || '', 3);
  
  // Format the date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // If article not found, redirect to 404
    if (!article && slug) {
      navigate('/not-found');
    }
  }, [article, navigate, slug]);

  if (!article) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <div className="container px-4 py-8 mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-news-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link to={`/${article.category.toLowerCase().replace(' ', '-')}`} className="hover:text-news-primary">
              {article.category}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700 truncate">{article.title}</span>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - 2/3 width on desktop */}
            <div className="lg:col-span-2">
              {/* Article Header */}
              <div className="mb-6">
                <Link 
                  to={`/${article.category.toLowerCase().replace(' ', '-')}`}
                  className="inline-block mb-2"
                >
                  <Badge className="bg-news-secondary hover:bg-news-primary border-none text-sm">
                    {article.category}
                  </Badge>
                </Link>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-news-dark font-serif mb-4">
                  {article.title}
                </h1>
                <p className="text-lg text-gray-600 mb-4">{article.excerpt}</p>
                <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4 mb-4">
                  <div className="flex items-center">
                    <User size={16} className="mr-1" />
                    <span>By {article.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Article Image */}
              <div className="aspect-[16/9] w-full overflow-hidden rounded-lg mb-6">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Article Actions */}
              <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-gray-600"
                  onClick={() => navigate(-1)}
                >
                  <ChevronLeft size={16} className="mr-1" /> Back
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="text-gray-600">
                    <Share2 size={16} className="mr-1" /> Share
                  </Button>
                  <Button variant="outline" size="sm" className="text-gray-600">
                    <Printer size={16} className="mr-1" /> Print
                  </Button>
                  <Button variant="outline" size="sm" className="text-gray-600">
                    <BookmarkPlus size={16} className="mr-1" /> Save
                  </Button>
                </div>
              </div>

              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                <Badge variant="outline" className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                  {article.category}
                </Badge>
                <Badge variant="outline" className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                  Inland Empire
                </Badge>
                <Badge variant="outline" className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                  Local News
                </Badge>
              </div>

              <Separator className="my-8" />

              {/* Author Info */}
              <div className="bg-gray-100 p-4 rounded-lg mb-8">
                <h3 className="font-bold text-lg mb-2">About the Author</h3>
                <p className="text-gray-700">
                  {article.author} is a staff writer covering {article.category.toLowerCase()} for the Inland Empire News Hub.
                  Have a tip or story idea? Contact them at {article.author.toLowerCase().replace(' ', '.')}@inlandnewshub.com.
                </p>
              </div>

              {/* Ad Banner */}
              <AdBanner size="medium" className="mb-8" />

              {/* Related Articles */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - 1/3 width on desktop */}
            <div className="space-y-8">
              {/* Ad Banner */}
              <AdBanner size="small" />
              
              {/* Latest News in Category */}
              <div>
                <h2 className="text-xl font-bold mb-4">More from {article.category}</h2>
                <div className="space-y-4">
                  {getArticlesByCategory(article.category).slice(0, 5).map((article) => (
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

export default Article;
