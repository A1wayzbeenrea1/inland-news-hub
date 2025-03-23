
import React from 'react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Skeleton } from "@/components/ui/skeleton";
import { FeedspotWidget } from '@/components/news/FeedspotWidget';
import ErrorBoundary from '@/components/common/ErrorBoundary';

type CommunityNewsGridProps = {
  loadingComplete: boolean;
};

export const CommunityNewsGrid = ({ loadingComplete }: CommunityNewsGridProps) => {
  return (
    <ErrorBoundary>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <section className="mb-8">
          <SectionHeader title="Redlands Community News" />
          {!loadingComplete ? (
            <Skeleton className="w-full h-[600px] mt-4" />
          ) : (
            <FeedspotWidget 
              feedUrl="https://www.feedspot.com/widgets/lookup/vciG7f40a3c5" 
              height={600}
              className="mt-4"
            />
          )}
        </section>
        
        <section className="mb-8">
          <SectionHeader title="Yucaipa Community News" />
          {!loadingComplete ? (
            <Skeleton className="w-full h-[600px] mt-4" />
          ) : (
            <FeedspotWidget 
              feedUrl="https://www.feedspot.com/widgets/lookup/vcI7fbedd553" 
              height={600}
              className="mt-4"
            />
          )}
        </section>
      </div>
    </ErrorBoundary>
  );
};
