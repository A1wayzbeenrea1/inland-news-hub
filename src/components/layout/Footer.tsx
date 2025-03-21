import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-news-dark text-white pt-12 pb-6">
      <div className="container mx-auto">
        {/* Top section with logo, newsletter signup */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="flex flex-col items-start">
            <Link to="/" className="flex flex-col items-start mb-4">
              <div className="bg-white p-3 rounded-lg shadow-md mb-2">
                <img 
                  src="/lovable-uploads/97104a5b-83e2-4269-b309-9c33310d3385.png" 
                  alt="INLAND EMPIRE TRUENEWS" 
                  className="h-16 object-contain"
                />
              </div>
            </Link>
            <p className="text-sm text-gray-300 mb-4">
              Your trusted source for local news coverage in Yucaipa, Redlands, Rialto, Ontario and 
              throughout the Inland Empire.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-news-secondary" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-news-secondary" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-news-secondary" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone size={18} />
                <span>(909) 300-7596</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={18} />
                <span>ie.truenews@gmail.com</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <p className="text-sm text-gray-300 mb-4">
              Subscribe to our newsletter for daily updates on local news.
            </p>
            <div className="flex flex-col space-y-2">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button className="bg-news-secondary hover:bg-news-primary text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Middle section with quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8 border-t border-b border-gray-800">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4">News</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/news/local" className="hover:text-white">Local News</Link></li>
              <li><Link to="/news/regional" className="hover:text-white">Regional News</Link></li>
              <li><Link to="/news/breaking" className="hover:text-white">Breaking News</Link></li>
              <li><Link to="/category/health" className="hover:text-white">Health</Link></li>
              <li><Link to="/category/environment" className="hover:text-white">Environment</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Communities</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/communities/yucaipa" className="hover:text-white">Yucaipa</Link></li>
              <li><Link to="/communities/redlands" className="hover:text-white">Redlands</Link></li>
              <li><Link to="/communities/rialto" className="hover:text-white">Rialto</Link></li>
              <li><Link to="/communities/ontario" className="hover:text-white">Ontario</Link></li>
              <li><Link to="/communities/san-bernardino" className="hover:text-white">San Bernardino</Link></li>
              <li><Link to="/communities/riverside" className="hover:text-white">Riverside</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Topics</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/category/public-safety" className="hover:text-white">Public Safety</Link></li>
              <li><Link to="/category/education" className="hover:text-white">Education</Link></li>
              <li><Link to="/category/politics" className="hover:text-white">Politics</Link></li>
              <li><Link to="/category/business" className="hover:text-white">Business</Link></li>
              <li><Link to="/category/health" className="hover:text-white">Health</Link></li>
              <li><Link to="/category/environment" className="hover:text-white">Environment</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4">About</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/staff" className="hover:text-white">Staff</Link></li>
              <li><Link to="/advertise" className="hover:text-white">Advertise</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link to="/admin/login" className="hover:text-white flex items-center gap-1">
                <Shield size={16} /> Admin
              </Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="pt-8 text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© {currentYear} INLAND EMPIRE TRUENEWS. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white">Terms of Use</Link>
              <Link to="/accessibility" className="hover:text-white">Accessibility</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
