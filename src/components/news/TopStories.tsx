
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArticleCard } from './ArticleCard';

interface TopStoriesProps {
  articles: Array<{
    id: string;
    title: string;
    excerpt: string;
    image: string;
    category: string;
    author: string;
    publishedAt: string;
    slug: string;
  }>;
  className?: string;
}

export const TopStories = ({ articles, className }: TopStoriesProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = articles.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      <div 
        className="flex transition-transform duration-500 ease-in-out" 
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {articles.map((article) => (
          <div key={article.id} className="w-full flex-shrink-0">
            <ArticleCard article={article} variant="featured" />
          </div>
        ))}
      </div>
      
      {/* Navigation buttons */}
      <Button 
        variant="secondary" 
        size="icon" 
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-news-dark rounded-full"
        onClick={prevSlide}
      >
        <ChevronLeft />
      </Button>
      <Button 
        variant="secondary" 
        size="icon" 
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-news-dark rounded-full"
        onClick={nextSlide}
      >
        <ChevronRight />
      </Button>
      
      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {articles.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              index === currentSlide ? "bg-white" : "bg-white/50"
            )}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};
