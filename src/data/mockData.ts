import { Article } from "@/types/article";
import { articles } from "@/data/mockArticles";
import { getApiArticles } from "@/services/articleCache";
import { fetchLatestNews } from "@/services/newsApiService";

// Re-export fetchLatestNews to maintain backward compatibility
export { fetchLatestNews };

// Export the Article interface for backward compatibility
export type { Article };

// Get articles by category, combining mock and API data
export const getArticlesByCategory = (category: string, includeApi: boolean = true): Article[] => {
  // Start with mock articles
  let result = articles.filter(article => article.category === category);
  
  // Add API articles if available and requested
  if (includeApi && apiArticles.length > 0) {
    const apiCategoryArticles = apiArticles.filter(article => article.category === category);
    result = [...apiCategoryArticles, ...result];
  }
  
  return result;
};

// Get featured articles, combining mock and API data
export const getFeaturedArticles = async (): Promise<Article[]> => {
  await getApiArticles(); // Ensure API articles are loaded
  
  // Combine featured articles from both sources
  const mockFeatured = articles.filter(article => article.featured);
  const apiFeatured = apiArticles.filter(article => article.featured);
  
  // Prioritize API featured articles
  return [...apiFeatured, ...mockFeatured].slice(0, 5);
};

// Get most recent articles
export const getMostRecentArticles = async (limit: number = 10): Promise<Article[]> => {
  const apiArticles = await getApiArticles(); // Ensure API articles are loaded
  
  // Combine all articles and sort by date
  const allArticles = [...apiArticles, ...articles];
  
  return allArticles
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
};

// Keep the original getRecentArticles for backward compatibility
export const getRecentArticles = (limit: number = 5): Article[] => {
  return [...articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
};

export const getArticleBySlug = (slug: string): Article | undefined => {
  // Check mock articles first
  const mockArticle = articles.find(article => article.slug === slug);
  if (mockArticle) return mockArticle;
  
  // Access the cache directly from this module
  const apiArticles = getApiArticles() as unknown as Article[]; // Cast to handle the Promise
  return apiArticles.find(article => article.slug === slug);
};

export const getRelatedArticles = (slug: string, limit: number = 3): Article[] => {
  const article = getArticleBySlug(slug);
  if (!article) return [];
  
  // Access the cache directly from this module
  const apiArticles = getApiArticles() as unknown as Article[]; // Cast to handle the Promise
  
  // Combine both sources
  const allArticles = [...apiArticles, ...articles];
  
  return allArticles
    .filter(a => a.slug !== slug && a.category === article.category)
    .slice(0, limit);
};

// Access to the apiArticles for backward compatibility
const apiArticles: Article[] = [];
