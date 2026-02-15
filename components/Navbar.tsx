import React, { useState } from 'react';
import { Menu, X, ShoppingBag, Instagram } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

interface NavbarProps {
  onOpenOrder: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenOrder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Story', href: '#story' },
    { name: 'Services', href: '#services' },
    { name: 'Menu', href: '#menu' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Franchise', href: '#franchise' },
    { name: 'Blog', href: '#blog' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-brand-cream/90 backdrop-blur-sm border-b-2 border-brand-teal shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img 
              src="/logo.png" 
              alt="Chemical Lochaa" 
              className="h-16 w-auto object-contain"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden xl:block">
            <div className="ml-10 flex items-center space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="font-display text-lg tracking-wide text-brand-teal hover:text-brand-yellow transition-colors duration-300 uppercase"
                >
                  {link.name}
                </a>
              ))}
              
              <div className="h-6 w-[2px] bg-brand-teal/20 mx-2"></div>
              
              <a href={`https://instagram.com/${CONTACT_INFO.socials.instagram}`} target="_blank" rel="noreferrer" className="text-brand-teal hover:text-brand-yellow transition-colors">
                <Instagram size={20} />
              </a>
              
              <button 
                onClick={onOpenOrder}
                className="bg-brand-teal text-white px-5 py-2 rounded font-display tracking-wider hover:bg-brand-yellow hover:text-brand-teal transition-all duration-300 flex items-center gap-2 shadow-md animate-pulse hover:animate-none"
              >
                <ShoppingBag size={18} /> ORDER ONLINE
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="xl:hidden flex items-center gap-4">
             <button 
                onClick={onOpenOrder}
                className="bg-brand-teal text-white px-3 py-1.5 rounded font-display text-sm tracking-wider hover:bg-brand-yellow hover:text-brand-teal transition-all duration-300 flex items-center gap-2"
              >
                <ShoppingBag size={16} /> ORDER
              </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-brand-teal hover:text-brand-yellow focus:outline-none"
            >
              {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="xl:hidden bg-brand-cream border-t border-brand-teal/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium font-display text-brand-teal hover:bg-brand-teal/10 hover:text-brand-yellow uppercase"
              >
                {link.name}
              </a>
            ))}
             <div className="mt-4 pt-4 border-t border-brand-teal/10 flex justify-center gap-6">
                 <a href={`https://instagram.com/${CONTACT_INFO.socials.instagram}`} target="_blank" rel="noreferrer" className="text-brand-teal flex items-center gap-2 font-display uppercase">
                    <Instagram size={20} /> Instagram
                 </a>
             </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;