
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Share2, Printer, BookmarkPlus, Calendar, User, Clock, Facebook, Twitter, Linkedin, Copy, CheckCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdBanner } from '@/components/layout/AdBanner';
import { ArticleCard } from '@/components/news/ArticleCard';
import { NewsletterSignup } from '@/components/news/NewsletterSignup';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { getArticleBySlug, getRelatedArticles, getArticlesByCategory, Article as ArticleType } from '@/data/mockData';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { MetaTags } from '@/components/common/MetaTags';

const Article = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<ArticleType[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const loadArticle = () => {
      setLoading(true);
      
      // First try to get from regular articles
      let foundArticle = getArticleBySlug(slug || '');
      
      // If not found, check localStorage for admin stories
      if (!foundArticle && slug) {
        const adminStories = localStorage.getItem("adminStories");
        if (adminStories) {
          try {
            const stories = JSON.parse(adminStories) as ArticleType[];
            foundArticle = stories.find(story => story.slug === slug);
            
            if (foundArticle) {
              console.log("Found admin story in localStorage:", foundArticle.title);
            }
          } catch (error) {
            console.error("Error parsing admin stories:", error);
          }
        }
      }
      
      if (foundArticle) {
        setArticle(foundArticle);
        // Get related articles based on the category
        setRelatedArticles(getRelatedArticles(slug || '', 3));
      } else if (slug) {
        navigate('/not-found');
      }
      
      setLoading(false);
    };
    
    loadArticle();
  }, [navigate, slug]);

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

  const handleCopyLink = () => {
    const articleUrl = `${window.location.origin}/article/${slug}`;
    navigator.clipboard.writeText(articleUrl);
    setCopied(true);
    
    toast({
      title: "Link copied to clipboard",
      description: "You can now share this article with others",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnSocialMedia = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    if (!article) return;
    
    const articleUrl = encodeURIComponent(`${window.location.origin}/article/${slug}`);
    const title = encodeURIComponent(article.title);
    const hashtags = encodeURIComponent('InlandEmpireNews,LocalNews');
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${articleUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${articleUrl}&text=${title}&hashtags=${hashtags}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${articleUrl}`;
        break;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-news-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!article) return null;

  // Generate a simplified text-only version for social media
  const socialMediaContent = `${article.title}\n\n${article.excerpt}\n\nRead more at: ${window.location.origin}/article/${slug}`;

  return (
    <>
      <MetaTags 
        title={`${article.title} | Inland Empire News Hub`}
        description={article.excerpt}
        ogImage={article.image}
        ogType="article"
      />
      
      <Header />
      
      <main className="flex-grow">
        <div className="container px-4 py-8 mx-auto">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-news-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link to={`/category/${article.category.toLowerCase().replace(' ', '-')}`} className="hover:text-news-primary">
              {article.category}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700 truncate">{article.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <Link 
                  to={`/category/${article.category.toLowerCase().replace(' ', '-')}`}
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
                  {article.source && (
                    <div className="flex items-center">
                      <span className="text-news-primary">Source: {article.source}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="aspect-[16/9] w-full overflow-hidden rounded-lg mb-6">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="h-full w-full object-cover"
                />
              </div>

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
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="text-gray-600">
                        <Share2 size={16} className="mr-1" /> Share
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2">
                      <div className="flex flex-col space-y-2">
                        <div className="text-sm font-medium text-gray-900 mb-2">Share this article</div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-[#1877F2] text-white hover:bg-[#0E5FC0] hover:text-white"
                            onClick={() => shareOnSocialMedia('facebook')}
                          >
                            <Facebook size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-[#1DA1F2] text-white hover:bg-[#0E8BD8] hover:text-white"
                            onClick={() => shareOnSocialMedia('twitter')}
                          >
                            <Twitter size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-[#0A66C2] text-white hover:bg-[#084d93] hover:text-white"
                            onClick={() => shareOnSocialMedia('linkedin')}
                          >
                            <Linkedin size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className={copied ? "bg-green-500 text-white" : ""}
                            onClick={handleCopyLink}
                          >
                            {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                          </Button>
                        </div>
                        <textarea 
                          className="w-full p-2 text-xs text-gray-700 border border-gray-300 rounded-md mt-2"
                          rows={4}
                          value={socialMediaContent}
                          readOnly
                          onClick={(e) => e.currentTarget.select()}
                        />
                        <div className="text-xs text-gray-500">
                          *Copy the text above for social media posts or emails
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <Button variant="outline" size="sm" className="text-gray-600" onClick={() => window.print()}>
                    <Printer size={16} className="mr-1" /> Print
                  </Button>
                  <Button variant="outline" size="sm" className="text-gray-600">
                    <BookmarkPlus size={16} className="mr-1" /> Save
                  </Button>
                </div>
              </div>

              <div 
                className="prose prose-lg max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

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
                {article.tags && article.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Separator className="my-8" />

              <div className="bg-gray-100 p-4 rounded-lg mb-8">
                <h3 className="font-bold text-lg mb-2">About the Author</h3>
                <p className="text-gray-700">
                  {article.author} is a staff writer covering {article.category.toLowerCase()} for the Inland Empire News Hub.
                  Have a tip or story idea? Contact them at {article.author.toLowerCase().replace(' ', '.')}@inlandnewshub.com.
                </p>
              </div>

              <AdBanner size="medium" className="mb-8" />

              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <AdBanner size="small" />
              
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
              
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Article;
