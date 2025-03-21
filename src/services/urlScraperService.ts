
import { Article } from "@/data/mockData";
import { determineCategoryFromContent, generateSlug } from "@/services/newsApiService";

interface ScrapedArticle {
  title: string;
  description: string;
  content: string;
  image: string | null;
  author: string | null;
  publishedAt: string | null;
  url: string;
}

// Simple proxy to avoid CORS issues - in production, this would be a server endpoint
const CORS_PROXY = "https://corsproxy.io/?";

export const scrapeArticleFromUrl = async (url: string): Promise<ScrapedArticle | null> => {
  try {
    console.log("Fetching article from URL:", url);
    
    // Fetch the HTML content from the URL
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(url)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Create a DOM parser to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extract metadata from Open Graph tags and meta tags
    const title = getMetaContent(doc, 'og:title') || 
                  getMetaContent(doc, 'twitter:title') || 
                  doc.querySelector('title')?.textContent || 
                  'Untitled Article';
    
    const description = getMetaContent(doc, 'og:description') || 
                        getMetaContent(doc, 'twitter:description') || 
                        getMetaContent(doc, 'description') || 
                        'No description available';
    
    const image = getMetaContent(doc, 'og:image') || 
                  getMetaContent(doc, 'twitter:image') || 
                  findFirstImage(doc);
    
    const author = getMetaContent(doc, 'author') || 
                  getMetaContent(doc, 'og:article:author') || 
                  findAuthor(doc) || 
                  'Unknown Author';
    
    const publishedAt = getMetaContent(doc, 'article:published_time') || 
                        getMetaContent(doc, 'og:article:published_time') || 
                        new Date().toISOString();
    
    // Extract content from article body or main content area
    const content = extractArticleContent(doc);
    
    return {
      title,
      description,
      content,
      image,
      author,
      publishedAt,
      url
    };
  } catch (error) {
    console.error("Error scraping article:", error);
    return null;
  }
};

// Helper to get content from meta tags
const getMetaContent = (doc: Document, name: string): string | null => {
  // Try to get by property
  const byProperty = doc.querySelector(`meta[property="${name}"]`);
  if (byProperty) {
    return byProperty.getAttribute('content');
  }
  
  // Try to get by name
  const byName = doc.querySelector(`meta[name="${name}"]`);
  if (byName) {
    return byName.getAttribute('content');
  }
  
  return null;
};

// Find the first image in the document
const findFirstImage = (doc: Document): string | null => {
  const img = doc.querySelector('article img, .content img, .post img, main img');
  if (img) {
    return img.getAttribute('src');
  }
  
  // If no image found in article, try any image
  const anyImg = doc.querySelector('img');
  return anyImg ? anyImg.getAttribute('src') : null;
};

// Try to find author information
const findAuthor = (doc: Document): string | null => {
  const authorElement = doc.querySelector('.author, .byline, [rel="author"]');
  if (authorElement) {
    return authorElement.textContent?.trim() || null;
  }
  return null;
};

// Extract article content
const extractArticleContent = (doc: Document): string => {
  // Try common article containers
  const articleContainers = [
    'article',
    '.article-body',
    '.post-content',
    '.entry-content',
    'main',
    '.content'
  ];
  
  let contentElement: Element | null = null;
  
  for (const selector of articleContainers) {
    contentElement = doc.querySelector(selector);
    if (contentElement && contentElement.textContent && contentElement.textContent.length > 100) {
      break;
    }
  }
  
  if (!contentElement || !contentElement.textContent) {
    return "Article content could not be extracted.";
  }
  
  // Clean up content - remove scripts, styles, etc.
  const scripts = contentElement.querySelectorAll('script, style, iframe, form');
  scripts.forEach(script => script.remove());
  
  // Get paragraphs
  const paragraphs = contentElement.querySelectorAll('p');
  if (paragraphs.length > 0) {
    return Array.from(paragraphs)
      .map(p => p.textContent)
      .filter(Boolean)
      .join('\n\n');
  }
  
  return contentElement.textContent.trim();
};

// Convert scraped article to the format used in the app
export const convertToArticle = (scraped: ScrapedArticle): Article => {
  const content = scraped.content || scraped.description;
  const category = determineCategoryFromContent(scraped.title + " " + scraped.description);
  
  return {
    id: `url-${Date.now()}`,
    title: scraped.title,
    excerpt: scraped.description,
    content: content,
    image: scraped.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1170&auto=format&fit=crop",
    category,
    author: scraped.author || "Staff Reporter",
    publishedAt: scraped.publishedAt || new Date().toISOString(),
    slug: generateSlug(scraped.title),
    featured: false,
    tags: [category, "News", "Inland Empire"]
  };
};
