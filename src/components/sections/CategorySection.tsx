
import React from 'react';
import { Article } from '@/data/mockData';
import { ArticleCard } from '@/components/news/ArticleCard';
import { CategoryHeader } from '@/components/news/CategoryHeader';
import ErrorBoundary from '@/components/common/ErrorBoundary';

type CategorySectionProps = {
  category: string;
  articles: Article[];
};

export const CategorySection = ({ category, articles }: CategorySectionProps) => {
  if (!articles || articles.length === 0) return null;
  
  return (
    <ErrorBoundary>
      <section className="mb-8">
        <CategoryHeader title={category} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} badgeText={article.source} />
          ))}
        </div>
      </section>
    </ErrorBoundary>
  );
};
