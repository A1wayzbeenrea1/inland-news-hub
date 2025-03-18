
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Bell, Facebook, Twitter, Instagram, Send, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

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
    setIsSearchOpen(false);
    
    // Navigate to search results page with query parameters
    navigate(`/search?${params.toString()}`);
  };

  return (
    <header className="flex flex-col w-full">
      {/* Top bar with social media, search, and subscribe */}
      <div className="bg-news-dark text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter size={18} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={18} />
            </a>
          </div>
          <div className="flex items-center space-x-4">
            {!isMobile && (
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-news-dark">
                Subscribe
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={toggleSearch} aria-label="Search">
              <Search size={18} />
            </Button>
            <Link to="/accessibility" className="text-xs text-white hover:underline">
              Accessibility
            </Link>
            {isMobile && (
              <Button variant="ghost" size="sm" onClick={toggleMenu} aria-label="Menu">
                {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Logo and main navigation */}
      <div className="bg-white py-4 px-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-serif font-bold text-news-primary">Inland Empire</span>
              <span className="text-xl md:text-2xl font-serif text-news-secondary">News Hub</span>
            </div>
          </Link>
          {!isMobile && (
            <nav className="flex space-x-6">
              <NavLinks />
            </nav>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && (
        <div className={cn(
          "fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="p-4 flex justify-between items-center border-b">
            <span className="text-lg font-bold">Menu</span>
            <Button variant="ghost" size="sm" onClick={toggleMenu} aria-label="Close menu">
              <X size={24} />
            </Button>
          </div>
          <nav className="p-4 flex flex-col space-y-4">
            <NavLinks mobile onClick={toggleMenu} />
          </nav>
          <div className="p-4 border-t">
            <Button className="w-full bg-news-secondary text-white hover:bg-news-primary">
              Subscribe
            </Button>
          </div>
        </div>
      )}

      {/* Enhanced Search overlay */}
      <div className={cn(
        "fixed inset-0 bg-black/90 z-50 transform transition-transform duration-300 ease-in-out flex items-center justify-center",
        isSearchOpen ? "translate-y-0" : "translate-y-full"
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
              <Button type="button" variant="ghost" className="h-full" onClick={toggleSearch}>
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
              <Button type="button" variant="outline" className="mr-2 bg-white text-gray-700 hover:bg-gray-100" onClick={toggleSearch}>
                Cancel
              </Button>
              <Button type="submit" className="bg-news-primary text-white hover:bg-news-primary/90">
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Breaking news ticker */}
      <div className="bg-news-secondary text-white py-2 overflow-hidden">
        <div className="flex whitespace-nowrap animate-ticker">
          <span className="font-bold px-4">BREAKING:</span>
          <span className="px-2">Wildfire containment reaches 60% in Yucaipa area as firefighters continue battling blaze</span>
          <span className="px-4">|</span>
          <span className="px-2">Redlands City Council approves new downtown development plan at Wednesday meeting</span>
          <span className="px-4">|</span>
          <span className="px-2">Ontario International Airport reports record passenger numbers for third consecutive month</span>
          <span className="px-4">|</span>
          <span className="px-2">Rialto school district announces new STEM program partnership with local tech companies</span>
        </div>
      </div>
    </header>
  );
};

const NavLinks = ({ mobile = false, onClick = () => {} }: { mobile?: boolean; onClick?: () => void }) => {
  const linkClasses = cn(
    "font-medium transition-colors hover:text-news-primary",
    mobile ? "text-lg py-2" : "text-sm uppercase tracking-wide"
  );

  return (
    <>
      <Link to="/" className={linkClasses} onClick={onClick}>Home</Link>
      <Link to="/news" className={linkClasses} onClick={onClick}>News</Link>
      <Link to="/public-safety" className={linkClasses} onClick={onClick}>Public Safety</Link>
      <Link to="/politics" className={linkClasses} onClick={onClick}>Politics</Link>
      <Link to="/business" className={linkClasses} onClick={onClick}>Business</Link>
      <Link to="/education" className={linkClasses} onClick={onClick}>Education</Link>
      <Link to="/communities" className={linkClasses} onClick={onClick}>Communities</Link>
      <Link to="/sports" className={linkClasses} onClick={onClick}>Sports</Link>
      <Link to="/send-us-tips" className={cn(linkClasses, "flex items-center gap-1 text-news-secondary font-semibold")} onClick={onClick}>
        <Send size={16} />
        Send Us Tips
      </Link>
    </>
  );
};
