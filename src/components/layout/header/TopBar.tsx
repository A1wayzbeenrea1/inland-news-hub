
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Search, Menu, X, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

type TopBarProps = {
  toggleMenu: () => void;
  toggleSearch: () => void;
  isMenuOpen: boolean;
};

export const TopBar = ({ toggleMenu, toggleSearch, isMenuOpen }: TopBarProps) => {
  const isMobile = useIsMobile();

  return (
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
  );
};
