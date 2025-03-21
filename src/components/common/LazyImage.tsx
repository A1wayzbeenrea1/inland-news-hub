
import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from '@/lib/utils';

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  skeletonClassName?: string;
}

export const LazyImage = ({ 
  src, 
  alt, 
  className, 
  skeletonClassName,
  ...props 
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading when image is 200px from viewport
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative">
      {!isLoaded && (
        <Skeleton 
          className={cn(
            "absolute inset-0 z-10", 
            skeletonClassName
          )} 
        />
      )}
      <img
        ref={imgRef}
        src={isInView ? src : ''}
        alt={alt}
        className={cn(className)}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
};
