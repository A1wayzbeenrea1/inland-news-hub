
import { scrapeArticleFromUrl, convertToArticle } from "./urlScraperService";
import { Article } from "@/data/mockData";
import { determineCategoryFromContent } from "./newsApiService";

// KTLA News scraper service

// Base URL for KTLA local news
const KTLA_BASE_URL = "https://ktla.com/news/local-news/";
const SAN_BERNARDINO_SEARCH_URL = "https://ktla.com/?s=san+bernardino+county";

// CORS proxy to avoid CORS issues
const CORS_PROXY = "https://corsproxy.io/?";

interface KtlaArticleLink {
  title: string;
  url: string;
  publishedAt: string;
  previewImage?: string;
}

export const fetchKtlaArticles = async (): Promise<KtlaArticleLink[]> => {
  try {
    console.log("Fetching KTLA articles for San Bernardino County");
    
    // Fetch the search results page
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(SAN_BERNARDINO_SEARCH_URL)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch KTLA news: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Find article links - KTLA typically uses article elements within search results
    const articleElements = doc.querySelectorAll('.search-result-article');
    
    if (articleElements.length === 0) {
      console.log("No article elements found, trying alternative selectors");
      // Attempt with alternative selectors if the main one doesn't work
      return extractArticlesWithAlternativeSelectors(doc);
    }
    
    const articles: KtlaArticleLink[] = [];
    
    articleElements.forEach((element) => {
      const linkElement = element.querySelector('a');
      const titleElement = element.querySelector('h3, h2, .title');
      const dateElement = element.querySelector('.date, time, .published');
      const imageElement = element.querySelector('img');
      
      if (linkElement && titleElement) {
        const url = linkElement.getAttribute('href') || '';
        const title = titleElement.textContent?.trim() || '';
        const publishedAt = dateElement?.textContent?.trim() || new Date().toISOString();
        const previewImage = imageElement?.getAttribute('src') || undefined;
        
        if (url && title) {
          articles.push({ title, url, publishedAt, previewImage });
        }
      }
    });
    
    return articles;
  } catch (error) {
    console.error("Error fetching KTLA articles:", error);
    return [];
  }
};

// Fallback extraction method in case the primary selectors don't work
const extractArticlesWithAlternativeSelectors = (doc: Document): KtlaArticleLink[] => {
  const articles: KtlaArticleLink[] = [];
  
  // Try alternative selectors for article containers
  const alternativeSelectors = [
    'article', 
    '.article-item',
    '.post',
    '.story-card',
    '.news-article',
    '.search-results li',
    '.news-item'
  ];
  
  for (const selector of alternativeSelectors) {
    const elements = doc.querySelectorAll(selector);
    
    if (elements.length > 0) {
      console.log(`Found elements with selector: ${selector}`);
      
      elements.forEach((element) => {
        const linkElement = element.querySelector('a');
        const titleElement = element.querySelector('h3, h2, .title, a');
        const dateElement = element.querySelector('.date, time, .published');
        const imageElement = element.querySelector('img');
        
        if (linkElement && titleElement) {
          const url = linkElement.getAttribute('href') || '';
          const title = titleElement.textContent?.trim() || '';
          const publishedAt = dateElement?.textContent?.trim() || new Date().toISOString();
          const previewImage = imageElement?.getAttribute('src') || undefined;
          
          if (url && url.includes('ktla.com') && title) {
            articles.push({ title, url, publishedAt, previewImage });
          }
        }
      });
      
      if (articles.length > 0) {
        break; // Found articles with this selector, no need to try others
      }
    }
  }
  
  // If still no articles, try a more generic approach
  if (articles.length === 0) {
    console.log("Trying generic link extraction");
    const linkElements = doc.querySelectorAll('a');
    
    linkElements.forEach((link) => {
      const url = link.getAttribute('href') || '';
      const title = link.textContent?.trim() || '';
      
      // Only include links that are likely article links
      if (url && url.includes('ktla.com') && 
          url.includes('/news/') && 
          title && 
          title.length > 20 && 
          !url.includes('#') && 
          !articles.some(a => a.url === url)) {
        
        const imageElement = link.querySelector('img');
        const previewImage = imageElement?.getAttribute('src') || undefined;
        
        articles.push({ 
          title, 
          url, 
          publishedAt: new Date().toISOString(),
          previewImage
        });
      }
    });
  }
  
  return articles;
};

export const importKtlaArticle = async (articleLink: KtlaArticleLink): Promise<Article | null> => {
  try {
    // Use the existing URL scraper to fetch the article content
    const scrapedArticle = await scrapeArticleFromUrl(articleLink.url);
    
    if (!scrapedArticle) {
      throw new Error("Failed to scrape article content");
    }
    
    // Convert to article format
    const article = convertToArticle(scrapedArticle);
    
    // Set the source
    article.source = "KTLA";
    
    return article;
  } catch (error) {
    console.error("Error importing KTLA article:", error);
    return null;
  }
};
