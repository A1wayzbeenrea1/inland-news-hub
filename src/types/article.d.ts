
declare module "@/data/mockData" {
  export interface Article {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    category: string;
    author: string;
    publishedAt: string;
    slug: string;
    featured?: boolean;
    tags?: string[];
    source?: string;
    shareText?: string; // Added for social media sharing
  }

  // Update function declarations to indicate they return Promises
  export function getArticlesByCategory(category: string, includeApi?: boolean): Promise<Article[]>;
  export function getRecentArticles(limit?: number): Promise<Article[]>;
  export function getArticleBySlug(slug: string): Promise<Article | undefined>;
  export function getRelatedArticles(slug: string, limit?: number): Promise<Article[]>;
  export function getFeaturedArticles(): Promise<Article[]>;
  export function getMostRecentArticles(limit?: number): Promise<Article[]>;
  export function getApiArticles(forceFresh?: boolean): Promise<Article[]>;
  export function getRssArticles(forceFresh?: boolean): Promise<Article[]>;
}
