
import { scrapeArticleFromUrl, convertToArticle } from "./urlScraperService";
import { Article } from "@/data/mockData";
import { determineCategoryFromContent } from "./newsApiService";

// KTLA News scraper service

// Base URLs for KTLA news
const KTLA_BASE_URL = "https://ktla.com/news/local-news/";
const KTLA_BREAKING_NEWS = "https://ktla.com/news/breaking-news/";
const KTLA_INLAND_EMPIRE = "https://ktla.com/tag/inland-empire/";
const SAN_BERNARDINO_SEARCH_URL = "https://ktla.com/?s=san+bernardino+county";
const RIVERSIDE_SEARCH_URL = "https://ktla.com/?s=riverside+county";
const INLAND_EMPIRE_SEARCH_URL = "https://ktla.com/?s=inland+empire";

// List of alternative news sources when KTLA is not available
const ALTERNATIVE_SOURCES = [
  {
    name: "IE News",
    url: "https://iecn.com/category/inland-empire-news/"
  },
  {
    name: "San Bernardino Sun",
    url: "https://www.sbsun.com/location/california/san-bernardino-county/"
  }
];

// CORS proxy to avoid CORS issues (with fallbacks)
const CORS_PROXIES = [
  "https://corsproxy.io/?",
  "https://cors-anywhere.herokuapp.com/", 
  "https://api.allorigins.win/raw?url="
];

interface KtlaArticleLink {
  title: string;
  url: string;
  publishedAt: string;
  previewImage?: string;
  source?: string;
}

export const fetchKtlaArticles = async (): Promise<KtlaArticleLink[]> => {
  try {
    console.log("Fetching KTLA articles for San Bernardino County");
    
    // Try all sources in order until one works
    const sources = [
      { url: SAN_BERNARDINO_SEARCH_URL, name: "KTLA - San Bernardino" },
      { url: KTLA_INLAND_EMPIRE, name: "KTLA - Inland Empire" },
      { url: KTLA_BASE_URL, name: "KTLA - Local News" },
      { url: KTLA_BREAKING_NEWS, name: "KTLA - Breaking News" },
      { url: RIVERSIDE_SEARCH_URL, name: "KTLA - Riverside" },
      { url: INLAND_EMPIRE_SEARCH_URL, name: "KTLA - Inland Empire Search" },
      ...ALTERNATIVE_SOURCES
    ];
    
    // Try each source with each proxy until something works
    for (const source of sources) {
      for (const proxy of CORS_PROXIES) {
        try {
          const fullUrl = `${proxy}${encodeURIComponent(source.url)}`;
          console.log(`Trying to fetch from: ${source.name} (${fullUrl})`);
          
          const response = await fetch(fullUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              'Referer': 'https://www.google.com/'
            },
            cache: 'no-store',
            // Adding a random delay to reduce chance of being blocked
            signal: AbortSignal.timeout(10000 + Math.random() * 3000)
          });
          
          if (!response.ok) {
            console.log(`Failed to fetch from ${source.name}: ${response.status}`);
            continue;
          }
          
          const html = await response.text();
          
          // Parse the HTML
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          
          // Try to extract articles
          const articleLinks = extractArticlesWithAllSelectors(doc, source.name);
          
          if (articleLinks.length > 0) {
            console.log(`Successfully extracted ${articleLinks.length} articles from ${source.name}`);
            return articleLinks;
          }
        } catch (error) {
          console.log(`Error fetching from ${source.name}:`, error);
          // Continue to the next proxy or source
        }
      }
    }
    
    // If we've exhausted all options, try to use mock data as a last resort
    console.log("Could not fetch real articles, generating mock KTLA data");
    return generateMockKtlaData();
    
  } catch (error) {
    console.error("Error fetching KTLA articles:", error);
    return generateMockKtlaData();
  }
};

