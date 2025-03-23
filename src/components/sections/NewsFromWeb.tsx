
import React, { useRef, useEffect } from 'react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Skeleton } from "@/components/ui/skeleton";
import ErrorBoundary from '@/components/common/ErrorBoundary';

type NewsFromWebProps = {
  loadingComplete: boolean;
};

export const NewsFromWeb = ({ loadingComplete }: NewsFromWebProps) => {
  const feedspotWidgetRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!loadingComplete || !feedspotWidgetRef.current) return;
    
    try {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.id = 'iframecontent';
      script.src = 'https://www.feedspot.com/widgets/Assets/js/wd-iframecontent.js';
      script.setAttribute('data-wd-id', 'vcIef44b1196');
      script.setAttribute('data-script', '');
      script.setAttribute('data-host', '');
      
      feedspotWidgetRef.current.innerHTML = '';
      feedspotWidgetRef.current.appendChild(script);
    } catch (error) {
      console.error("Error loading main Feedspot widget:", error);
    }
  }, [loadingComplete]);
  
  return (
    <ErrorBoundary>
      <section className="mb-8">
        <SectionHeader title="News From Around The Web" />
        <div className="mt-4 rounded-lg shadow-md p-4 bg-white min-h-[400px]">
          {!loadingComplete ? (
            <Skeleton className="w-full h-[400px]" />
          ) : (
            <div ref={feedspotWidgetRef} />
          )}
        </div>
      </section>
    </ErrorBoundary>
  );
};
