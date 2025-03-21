
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdBanner } from '@/components/layout/AdBanner';
import { ArticleCard } from '@/components/news/ArticleCard';
import { NewsletterSignup } from '@/components/news/NewsletterSignup';
import { WeatherWidget } from '@/components/news/WeatherWidget';
import { CategoryHeader } from '@/components/news/CategoryHeader';
import { MetaTags } from '@/components/common/MetaTags';
import { getRecentArticles } from '@/data/mockData';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Article } from '@/types/article';

// Mock community-specific articles - in a real app, this would come from an API
const communityArticles = {
  'redlands': [
    {
      id: '1',
      title: 'State order aids Redlands firefighters battling wildfires',
      excerpt: 'Days after the new year began, several Los Angeles counties erupted into flames. Three volatile wildfires — Palisades, Eaton and Hurst — captured national attention.',
      image: '/lovable-uploads/0b362b4a-4021-433f-a6ae-b2d6b9238105.png',
      category: 'Public Safety',
      author: 'Israel J. Cerreno Jr.',
      publishedAt: '2023-07-10T08:00:00Z',
      slug: 'state-order-aids-redlands-firefighters'
    },
    {
      id: '5',
      title: 'Redlands City Council approves downtown development plan',
      excerpt: 'After months of public hearings and community input, the Redlands City Council has approved an ambitious redevelopment plan for the city\'s historic downtown district.',
      image: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      category: 'Politics',
      author: 'Rachel Kim',
      publishedAt: '2023-07-06T16:45:00Z',
      slug: 'redlands-city-council-approves-downtown-development-plan'
    },
    {
      id: '9',
      title: 'Redlands Fire Department assist with LA fires',
      excerpt: 'As flames roared across the Los Angeles hills, painting the night sky a vivid orange, Redlands Fire Department Captain Brent Fuller stood shoulder to shoulder with his crew.',
      image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      category: 'Public Safety',
      author: 'Emily Walker',
      publishedAt: '2023-07-02T09:40:00Z',
      slug: 'redlands-fire-department-assist-with-la-fires'
    }
  ],
  'yucaipa': [
    {
      id: '3',
      title: 'Yucaipa High School robotics team advances to national championship',
      excerpt: 'The Yucaipa High School robotics team, the "ThunderBots," has qualified for the FIRST Robotics Competition National Championship after their impressive performance at the Southern California Regional.',
      image: 'https://images.unsplash.com/photo-1589254065909-b7086229d08c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      category: 'Education',
      author: 'Jennifer Chen',
      publishedAt: '2023-07-08T09:15:00Z',
      slug: 'yucaipa-high-school-robotics-team-advances-to-national-championship'
    },
    {
      id: '7',
      title: 'Local vineyard wins prestigious international wine competition',
      excerpt: 'Oak Mountain Winery in Yucaipa has put the Inland Empire on the global wine map after winning a gold medal at the International Wine Competition in Bordeaux, France.',
      image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      category: 'Business',
      author: 'Sophia Martinez',
      publishedAt: '2023-07-04T10:00:00Z',
      slug: 'local-vineyard-wins-prestigious-international-wine-competition'
    }
  ],
  'rialto': [
    {
      id: '6',
      title: 'Rialto school district announces new STEM program partnership',
      excerpt: 'The Rialto Unified School District has entered into a partnership with several technology companies to enhance STEM education opportunities for students across all grade levels.',
      image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      category: 'Education',
      author: 'Thomas Johnson',
      publishedAt: '2023-07-05T13:10:00Z',
      slug: 'rialto-school-district-announces-new-stem-program-partnership'
    }
  ],
  'ontario': [
    {
      id: '4',
      title: 'Ontario International Airport reports record passenger growth',
      excerpt: 'Ontario International Airport (ONT) has reported a 12.8% increase in passenger traffic for the second quarter of 2023 compared to the same period last year, marking the airport\'s strongest growth since before the pandemic.',
      image: 'https://images.unsplash.com/photo-1588412079626-704311e1fa45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      category: 'Business',
      author: 'David Washington',
      publishedAt: '2023-07-07T11:20:00Z',
      slug: 'ontario-international-airport-reports-record-passenger-growth'
    },
    {
      id: '10',
      title: 'New affordable housing development breaks ground in Ontario',
      excerpt: 'Construction has begun on Parkview Commons, a 120-unit affordable housing development in south Ontario that aims to address the growing housing crisis in the Inland Empire.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      category: 'Politics',
      author: 'Marcus Johnson',
      publishedAt: '2023-07-01T12:15:00Z',
      slug: 'new-affordable-housing-development-breaks-ground-in-ontario'
    }
  ],
  'loma-linda': [
    {
      id: '2',
      title: 'Armed suspect threat triggers Loma Linda lockdown',
      excerpt: 'The San Bernardino County Sheriff\'s Department (SBCSD) responded to a possible armed subject at the Loma Linda University Children\'s Hospital on the evening of March 12.',
      image: 'https://images.unsplash.com/photo-1612821745127-bd9658171f5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      category: 'Public Safety',
      author: 'Michael Rodriguez',
      publishedAt: '2023-07-09T14:30:00Z',
      slug: 'armed-suspect-threat-triggers-loma-linda-lockdown'
    }
  ]
};

