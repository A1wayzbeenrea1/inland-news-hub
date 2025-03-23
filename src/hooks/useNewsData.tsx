
import { useState, useEffect, useRef } from 'react';
import { getFeaturedArticles, getArticlesByCategory, Article } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { setupRssFeedRefresh } from '@/services/rssFeedService';

export const useNewsData = () => {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [categoryArticles, setCategoryArticles] = useState<{ [key: string]: Article[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const { toast } = useToast();
  const rssFeedIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
    
    if (!rssFeedIntervalRef.current) {
      rssFeedIntervalRef.current = setupRssFeedRefresh(async () => {
        console.log("RSS feeds refreshed, reloading articles");
        
        try {
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
          }
        } catch (error) {
          console.error("Error during RSS refresh:", error);
          toast({
            title: "RSS Feed Error",
            description: "Failed to refresh content. Will retry automatically.",
            variant: "destructive"
          });
        }
      }, 26.25);
    }
    
    return () => {
      if (rssFeedIntervalRef.current !== null) {
        clearInterval(rssFeedIntervalRef.current);
        rssFeedIntervalRef.current = null;
      }
    };
  }, [toast]);

  return {
    featuredArticles,
    categoryArticles,
    isLoading,
    loadingComplete
  };
};