// Try all possible selectors to extract articles
const extractArticlesWithAllSelectors = (doc: Document, sourceName: string): KtlaArticleLink[] => {
  // Try with standard news article selectors
  const selectors = [
    // Primary selectors for KTLA
    '.search-result-article',
    'article.article',
    '.articles-article',
    '.news-story',
    '.story',
    '.post',
    
    // Alternative selectors for other sites
    '.story-card',
    '.news-article',
    '.entry',
    '.news-item',
    '.article-item',
    '.news-card',
    '.card',
    'article',
    
    // Very generic selectors (last resort)
    'div.col-sm-6',
    '.row > div',
    'main > div'
  ];
  
  for (const selector of selectors) {
    const articleElements = doc.querySelectorAll(selector);
    if (articleElements.length > 0) {
      const articles: KtlaArticleLink[] = [];
      
      articleElements.forEach((element) => {
        // Try multiple selector combinations for internal elements
        const linkElement = element.querySelector('a') || 
                           element.closest('a');
        const titleElement = element.querySelector('h1, h2, h3, h4, .title, a strong') || 
                            linkElement;
        const dateElement = element.querySelector('.date, time, .published, .meta, .post-date');
        const imageElement = element.querySelector('img') || 
                             element.querySelector('.img, .image, .thumbnail');
        
        if ((linkElement || element.tagName === 'A') && titleElement) {
          const url = (linkElement?.getAttribute('href') || element.getAttribute('href') || '').trim();
          const title = (titleElement.textContent || titleElement.getAttribute('title') || '').trim();
          const publishedDate = dateElement?.textContent?.trim() || new Date().toISOString();
          let publishedAt = publishedDate;
          
          // Try to parse the date if it's not already ISO format
          if (!publishedDate.includes('T')) {
            try {
              publishedAt = new Date(publishedDate).toISOString();
            } catch (e) {
              publishedAt = new Date().toISOString();
            }
          }
          
          // Get image URL, with multiple fallbacks
          let previewImage = imageElement?.getAttribute('src') || 
                            imageElement?.getAttribute('data-src') || 
                            imageElement?.getAttribute('data-lazy-src');
          
          // Skip if URL is invalid or title is empty
          if (!url || !title || url === '#') {
            return;
          }
          
          // Ensure URL is absolute
          const absoluteUrl = url.startsWith('http') ? url : 
                             (url.startsWith('/') ? `https://ktla.com${url}` : `https://ktla.com/${url}`);
          
          // Only include if the URL looks like a news article
          if (isLikelyNewsArticle(absoluteUrl, title) && !articles.some(a => a.url === absoluteUrl)) {
            articles.push({ 
              title, 
              url: absoluteUrl, 
              publishedAt, 
              previewImage,
              source: sourceName
            });
          }
        }
      });
      
      if (articles.length > 0) {
        return articles;
      }
    }
  }
  
  // If no articles found with standard selectors, try generic link extraction
  return extractGenericLinks(doc, sourceName);
};

// Helper function to extract links that look like news articles
const extractGenericLinks = (doc: Document, sourceName: string): KtlaArticleLink[] => {
  const articles: KtlaArticleLink[] = [];
  const linkElements = doc.querySelectorAll('a');
  
  linkElements.forEach((link) => {
    const url = link.getAttribute('href') || '';
    const title = link.textContent?.trim() || '';
    
    // Only include links that are likely article links
    if (url && isLikelyNewsArticle(url, title) && 
        !articles.some(a => a.url === url)) {
      
      const imageElement = link.querySelector('img');
      const previewImage = imageElement?.getAttribute('src') || undefined;
      
      articles.push({ 
        title, 
        url, 
        publishedAt: new Date().toISOString(),
        previewImage,
        source: sourceName
      });
    }
  });
  
  return articles;
};

