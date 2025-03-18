
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, Bell, Facebook, Twitter, Instagram, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

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

      {/* Search overlay */}
      <div className={cn(
        "fixed inset-0 bg-black/90 z-50 transform transition-transform duration-300 ease-in-out flex items-center justify-center",
        isSearchOpen ? "translate-y-0" : "translate-y-full"
      )}>
        <div className="w-full max-w-2xl p-4">
          <div className="flex items-center bg-white rounded-lg overflow-hidden">
            <Input 
              className="border-0 text-lg py-6 focus-visible:ring-0" 
              placeholder="Search for news..." 
              autoFocus 
            />
            <Button variant="ghost" className="h-full" onClick={toggleSearch}>
              <X size={24} />
            </Button>
          </div>
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
