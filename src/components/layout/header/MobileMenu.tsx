
import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NavLinks } from './NavLinks';

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  return (
    <div className={cn(
      "fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
      <div className="p-4 flex justify-between items-center border-b">
        <span className="text-lg font-bold">Menu</span>
        <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close menu">
          <X size={24} />
        </Button>
      </div>
      <nav className="p-4 flex flex-col space-y-4">
        <NavLinks mobile onClick={onClose} />
      </nav>
      <div className="p-4 border-t">
        <Button className="w-full bg-news-secondary text-white hover:bg-news-primary">
          Subscribe
        </Button>
      </div>
    </div>
  );
};
