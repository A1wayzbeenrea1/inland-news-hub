
import React from 'react';
import { Article } from '@/data/mockData';
import { ArticleCard } from '@/components/news/ArticleCard';
import { SectionHeader } from '@/components/common/SectionHeader';
import ErrorBoundary from '@/components/common/ErrorBoundary';

type FeaturedStoriesProps = {
  articles: Article[];
  isLoading: boolean;
};

export const FeaturedStories = ({ articles, isLoading }: FeaturedStoriesProps) => {
  if (isLoading || !articles || articles.length === 0) return null;
  
  return (
    <ErrorBoundary>
      <section className="mb-8">
        <SectionHeader title="Featured Stories" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} badgeText={article.source} />
          ))}
        </div>
      </section>
    </ErrorBoundary>
  );
};
