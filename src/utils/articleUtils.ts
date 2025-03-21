
import { Article } from "@/types/article";

// Simple function to generate a slug from a title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Determine article category based on keywords in the content
export const determineCategoryFromContent = (content: string, categories: string[], categoryKeywords: Record<string, string[]>): string => {
  const contentLower = content.toLowerCase();
  
  // Check for keywords and count matches for each category
  const categoryScores = categories.reduce((acc, category) => {
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
