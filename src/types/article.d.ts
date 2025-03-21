
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
    featured: boolean;
    tags: string[];
    source?: string;
  }

  // Add function declarations
  export function getArticlesByCategory(category: string, includeApi?: boolean): Article[];
  export function getRecentArticles(limit?: number): Article[];
  export function getArticleBySlug(slug: string): Article | undefined;
  export function getRelatedArticles(slug: string, limit?: number): Article[];
  export function getFeaturedArticles(): Promise<Article[]>;
  export function getMostRecentArticles(limit?: number): Promise<Article[]>;
  export function getApiArticles(forceFresh?: boolean): Promise<Article[]>;
}
