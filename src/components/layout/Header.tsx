
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { TopBar } from './header/TopBar';
import { NavLinks } from './header/NavLinks';
import { SearchOverlay } from './header/SearchOverlay';
import { MobileMenu } from './header/MobileMenu';
import { BreakingNews } from './header/BreakingNews';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  return (
    <ErrorBoundary>
      <header className="flex flex-col w-full">
        {/* Top bar with social media, search, and subscribe */}
        <TopBar 
          toggleMenu={toggleMenu} 
          toggleSearch={toggleSearch}
          isMenuOpen={isMenuOpen}
        />

        {/* Logo and main navigation */}
        <div className="bg-white py-4 px-4 border-b">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-serif font-bold text-news-primary">IE.TrueNews</span>
                <span className="text-xl md:text-2xl font-serif text-news-secondary">Your Trusted Source</span>
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
        <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

        {/* Enhanced Search overlay */}
        <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

        {/* Breaking news ticker */}
        <BreakingNews />
      </header>
    </ErrorBoundary>
  );
};
