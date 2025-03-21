
import { useRef, useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface FeedspotWidgetProps {
  feedUrl: string;
  height?: number;
  className?: string;
  title?: string;
}

export const FeedspotWidget = ({
  feedUrl,
  height = 600,
  className,
  title
}: FeedspotWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    
    try {
      const iframe = document.createElement('iframe');
      iframe.className = 'widget_preview_iframe';
      iframe.frameBorder = '0';
      iframe.allow = 'autoplay; encrypted-media';
      iframe.allowFullscreen = true;
      iframe.scrolling = 'no';
      iframe.style.width = '100%';
      iframe.style.height = `${height}px`;
      iframe.style.opacity = '0'; // Start invisible to prevent layout shift
      iframe.style.transition = 'opacity 0.3s ease-in-out';
      iframe.src = feedUrl;
      
      // Clear the container before adding the iframe
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(iframe);
      
      // Listen for iframe load events
      iframe.onload = () => {
        setIsLoading(false);
        iframe.style.opacity = '1'; // Fade in when loaded
      };
      
      iframe.onerror = () => {
        setIsLoading(false);
        setHasError(true);
      };
      
      // Set a timeout in case iframe doesn't trigger onload
      const timeout = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          iframe.style.opacity = '1';
        }
      }, 5000);
      
      return () => clearTimeout(timeout);
    } catch (error) {
      console.error("Error loading Feedspot widget:", error);
      setIsLoading(false);
      setHasError(true);
    }
  }, [feedUrl, height, isLoading]);

  return (
    <div className={cn("relative rounded-lg bg-white overflow-hidden", className)}>
      {title && (
        <h3 className="text-lg font-semibold px-4 pt-4 text-news-dark">{title}</h3>
      )}
      
      <ScrollArea className={cn("h-[unset]", `min-h-[${height}px]`)}>
        {/* Placeholder with fixed height to prevent layout shift */}
        <div 
          ref={containerRef} 
          className={cn(
            "min-h-[600px]",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          style={{ minHeight: `${height}px` }}
        />
        
        {isLoading && (
          <div className="absolute inset-0 flex flex-col p-4 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}
        
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 p-4">
            <p className="text-gray-500 text-center">
              Unable to load feed. Please try again later.
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
