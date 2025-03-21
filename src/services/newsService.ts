
import { Article } from '@/data/mockData';

const API_KEY = 'YOUR_NEWS_API_KEY'; // Replace with your actual API key when in production
const BASE_URL = 'https://newsapi.org/v2';

// Categories mapping between external API and our internal categories
const CATEGORY_MAPPING: Record<string, string> = {
  'crime': 'Public Safety',
  'police': 'Public Safety',
  'fire': 'Public Safety',
  'emergency': 'Public Safety',
  'election': 'Politics',
  'government': 'Politics',
  'political': 'Politics',
  'economy': 'Business',
  'company': 'Business',
  'financial': 'Business',
  'school': 'Education',
  'university': 'Education',
  'student': 'Education',
  'medical': 'Health',
  'hospital': 'Health',
  'disease': 'Health',
  'climate': 'Environment',
  'pollution': 'Environment',
  'conservation': 'Environment'
};

// SEO optimization function for titles
export const optimizeTitle = (title: string): string => {
  // Remove unnecessary words and characters
  let optimized = title.replace(/^(breaking|just in|update|exclusive):\s*/i, '');
  
  // Capitalize first letter of each word except articles and prepositions
  optimized = optimized.replace(/\w\S*/g, (txt) => {
    const lowerCaseWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'with', 'in', 'of'];
    return lowerCaseWords.includes(txt.toLowerCase()) ? txt.toLowerCase() : txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
  
  // Always capitalize first word
  optimized = optimized.charAt(0).toUpperCase() + optimized.slice(1);
  
  return optimized;
};

// Determine the best category based on title and description
export const categorizeArticle = (title: string, description: string): string => {
  const combinedText = `${title} ${description}`.toLowerCase();
  
  // Count category matches
  const categoryScores: Record<string, number> = {};
  
  Object.entries(CATEGORY_MAPPING).forEach(([keyword, category]) => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = (combinedText.match(regex) || []).length;
    
    if (matches > 0) {
      categoryScores[category] = (categoryScores[category] || 0) + matches;
    }
  });
  
  // Find category with highest score
  let bestCategory = 'General';
  let highestScore = 0;
  
  Object.entries(categoryScores).forEach(([category, score]) => {
    if (score > highestScore) {
      highestScore = score;
      bestCategory = category;
    }
  });
  
  return bestCategory;
};

// Fetch articles from NewsAPI
export const fetchLatestNews = async (location: string = 'inland empire,redlands,yucaipa,ontario,san bernardino'): Promise<Article[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/everything?q=${encodeURIComponent(location)}&sortBy=publishedAt&pageSize=10&apiKey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    
    const data = await response.json();
    
    // Transform API response to our Article format
    return data.articles.map((article: any, index: number) => {
      const category = categorizeArticle(article.title, article.description);
      
      return {
        id: `external-${Date.now()}-${index}`,
        title: optimizeTitle(article.title),
        excerpt: article.description || 'No description available',
        content: article.content || 'Full content not available',
        image: article.urlToImage || 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        category: category,
        author: article.author || 'News Service',
        publishedAt: article.publishedAt,
        slug: `external-${Date.now()}-${index}`,
        source: article.source?.name || 'External Source',
        sourceUrl: article.url,
        isExternal: true
      };
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};
