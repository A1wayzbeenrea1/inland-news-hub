
import { Article } from "@/data/mockData";
import { generateSlug, determineCategoryFromContent } from '@/services/newsApiService';
import { useToast } from "@/hooks/use-toast";

// APIs for local news sources
const LOCAL_NEWS_APIS = [
  {
    name: "Redlands Daily Facts",
    url: "https://www.redlandsdailyfacts.com/wp-json/wp/v2/posts?per_page=10",
    enabled: true,
    parser: "wordpress"
  },
  {
    name: "San Bernardino Sun",
    url: "https://www.sbsun.com/wp-json/wp/v2/posts?per_page=10",
    enabled: true,
    parser: "wordpress"
  },
  {
    name: "IE Community News",
    url: "https://iecn.com/wp-json/wp/v2/posts?per_page=10",
    enabled: true,
    parser: "wordpress"
  },
  {
    name: "Fontana Herald News",
    url: "https://www.fontanaheraldnews.com/api/most-recent/all",
    enabled: true,
    parser: "custom"
  }
];

// CORS proxy to handle cross-origin issues
const CORS_PROXY = "https://corsproxy.io/?";

// Fetch articles from a WordPress REST API
const fetchWordPressArticles = async (source: string, apiUrl: string): Promise<Article[]> => {
  try {
    console.log(`Fetching articles from ${source}...`);
    
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(apiUrl)}`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const posts = await response.json();
    
    return posts.map((post: any, index: number) => {
      // Extract content
      const content = post.content?.rendered || "";
      
      // Extract an image if available
      let imageUrl = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1170&auto=format&fit=crop";
      
      // Try to find the first image in the content
      const imgRegex = /<img[^>]+src="([^">]+)"/;
      const imgMatch = content.match(imgRegex);
      if (imgMatch && imgMatch[1]) {
        imageUrl = imgMatch[1];
      }
      
      // Try to get a featured image if available
      if (post._embedded?.["wp:featuredmedia"]?.[0]?.source_url) {
        imageUrl = post._embedded["wp:featuredmedia"][0].source_url;
      }
      
      // Extract excerpt
      let excerpt = post.excerpt?.rendered || "";
      // Clean the excerpt from HTML tags
      excerpt = excerpt.replace(/<[^>]+>/g, '').trim();
      
      // Determine category
      const category = determineCategoryFromContent(post.title.rendered + " " + excerpt);
      
      return {
        id: `wp-${source}-${index}-${Date.now()}`,
        title: post.title.rendered || "Untitled",
        excerpt: excerpt || "Read more about this story...",
        content: content,
        image: imageUrl,
        category,
        author: source,
        publishedAt: post.date || new Date().toISOString(),
        slug: generateSlug(post.title.rendered || "Untitled"),
        featured: false,
        source,
        url: post.link || "",
        tags: [category, source, "Local News"]
      };
    });
  } catch (error) {
    console.error(`Error fetching from ${source}:`, error);
    return [];
  }
};

// Fetch articles from custom API endpoints
const fetchCustomArticles = async (source: string, apiUrl: string): Promise<Article[]> => {
  try {
    console.log(`Fetching articles from ${source} (custom parser)...`);
    
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(apiUrl)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Different sources might have different data structures
    // This is a generic handler that attempts to find articles in common formats
    let articles = [];
    
    // Try to find articles array in the response data
    const articlesData = data.articles || data.posts || data.items || data.results || [];
    
    articles = articlesData.map((article: any, index: number) => {
      // Extract field values with fallbacks for different API structures
      const title = article.title || article.headline || "Untitled";
      const content = article.content || article.body || article.text || "";
      let excerpt = article.excerpt || article.summary || article.description || "";
      const imageUrl = article.image || article.featured_image || article.thumbnail || 
                      article.imageUrl || article.image_url || 
                      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1170&auto=format&fit=crop";
      const publishedAt = article.date || article.publishedAt || article.published_at || new Date().toISOString();
      const articleUrl = article.url || article.link || "";
      
      // Clean excerpt if it's HTML
      excerpt = excerpt.replace(/<[^>]+>/g, '').trim();
      
      // Determine category based on title and excerpt
      const category = determineCategoryFromContent(title + " " + excerpt);
      
      return {
        id: `custom-${source}-${index}-${Date.now()}`,
        title,
        excerpt: excerpt || "Read more about this story...",
        content,
        image: imageUrl,
        category,
        author: article.author || source,
        publishedAt,
        slug: generateSlug(title),
        featured: false,
        source,
        url: articleUrl,
        tags: [category, source, "Local News"]
      };
    });
    
    return articles;
  } catch (error) {
    console.error(`Error fetching from ${source} (custom):`, error);
    return [];
  }
};

// Fetch articles from all configured sources
export const fetchLocalNewsArticles = async (): Promise<Article[]> => {
  try {
    console.log("Fetching articles from all local news sources...");
    
    const articlePromises = LOCAL_NEWS_APIS
      .filter(api => api.enabled)
      .map(api => {
        if (api.parser === "wordpress") {
          return fetchWordPressArticles(api.name, api.url);
        } else {
          return fetchCustomArticles(api.name, api.url);
        }
      });
    
    const results = await Promise.all(articlePromises);
    
    // Combine all articles and sort by published date (newest first)
    const allArticles = results.flat().sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
    
    console.log(`Fetched ${allArticles.length} articles from local news sources`);
    
    return allArticles;
  } catch (error) {
    console.error("Error fetching local news articles:", error);
    return [];
  }
};

// Schedule regular fetching of articles (e.g., every hour)
export const scheduleLocalNewsFetching = (callback: (articles: Article[]) => void, intervalMinutes: number = 60) => {
  console.log(`Setting up local news fetching every ${intervalMinutes} minutes`);
  
  // Initial fetch
  fetchLocalNewsArticles().then(callback);
  
  // Set up regular fetching
  const intervalId = setInterval(() => {
    console.log("Automatically fetching local news articles");
    fetchLocalNewsArticles().then(callback);
  }, intervalMinutes * 60 * 1000);
  
  return intervalId;
};
