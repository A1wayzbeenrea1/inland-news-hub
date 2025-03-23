
import { useState, useEffect, useRef } from 'react';
import { getFeaturedArticles, getArticlesByCategory, Article } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { setupRssFeedRefresh } from '@/services/rssFeedService';
import { scheduleLocalNewsFetching } from '@/services/localNewsApiService';

export const useNewsData = () => {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [categoryArticles, setCategoryArticles] = useState<{ [key: string]: Article[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const { toast } = useToast();
  const rssFeedIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const localNewsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const loadAsyncData = async () => {
      if (!isInitialLoad.current && loadingComplete) return;
      
      setIsLoading(true);
      
      try {
        const forceRefresh = localStorage.getItem("forceRefresh");
        const shouldForceRefresh = forceRefresh && (Date.now() - parseInt(forceRefresh)) < 10000;
        
        const results = await Promise.all([
          getFeaturedArticles(),
          getArticlesByCategory('Public Safety'),
          getArticlesByCategory('Education'),
          getArticlesByCategory('Politics'),
          getArticlesByCategory('Business')
        ]).catch(err => {
          console.error("Error fetching articles:", err);
          toast({
            title: "Failed to fetch articles",
            description: "There was a problem retrieving the latest stories. Using cached data if available.",
            variant: "destructive"
          });
          return [[], [], [], [], []];
        });
        
        const [
          featuredArticlesData,
          publicSafetyArticles,
          educationArticles,
          politicsArticles,
          businessArticles
        ] = results;
        
        const adminStories = localStorage.getItem("adminStories");
        if (adminStories) {
          try {
            const parsedStories = JSON.parse(adminStories);
            console.log(`Index: Found ${parsedStories.length} admin stories in localStorage`);
          } catch (parseError) {
            console.error("Error parsing admin stories:", parseError);
          }
        }
        
        setFeaturedArticles(featuredArticlesData || []);
        setCategoryArticles({
          'Public Safety': publicSafetyArticles || [],
          'Education': educationArticles || [],
          'Politics': politicsArticles || [],
          'Business': businessArticles || [],
        });
        
        if (shouldForceRefresh) {
          localStorage.removeItem("forceRefresh");
        }
        
        setLoadingComplete(true);
        isInitialLoad.current = false;
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Loading Error",
          description: "Could not load articles. Please try refreshing the page.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAsyncData();
    
    // Setup RSS feed refresh
    if (!rssFeedIntervalRef.current) {
      rssFeedIntervalRef.current = setupRssFeedRefresh(handleNewArticles, 26.25);
    }
    
    // Setup Local News API refresh
    if (!localNewsIntervalRef.current) {
      localNewsIntervalRef.current = scheduleLocalNewsFetching(handleNewArticles, 60); // Check every hour
    }
    
    return () => {
      if (rssFeedIntervalRef.current !== null) {
        clearInterval(rssFeedIntervalRef.current);
        rssFeedIntervalRef.current = null;
      }
      
      if (localNewsIntervalRef.current !== null) {
        clearInterval(localNewsIntervalRef.current);
        localNewsIntervalRef.current = null;
      }
    };
  }, [toast]);
  
  // Handler for new articles from any source
  const handleNewArticles = async (newArticles: Article[]) => {
    console.log(`Received ${newArticles.length} new articles from external source`);
    
    try {
      // Refresh all categories
      const results = await Promise.all([
        getFeaturedArticles(),
        getArticlesByCategory('Public Safety'),
        getArticlesByCategory('Education'),
        getArticlesByCategory('Politics'),
        getArticlesByCategory('Business')
      ]).catch(err => {
        console.error("Error refreshing articles:", err);
        return null;
      });
      
      if (results) {
        const [
          featuredArticlesData,
          publicSafetyArticles,
          educationArticles,
          politicsArticles,
          businessArticles
        ] = results;
        
        setFeaturedArticles(featuredArticlesData || []);
        setCategoryArticles({
          'Public Safety': publicSafetyArticles || [],
          'Education': educationArticles || [],
          'Politics': politicsArticles || [],
          'Business': businessArticles || [],
        });
        
        console.log("Articles refreshed with latest content");
      }
    } catch (error) {
      console.error("Error during article refresh:", error);
    }
  };

  return {
    featuredArticles,
    categoryArticles,
    isLoading,
    loadingComplete
  };
};
