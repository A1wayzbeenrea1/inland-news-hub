import { Article } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

/**
 * Automatically analyzes article content and provides SEO recommendations
 */
export const analyzeSEO = (content: string): { score: number; recommendations: string[] } => {
  const recommendations: string[] = [];
  let score = 100;
  
  // Basic word count check
  const wordCount = content.split(/\s+/).length;
  if (wordCount < 300) {
    recommendations.push(`Article is only ${wordCount} words. Consider expanding to at least 500 words.`);
    score -= 15;
  }
  
  // Keyword density check (basic implementation)
  const keywordDensity = calculateKeywordDensity(content);
  if (keywordDensity.length === 0) {
    recommendations.push("No clear keywords detected. Consider adding topic-relevant keywords.");
    score -= 10;
  }
  
  // Readability check (basic implementation)
  const readabilityScore = calculateReadability(content);
  if (readabilityScore < 50) {
    recommendations.push("Content may be difficult to read. Consider simplifying sentence structure.");
    score -= 10;
  }
  
  // Image check
  if (!content.includes("img") && !content.includes("image")) {
    recommendations.push("Consider adding images to improve engagement.");
    score -= 5;
  }
  
  // Heading structure check
  if (!content.includes("<h2") && !content.includes("<h3") && !content.includes("##")) {
    recommendations.push("No subheadings detected. Consider adding subheadings to break up content.");
    score -= 10;
  }
  
  return {
    score: Math.max(0, score),
    recommendations
  };
};

/**
 * Basic implementation of keyword density calculation
 */
const calculateKeywordDensity = (content: string): string[] => {
  // This is a simplified implementation
  const words = content.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  const wordCount: {[key: string]: number} = {};
  
  words.forEach(word => {
    // Skip common words
    if (['about', 'after', 'again', 'their', 'would', 'could', 'should', 'there'].includes(word)) return;
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  // Get top keywords
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
};

/**
 * Basic implementation of readability score calculation
 */
const calculateReadability = (content: string): number => {
  // This is a very simplified readability score
  const sentences = content.split(/[.!?]+/).filter(Boolean);
  if (sentences.length === 0) return 0;
  
  const avgWordsPerSentence = content.split(/\s+/).length / sentences.length;
  
  // Lower average words = more readable (simplified)
  return Math.max(0, 100 - (avgWordsPerSentence - 10) * 5);
};

/**
 * Cleans up old articles automatically based on criteria
 */
export const cleanupOldArticles = (articles: Article[]): { archived: Article[], kept: Article[] } => {
  const now = new Date();
  const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
  
  const archived: Article[] = [];
  const kept: Article[] = [];
  
  articles.forEach(article => {
    const publishDate = new Date(article.publishedAt);
    
    // Archive articles older than 6 months that aren't featured
    if (publishDate < sixMonthsAgo && !article.featured) {
      archived.push(article);
    } else {
      kept.push(article);
    }
  });
  
  return { archived, kept };
};

/**
 * Performs bulk operations on multiple articles
 */
export const performBulkAction = (
  articles: Article[], 
  selectedIds: string[], 
  action: 'delete' | 'feature' | 'unfeature' | 'archive'
): { updatedArticles: Article[], message: string } => {
  let updatedArticles = [...articles];
  let message = "";
  
  switch (action) {
    case 'delete':
      updatedArticles = articles.filter(article => !selectedIds.includes(article.id));
      message = `Deleted ${selectedIds.length} articles`;
      break;
    case 'feature':
      updatedArticles = articles.map(article => 
        selectedIds.includes(article.id) ? { ...article, featured: true } : article
      );
      message = `Featured ${selectedIds.length} articles`;
      break;
    case 'unfeature':
      updatedArticles = articles.map(article => 
        selectedIds.includes(article.id) ? { ...article, featured: false } : article
      );
      message = `Unfeatured ${selectedIds.length} articles`;
      break;
    case 'archive':
      // In a real implementation, you'd add an 'archived' field
      // Since our data model doesn't have this, we'll simulate by removing
      updatedArticles = articles.filter(article => !selectedIds.includes(article.id));
      message = `Archived ${selectedIds.length} articles`;
      break;
  }
  
  return { updatedArticles, message };
};

/**
 * Creates a slug from a title
 */
export const createSlugFromTitle = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
};

/**
 * Schedules an article for future publishing
 */
export const schedulePublishing = (article: Article, publishDate: Date): void => {
  const timeUntilPublish = publishDate.getTime() - new Date().getTime();
  
  if (timeUntilPublish <= 0) {
    // Publish immediately
    localStorage.setItem("adminStories", JSON.stringify([...JSON.parse(localStorage.getItem("adminStories") || "[]"), article]));
    toast({
      title: "Article Published",
      description: `"${article.title}" has been published immediately.`
    });
    return;
  }
  
  // Store scheduled articles in localStorage
  const scheduledArticles = JSON.parse(localStorage.getItem("scheduledArticles") || "[]");
  scheduledArticles.push({
    article,
    publishAt: publishDate.toISOString()
  });
  localStorage.setItem("scheduledArticles", JSON.stringify(scheduledArticles));
  
  toast({
    title: "Article Scheduled",
    description: `"${article.title}" will be published on ${publishDate.toLocaleDateString()} at ${publishDate.toLocaleTimeString()}.`
  });
};

/**
 * Checks for scheduled articles and publishes them if it's time
 */
export const checkScheduledArticles = (): void => {
  const scheduledArticles = JSON.parse(localStorage.getItem("scheduledArticles") || "[]");
  const now = new Date();
  const updatedSchedule = [];
  let publishedCount = 0;
  
  for (const scheduled of scheduledArticles) {
    const publishDate = new Date(scheduled.publishAt);
    
    if (publishDate <= now) {
      // Publish this article
      const adminStories = JSON.parse(localStorage.getItem("adminStories") || "[]");
      adminStories.push(scheduled.article);
      localStorage.setItem("adminStories", JSON.stringify(adminStories));
      publishedCount++;
    } else {
      // Keep in schedule
      updatedSchedule.push(scheduled);
    }
  }
  
  // Update scheduled articles
  localStorage.setItem("scheduledArticles", JSON.stringify(updatedSchedule));
  
  if (publishedCount > 0) {
    toast({
      title: "Scheduled Articles Published",
      description: `${publishedCount} scheduled article(s) have been published.`
    });
  }
};
