
import { Article } from "@/data/mockData";

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

// Categories we're interested in
const NEWS_CATEGORIES = [
  "Public Safety",
  "Politics",
  "Business",
  "Education",
  "Health",
  "Environment"
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

export const fetchLatestNews = async (pageSize = 10): Promise<Article[]> => {
  try {
    // Create a query that includes Inland Empire locations
    const locationQuery = INLAND_EMPIRE_LOCATIONS.join(" OR ");
    
    const response = await fetch(
      `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(locationQuery)}&sortBy=publishedAt&pageSize=${pageSize}&language=en&apiKey=${NEWS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`News API Error: ${response.status}`);
    }
    
    const data: NewsApiResponse = await response.json();
    
    // Transform the NewsAPI response into our Article format
    return data.articles.map((article, index) => {
      // Determine the most likely category based on keywords in the title/description
      const category = determineCategoryFromContent(article.title + " " + article.description);
      
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

// Simple function to generate a slug from a title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Determine article category based on keywords in the content
const determineCategoryFromContent = (content: string): string => {
  const contentLower = content.toLowerCase();
  
  const categoryKeywords: Record<string, string[]> = {
    "Public Safety": ["police", "fire", "crime", "safety", "emergency", "accident", "sheriff", "rescue"],
    "Politics": ["council", "mayor", "election", "vote", "policy", "government", "law", "senator", "representative", "bill"],
    "Business": ["business", "economy", "market", "company", "store", "restaurant", "economic", "job", "entrepreneur"],
    "Education": ["school", "student", "teacher", "education", "college", "university", "learning", "academic", "scholarship"],
    "Health": ["health", "hospital", "doctor", "medical", "covid", "virus", "vaccine", "healthcare", "patient", "clinic"],
    "Environment": ["environment", "climate", "pollution", "energy", "sustainable", "conservation", "water", "wildlife", "recycling"]
  };
  
  // Check for keywords and count matches for each category
  const categoryScores = NEWS_CATEGORIES.reduce((acc, category) => {
    const keywords = categoryKeywords[category] || [];
    const score = keywords.reduce((total, keyword) => {
      return contentLower.includes(keyword) ? total + 1 : total;
    }, 0);
    
    acc[category] = score;
    return acc;
  }, {} as Record<string, number>);
  
  // Find the category with the highest score
  const topCategory = Object.entries(categoryScores)
    .sort((a, b) => b[1] - a[1])
    .shift();
    
  // Return the top category or default to "Public Safety" if no matches
  return topCategory && topCategory[1] > 0 ? topCategory[0] : "Public Safety";
};