// Community information for the page headers
const communityInfo = {
  'redlands': {
    name: 'Redlands',
    description: 'Latest news, events and updates from Redlands, California',
    population: '71,513',
    established: '1888',
    image: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
  },
  'yucaipa': {
    name: 'Yucaipa',
    description: 'Stay informed with the latest happenings in Yucaipa',
    population: '54,542',
    established: '1989',
    image: 'https://images.unsplash.com/photo-1589254065909-b7086229d08c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
  },
  'rialto': {
    name: 'Rialto',
    description: 'News and information for the Rialto community',
    population: '103,132',
    established: '1911',
    image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
  },
  'ontario': {
    name: 'Ontario',
    description: 'Covering Ontario with the news that matters to you',
    population: '175,265',
    established: '1891',
    image: 'https://images.unsplash.com/photo-1588412079626-704311e1fa45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
  },
  'loma-linda': {
    name: 'Loma Linda',
    description: 'Local news and updates from Loma Linda',
    population: '23,928',
    established: '1970',
    image: 'https://images.unsplash.com/photo-1612821745127-bd9658171f5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
  }
};

const CommunityPage = () => {
  const { community } = useParams<{ community: string }>();
  const communityKey = community || '';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  
  // Add safety checks to prevent errors
  const info = communityInfo[communityKey as keyof typeof communityInfo];
  const articles = communityKey ? communityArticles[communityKey as keyof typeof communityArticles] || [] : [];
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Simulate loading and fetch latest articles
    setLoading(true);
    
    const fetchLatestArticles = async () => {
      try {
        const recentArticles = await getRecentArticles(5);
        // Make sure we don't include duplicates
        const filteredArticles = recentArticles.filter(article => {
          if (!articles || !Array.isArray(articles)) return true;
          return !articles.some(a => a.id === article.id);
        });
        
        setLatestArticles(filteredArticles);
      } catch (error) {
        console.error("Error fetching latest articles:", error);
        setLatestArticles([]);
      } finally {
        // Finish loading after a short delay
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };
    
    fetchLatestArticles();
  }, [community, info, articles]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-news-primary border-t-transparent rounded-full"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!info) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <MetaTags
          title="Community Not Found | Inland Empire News"
          description="The community page you are looking for doesn't exist or isn't covered by our news service yet."
        />
        <main className="flex-grow container px-4 py-8 mx-auto">
          <h1 className="text-3xl font-bold">Community Not Found</h1>
          <p className="mt-4">The community you're looking for doesn't exist or isn't covered by our news service yet.</p>
          <Link to="/" className="mt-6 inline-block text-news-primary hover:underline">
            Return to homepage
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Feedspot widget markup
  const feedspotWidget = (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h2 className="text-xl font-bold mb-4">Redlands News Feed</h2>
      <div className="aspect-auto w-full overflow-hidden">
        <iframe 
          className="w-full"
          title="Redlands News Feed"
          frameBorder="0" 
          allow="autoplay; encrypted-media" 
          allowFullScreen 
          scrolling="no"
          style={{ height: '476px' }}
          src="https://www.feedspot.com/widgets/lookup/vciG7f40a3c5"
        ></iframe>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <MetaTags
        title={`${info.name} News | Inland Empire News`}
        description={info.description}
        canonicalUrl={`https://inlandempire.news/community/${communityKey}`}
        ogType="website"
        ogImage={info.image}
      />
      
      <main className="flex-grow">
        {/* Community Hero Section */}
        <div 
          className="relative bg-cover bg-center h-64 md:h-80"
          style={{ backgroundImage: `url(${info.image})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8 relative z-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-serif">{info.name}</h1>
            <p className="text-white/90 mt-2 max-w-2xl">{info.description}</p>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-white/80">
              <span>Population: {info.population}</span>
              <span>•</span>
              <span>Established: {info.established}</span>
            </div>
          </div>
        </div>

        <div className="container px-4 py-8 mx-auto">
          {/* Featured Article */}
          {articles && articles.length > 0 && (
            <>
              <CategoryHeader 
                title="Latest Community News" 
                description={`The most recent news and updates from ${info.name}`}
              />
              
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
                {articles && articles.length > 1 ? (
                  <>
                    <h2 className="text-xl font-bold mb-4">More {info.name} Stories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {articles.slice(1).map((article) => (
                        <ArticleCard 
                          key={article.id} 
                          article={article} 
                          variant="default"
                        />
                      ))}
                    </div>
                  </>
                ) : articles && articles.length === 0 ? (
                  <div className="p-6 bg-white rounded-lg shadow-sm border">
                    <h2 className="text-xl font-bold mb-2">No Recent Stories</h2>
                    <p className="text-gray-600">
                      We're working on bringing you the latest news from {info.name}. Check back soon for updates!
                    </p>
                  </div>
                ) : null}
              </div>

              {/* Community Information Card */}
              <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
                <h2 className="text-xl font-bold mb-4">About {info.name}</h2>
                <p className="text-gray-700 mb-4">
                  {info.name} is a vibrant community in the Inland Empire region of Southern California. 
                  With a population of approximately {info.population}, the city was established in {info.established} 
                  and continues to be an important part of San Bernardino County.
                </p>
                <p className="text-gray-700">
                  Our news team is dedicated to bringing you the most relevant and up-to-date information 
                  about events, developments, and stories that matter to {info.name} residents.
                </p>
              </div>
              
              {/* Feedspot Widget - Only show for Redlands */}
              {communityKey === 'redlands' && (
                <div className="mb-8">
                  {feedspotWidget}
                </div>
              )}
            </div>

            {/* Sidebar - 1/3 width on desktop */}
            <div className="space-y-8">
              {/* Weather Widget */}
              <WeatherWidget location={info.name} />
              
              {/* Ad Banner */}
              <AdBanner size="small" />
              
              {/* Latest News from other communities */}
              <div>
                <h2 className="text-xl font-bold mb-4">Latest Inland Empire News</h2>
                <div className="space-y-4">
                  {latestArticles.slice(0, 5).map((article) => (
                    <ArticleCard 
                      key={article.id} 
                      article={article} 
                      variant="minimal"
                    />
                  ))}
                </div>
              </div>
              
              {/* Newsletter Signup */}
              <NewsletterSignup 
                title={`Get ${info.name} News`} 
                description={`Subscribe to receive the latest news from ${info.name} directly to your inbox.`}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CommunityPage;
