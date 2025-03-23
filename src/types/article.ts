
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
  shareText?: string; // For social media sharing
  url?: string; // For linking to original source
}
