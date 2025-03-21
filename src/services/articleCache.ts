
import { Article } from "@/types/article";
import { fetchLatestNews } from "@/services/newsApiService";

// Cache for API fetched articles
let apiArticles: Article[] = [];
let lastFetchTime: number = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Function to get articles from API and refresh cache if needed
export const getApiArticles = async (): Promise<Article[]> => {
  const now = Date.now();
  
  // Check if cache is stale
  if (apiArticles.length === 0 || now - lastFetchTime > CACHE_DURATION) {
    try {
      const newArticles = await fetchLatestNews();
      if (newArticles && newArticles.length > 0) {
        apiArticles = newArticles;
        lastFetchTime = now;
      }
    } catch (error) {
      console.error("Error refreshing news articles:", error);
    }
  }
  
  return apiArticles;
};
