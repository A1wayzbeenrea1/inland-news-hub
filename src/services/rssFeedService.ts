
import { Article } from "@/data/mockData";
import { generateSlug, determineCategoryFromContent } from "@/services/newsApiService";

interface RssFeed {
  title: string;
  url: string;
  active: boolean;
}

// List of RSS feeds to monitor
export const RSS_FEEDS: RssFeed[] = [
  { 
    title: "Press Enterprise - Yucaipa", 
    url: "https://www.pressenterprise.com/location/california/san-bernardino-county/yucaipa/feed/",
    active: true
  },
  { 
    title: "KTLA - Yucaipa", 
    url: "https://ktla.com/tag/yucaipa/feed/",
    active: true
  },
  { 
    title: "News Mirror - Local News", 
    url: "https://www.newsmirror.net/search/?,f=rss&t=article&c=news/local&l=50&s=start_time&sd=desc",
    active: true
  }
];

// CORS proxy for accessing RSS feeds (needed for browser-based requests)
const CORS_PROXY = "https://corsproxy.io/?";

/**
 * Parse an RSS feed XML string into a standardized format
 */
const parseRssFeed = (xml: string, source: string): Article[] => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    const items = xmlDoc.querySelectorAll("item");
    
    const articles: Article[] = [];
    
    items.forEach((item, index) => {
      // Extract basic content
      const title = item.querySelector("title")?.textContent || "Untitled Article";
      const link = item.querySelector("link")?.textContent || "";
      const pubDate = item.querySelector("pubDate")?.textContent || new Date().toISOString();
      
      // Try different content fields as different RSS feeds use different formats
      let content = item.querySelector("content\\:encoded")?.textContent || 
                   item.querySelector("description")?.textContent || 
                   item.querySelector("content")?.textContent || 
                   "No content available";
                   
      // Try to extract an image URL from content
      let imageUrl = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1170&auto=format&fit=crop";
      
      // Extract image from content if possible
      const imgRegex = /<img[^>]+src="([^">]+)"/;
      const imgMatch = content.match(imgRegex);
      if (imgMatch && imgMatch[1]) {
        imageUrl = imgMatch[1];
      }
      
      // Extract an excerpt (first paragraph or first 150 chars)
      let excerpt = "";
      const paragraphRegex = /<p>(.*?)<\/p>/;
      const paragraphMatch = content.match(paragraphRegex);
      if (paragraphMatch && paragraphMatch[1]) {
        excerpt = paragraphMatch[1].replace(/<[^>]+>/g, '').trim(); // Remove any HTML tags
      } else {
        // Just take the first 150 chars and strip HTML
        excerpt = content.replace(/<[^>]+>/g, '').trim().substring(0, 150) + "...";
      }
      
      // Generate a unique ID for the article
      const id = `rss-${source}-${index}-${Date.now()}`;
      
      // Determine appropriate category based on content
      const category = determineCategoryFromContent(title + " " + excerpt);
      
      // Format the date properly
      const publishedAt = new Date(pubDate).toISOString();
      
      // Create the article object
      const article: Article = {
        id,
        title,
        excerpt,
        content,
        image: imageUrl,
        category,
        author: source,
        publishedAt,
        slug: generateSlug(title),
        featured: false, // Set default value for featured
        source: source,
        tags: [category, source, "RSS", "Inland Empire"]
      };
      
      articles.push(article);
    });
    
    return articles;
  } catch (error) {
    console.error(`Error parsing RSS feed from ${source}:`, error);
    return [];
  }
};

/**
 * Fetch an RSS feed from the provided URL
 */
const fetchRssFeed = async (feedInfo: RssFeed): Promise<Article[]> => {
  if (!feedInfo.active) {
    console.log(`Feed ${feedInfo.title} is inactive, skipping`);
    return [];
  }
  
  try {
    console.log(`Fetching RSS feed: ${feedInfo.title} from ${feedInfo.url}`);
    
    // Use CORS proxy to avoid cross-origin issues
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(feedInfo.url)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const xml = await response.text();
    const articles = parseRssFeed(xml, feedInfo.title);
    
    console.log(`Fetched ${articles.length} articles from ${feedInfo.title}`);
    return articles;
  } catch (error) {
    console.error(`Failed to fetch RSS feed from ${feedInfo.title}:`, error);
    return [];
  }
};

/**
 * Fetch all RSS feeds and combine the results
 */
export const fetchAllRssFeeds = async (): Promise<Article[]> => {
  try {
    console.log("Fetching all RSS feeds...");
    
    // Fetch all feeds in parallel
    const feedPromises = RSS_FEEDS.map(feed => fetchRssFeed(feed));
    const feedResults = await Promise.all(feedPromises);
    
    // Combine all articles
    const allArticles = feedResults.flat();
    
    console.log(`Fetched a total of ${allArticles.length} articles from all RSS feeds`);
    
    // Sort by published date (newest first)
    return allArticles.sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  } catch (error) {
    console.error("Error fetching RSS feeds:", error);
    return [];
  }
};

// Function to set up automatic refreshing of RSS feeds
export const setupRssFeedRefresh = (callback: (articles: Article[]) => void, intervalMinutes: number = 30) => {
  console.log(`Setting up RSS feed refresh every ${intervalMinutes} minutes`);
  
  // Fetch immediately on setup
  fetchAllRssFeeds().then(callback);
  
  // Set up interval for future refreshes
  const intervalId = setInterval(() => {
    console.log("Automatically refreshing RSS feeds");
    fetchAllRssFeeds().then(callback);
  }, intervalMinutes * 60 * 1000);
  
  // Return the interval ID so it can be cleared if needed
  return intervalId;
};
