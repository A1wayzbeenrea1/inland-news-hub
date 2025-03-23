
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { AdBanner } from '@/components/layout/AdBanner';
import { MetaTags } from '@/components/common/MetaTags';
import { useNewsData } from '@/hooks/useNewsData';
import { FeaturedStories } from '@/components/sections/FeaturedStories';
import { NewsFromWeb } from '@/components/sections/NewsFromWeb';
import { CommunityNewsGrid } from '@/components/sections/CommunityNewsGrid';
import { CategorySection } from '@/components/sections/CategorySection';
import { LoadingIndicator } from '@/components/sections/LoadingIndicator';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const Index = () => {
  const { featuredArticles, categoryArticles, isLoading, loadingComplete } = useNewsData();

  return (
    <ErrorBoundary>
      <Layout>
        <MetaTags
          title="Inland Empire True News"
          description="Your source for local news in the Inland Empire region"
        />
        
        <div className="container mx-auto px-4 py-8">
          {isLoading ? (
            <LoadingIndicator />
          ) : (
            <>
              <FeaturedStories 
                articles={featuredArticles} 
                isLoading={isLoading} 
              />

              <NewsFromWeb loadingComplete={loadingComplete} />
              
              <CommunityNewsGrid loadingComplete={loadingComplete} />

              {Object.entries(categoryArticles).map(([category, articles]) => (
                <CategorySection 
                  key={category}
                  category={category}
                  articles={articles}
                />
              ))}
            </>
          )}
          
          <AdBanner size="large" className="my-12" />
        </div>
      </Layout>
    </ErrorBoundary>
  );
};

export default Index;
