
import React from 'react';
import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

type NavLinksProps = {
  mobile?: boolean;
  onClick?: () => void;
};

export const NavLinks = ({ mobile = false, onClick = () => {} }: NavLinksProps) => {
  const linkClasses = cn(
    "font-medium transition-colors hover:text-news-primary",
    mobile ? "text-lg py-2" : "text-sm uppercase tracking-wide"
  );

  return (
    <>
      <Link to="/" className={linkClasses} onClick={onClick}>Home</Link>
      
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className={cn(linkClasses, "bg-transparent p-0 h-auto")}>Categories</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid grid-cols-2 gap-3 p-4 w-[400px]">
                <Link to="/news" className="block p-2 hover:bg-gray-100 rounded">News</Link>
                <Link to="/category/public-safety" className="block p-2 hover:bg-gray-100 rounded">Public Safety</Link>
                <Link to="/category/politics" className="block p-2 hover:bg-gray-100 rounded">Politics</Link>
                <Link to="/category/business" className="block p-2 hover:bg-gray-100 rounded">Business</Link>
                <Link to="/category/education" className="block p-2 hover:bg-gray-100 rounded">Education</Link>
                <Link to="/category/health" className="block p-2 hover:bg-gray-100 rounded">Health</Link>
                <Link to="/category/environment" className="block p-2 hover:bg-gray-100 rounded">Environment</Link>
                <Link to="/category/sports" className="block p-2 hover:bg-gray-100 rounded">Sports</Link>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className={cn(linkClasses, "bg-transparent p-0 h-auto")}>Communities</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid grid-cols-2 gap-3 p-4 w-[400px]">
                <Link to="/communities/yucaipa" className="block p-2 hover:bg-gray-100 rounded">Yucaipa</Link>
                <Link to="/communities/redlands" className="block p-2 hover:bg-gray-100 rounded">Redlands</Link>
                <Link to="/communities/rialto" className="block p-2 hover:bg-gray-100 rounded">Rialto</Link>
                <Link to="/communities/ontario" className="block p-2 hover:bg-gray-100 rounded">Ontario</Link>
                <Link to="/communities/san-bernardino" className="block p-2 hover:bg-gray-100 rounded">San Bernardino</Link>
                <Link to="/communities/riverside" className="block p-2 hover:bg-gray-100 rounded">Riverside</Link>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      
      <Link to="/about" className={linkClasses} onClick={onClick}>About</Link>
      <Link to="/staff" className={linkClasses} onClick={onClick}>Staff</Link>
      <Link to="/send-us-tips" className={cn(linkClasses, "flex items-center gap-1 text-news-secondary font-semibold")} onClick={onClick}>
        <Send size={16} />
        Send Us Tips
      </Link>
    </>
  );
};
