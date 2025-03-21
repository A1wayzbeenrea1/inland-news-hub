
import { Article } from "@/types/article";
import { generateSlug, determineCategoryFromContent } from "@/utils/articleUtils";
import { NEWS_CATEGORIES, CATEGORY_KEYWORDS } from "@/data/categoryKeywords";

// Using NewsAPI as our news provider
const NEWS_API_KEY = "YOUR_NEWS_API_KEY"; // Replace with your actual NewsAPI key
const NEWS_API_BASE_URL = "https://newsapi.org/v2";

// Locations in the Inland Empire to search for
const INLAND_EMPIRE_LOCATIONS = [
  "Redlands",
  "Yucaipa",
  "Rialto",
  "Ontario",
  "Loma Linda",
  "San Bernardino",
  "Riverside",
  "Fontana",
  "Rancho Cucamonga"
];

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}

interface NewsApiArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}

export const fetchLatestNews = async (): Promise<Article[]> => {
  try {
    // Create a query that includes Inland Empire locations
    const locationQuery = INLAND_EMPIRE_LOCATIONS.join(" OR ");
    
    const response = await fetch(
      `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(locationQuery)}&sortBy=publishedAt&pageSize=10&language=en&apiKey=${NEWS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`News API Error: ${response.status}`);
    }
    
    const data: NewsApiResponse = await response.json();
    
    // Transform the NewsAPI response into our Article format
    return data.articles.map((article, index) => {
      // Determine the most likely category based on keywords in the title/description
      const category = determineCategoryFromContent(
        article.title + " " + article.description, 
        NEWS_CATEGORIES, 
        CATEGORY_KEYWORDS
      );
      
      return {
        id: `api-${index}-${Date.now()}`,
        title: article.title,
        excerpt: article.description || "Read more about this story...",
        content: article.content || article.description || "",
        image: article.urlToImage || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1170&auto=format&fit=crop",
        category,
        author: article.author || article.source.name || "Staff Reporter",
        publishedAt: article.publishedAt,
        slug: generateSlug(article.title),
        featured: index < 3, // Make the first 3 articles featured
        tags: [category, "News", "Inland Empire"]
      };
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return []; // Return empty array in case of error
  }
};