// Helper function to determine if a URL is likely a news article
const isLikelyNewsArticle = (url: string, title: string): boolean => {
  // Check if URL pattern suggests a news article
  const urlCheck = url.includes('/news/') || 
                  url.includes('/article/') || 
                  url.includes('/story/') || 
                  url.includes('/2023/') || 
                  url.includes('/2024/') || 
                  url.match(/\d{4}\/\d{2}\/\d{2}/);
  
  // Check if title length is reasonable for an article
  const titleCheck = title.length > 20 && title.length < 200;
  
  // Check for specific words that suggest it's not a useful page
  const notMenuOrUtility = !(/about|contact|subscribe|sign in|login|logout|terms|privacy|careers|faq/i.test(title.toLowerCase()));
  
  return urlCheck && titleCheck && notMenuOrUtility;
};

// Generate fallback mock data if all scraping methods fail
const generateMockKtlaData = (): KtlaArticleLink[] => {
  const currentDate = new Date().toISOString();
  return [
    {
      title: "San Bernardino County firefighters battle 5-acre brushfire near Highland",
      url: "https://ktla.com/news/local-news/san-bernardino-county-firefighters-battle-brushfire-near-highland/",
      publishedAt: currentDate,
      previewImage: "https://images.unsplash.com/photo-1586185654846-75d5a5c076ed?q=80&w=1170",
      source: "KTLA (Mock Data)"
    },
    {
      title: "Man arrested for alleged car theft in Rancho Cucamonga",
      url: "https://ktla.com/news/local-news/man-arrested-for-alleged-car-theft-in-rancho-cucamonga/",
      publishedAt: currentDate,
      previewImage: "https://images.unsplash.com/photo-1594642752977-2954d5e632ec?q=80&w=1170",
      source: "KTLA (Mock Data)"
    },
    {
      title: "New affordable housing development announced in Ontario",
      url: "https://ktla.com/news/local-news/new-affordable-housing-development-announced-in-ontario/",
      publishedAt: currentDate,
      previewImage: "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?q=80&w=1170",
      source: "KTLA (Mock Data)"
    },
    {
      title: "Redlands police investigating series of vehicle break-ins",
      url: "https://ktla.com/news/breaking-news/redlands-police-investigating-series-of-vehicle-break-ins/",
      publishedAt: currentDate,
      previewImage: "https://images.unsplash.com/photo-1624713843127-ce4c5284cf82?q=80&w=1170",
      source: "KTLA (Mock Data)"
    },
    {
      title: "Excessive heat warning issued for San Bernardino County this weekend",
      url: "https://ktla.com/news/weather/excessive-heat-warning-issued-for-san-bernardino-county-this-weekend/",
      publishedAt: currentDate,
      previewImage: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1170",
      source: "KTLA (Mock Data)"
    }
  ];
};

export const importKtlaArticle = async (articleLink: KtlaArticleLink): Promise<Article | null> => {
  try {
    console.log(`Importing article: ${articleLink.title} from ${articleLink.url}`);
    
    // First try to scrape the actual article
    let scrapedArticle = null;
    try {
      scrapedArticle = await scrapeArticleFromUrl(articleLink.url);
    } catch (error) {
      console.error("Error scraping article content:", error);
    }
    
    // If scraping failed, generate a minimal article from the link data
    if (!scrapedArticle) {
      console.log("Generating fallback article from link data");
      scrapedArticle = {
        title: articleLink.title,
        content: `<p>This article was originally published by ${articleLink.source || 'KTLA'}.</p>
                 <p>Visit the <a href="${articleLink.url}" target="_blank">original article</a> for the full content.</p>`,
        image: articleLink.previewImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1170&auto=format&fit=crop',
        publishedAt: articleLink.publishedAt,
        author: articleLink.source || 'KTLA News',
        url: articleLink.url
      };
    }
    
    // Convert to article format
    const article = convertToArticle(scrapedArticle);
    
    // Set the source
    article.source = articleLink.source || "KTLA";
    
    // If no image was found, use the preview image from the link
    if (!article.image && articleLink.previewImage) {
      article.image = articleLink.previewImage;
    }
    
    // Add a fallback image if none was found
    if (!article.image) {
      article.image = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1170&auto=format&fit=crop';
    }
    
    return article;
  } catch (error) {
    console.error("Error importing KTLA article:", error);
    return null;
  }
};

