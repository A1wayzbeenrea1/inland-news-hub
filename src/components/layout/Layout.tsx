
import React, { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Sidebar Menu Button (visible on all pages) */}
      <div className="fixed left-4 top-24 z-50 md:left-6 md:top-28">
        <Button 
          variant="secondary" 
          size="icon" 
          className="shadow-lg rounded-full h-14 w-14 bg-news-primary hover:bg-news-primary/90"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={24} className="text-white" />
        </Button>
      </div>

      {/* Sidebar Drawer */}
      <Drawer open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <DrawerContent className="h-screen max-h-screen rounded-none">
          <div className="h-full bg-white flex flex-col p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-news-dark">Menu</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                <X size={24} />
              </Button>
            </div>
            
            <nav className="flex-1 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 text-gray-500">Navigation</h3>
                  <ul className="space-y-3">
                    <li><Link to="/" className="block py-2 text-lg font-medium hover:text-news-primary">Home</Link></li>
                    <li><Link to="/about" className="block py-2 text-lg font-medium hover:text-news-primary">About</Link></li>
                    <li><Link to="/staff" className="block py-2 text-lg font-medium hover:text-news-primary">Staff</Link></li>
                    <li><Link to="/accessibility" className="block py-2 text-lg font-medium hover:text-news-primary">Accessibility</Link></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 text-gray-500">Categories</h3>
                  <ul className="space-y-3">
                    <li><Link to="/category/public-safety" className="block py-2 text-lg font-medium hover:text-news-primary">Public Safety</Link></li>
                    <li><Link to="/category/politics" className="block py-2 text-lg font-medium hover:text-news-primary">Politics</Link></li>
                    <li><Link to="/category/business" className="block py-2 text-lg font-medium hover:text-news-primary">Business</Link></li>
                    <li><Link to="/category/education" className="block py-2 text-lg font-medium hover:text-news-primary">Education</Link></li>
                    <li><Link to="/category/health" className="block py-2 text-lg font-medium hover:text-news-primary">Health</Link></li>
                    <li><Link to="/category/environment" className="block py-2 text-lg font-medium hover:text-news-primary">Environment</Link></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 text-gray-500">Communities</h3>
                  <ul className="space-y-3">
                    <li><Link to="/communities/yucaipa" className="block py-2 text-lg font-medium hover:text-news-primary">Yucaipa</Link></li>
                    <li><Link to="/communities/redlands" className="block py-2 text-lg font-medium hover:text-news-primary">Redlands</Link></li>
                    <li><Link to="/communities/rialto" className="block py-2 text-lg font-medium hover:text-news-primary">Rialto</Link></li>
                    <li><Link to="/communities/ontario" className="block py-2 text-lg font-medium hover:text-news-primary">Ontario</Link></li>
                    <li><Link to="/communities/san-bernardino" className="block py-2 text-lg font-medium hover:text-news-primary">San Bernardino</Link></li>
                    <li><Link to="/communities/riverside" className="block py-2 text-lg font-medium hover:text-news-primary">Riverside</Link></li>
                  </ul>
                </div>
              </div>
            </nav>
            
            <div className="mt-6 border-t pt-6">
              <Link to="/send-us-tips" className="block w-full py-3 bg-news-secondary text-center text-white rounded-md font-medium hover:bg-news-secondary/90">
                Send Us Tips
              </Link>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};
