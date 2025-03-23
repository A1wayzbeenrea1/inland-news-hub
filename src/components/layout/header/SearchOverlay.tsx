
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

type SearchOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');
  const [searchTimeframe, setSearchTimeframe] = useState('anytime');
  const [searchOptions, setSearchOptions] = useState({
    includeTags: true,
    onlyTitles: false,
    searchAuthors: false,
    exactMatch: false,
  });
  const [sortOrder, setSortOrder] = useState('relevance');
  const navigate = useNavigate();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Build query parameters
    const params = new URLSearchParams();
    params.append('q', searchQuery);
    params.append('category', searchCategory);
    params.append('timeframe', searchTimeframe);
    params.append('sort', sortOrder);
    
    // Add boolean options
    Object.entries(searchOptions).forEach(([key, value]) => {
      if (value) params.append(key, 'true');
    });
    
    // Close search overlay
    onClose();
    
    // Navigate to search results page with query parameters
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className={cn(
      "fixed inset-0 bg-black/90 z-50 transform transition-transform duration-300 ease-in-out flex items-center justify-center",
      isOpen ? "translate-y-0" : "translate-y-full"
    )}>
      <div className="w-full max-w-3xl p-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex items-center bg-white rounded-lg overflow-hidden">
            <Input 
              className="border-0 text-lg py-6 focus-visible:ring-0" 
              placeholder="Search for news..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus 
            />
            <Button type="button" variant="ghost" className="h-full" onClick={onClose}>
              <X size={24} />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
                <Select value={searchCategory} onValueChange={setSearchCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="public-safety">Public Safety</SelectItem>
                    <SelectItem value="politics">Politics</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Time Period</label>
                <Select value={searchTimeframe} onValueChange={setSearchTimeframe}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anytime">Any Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="this-year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Sort By</label>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort by Relevance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="most-viewed">Most Viewed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Search Options</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="includeTags" 
                    checked={searchOptions.includeTags}
                    onCheckedChange={(checked) => 
                      setSearchOptions(prev => ({...prev, includeTags: !!checked}))
                    }
                  />
                  <label htmlFor="includeTags" className="text-sm">Include Tags</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="onlyTitles" 
                    checked={searchOptions.onlyTitles}
                    onCheckedChange={(checked) => 
                      setSearchOptions(prev => ({...prev, onlyTitles: !!checked}))
                    }
                  />
                  <label htmlFor="onlyTitles" className="text-sm">Search Titles Only</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="searchAuthors" 
                    checked={searchOptions.searchAuthors}
                    onCheckedChange={(checked) => 
                      setSearchOptions(prev => ({...prev, searchAuthors: !!checked}))
                    }
                  />
                  <label htmlFor="searchAuthors" className="text-sm">Search Authors</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="exactMatch" 
                    checked={searchOptions.exactMatch}
                    onCheckedChange={(checked) => 
                      setSearchOptions(prev => ({...prev, exactMatch: !!checked}))
                    }
                  />
                  <label htmlFor="exactMatch" className="text-sm">Exact Match</label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="button" variant="outline" className="mr-2 bg-white text-gray-700 hover:bg-gray-100" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-news-primary text-white hover:bg-news-primary/90">
              Search
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
