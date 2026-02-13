import React, { useState } from 'react';
import { Menu, X, FlaskConical, ShoppingBag } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Story', href: '#story' },
    { name: 'Menu', href: '#menu' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-brand-cream/90 backdrop-blur-sm border-b-2 border-brand-teal shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="bg-brand-teal p-2 rounded-lg">
              <FlaskConical className="h-8 w-8 text-brand-yellow" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-2xl tracking-tighter text-brand-teal leading-none">
                CHEMICAL
              </span>
              <span className="font-display font-bold text-2xl tracking-tighter text-brand-yellow leading-none">
                LOCHAA
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="font-display text-lg tracking-wide text-brand-teal hover:text-brand-yellow transition-colors duration-300 uppercase"
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="https://zomato.com" 
                target="_blank" 
                rel="noreferrer"
                className="bg-brand-teal text-white px-4 py-2 rounded font-display tracking-wider hover:bg-brand-yellow hover:text-brand-teal transition-all duration-300 flex items-center gap-2"
              >
                <ShoppingBag size={18} /> ORDER ONLINE
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
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
        <div className="md:hidden bg-brand-cream border-t border-brand-teal/20">
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
             <a 
                href="https://zomato.com" 
                target="_blank" 
                rel="noreferrer"
                className="block w-full text-center mt-4 bg-brand-teal text-white px-4 py-3 rounded font-display tracking-wider hover:bg-brand-yellow hover:text-brand-teal"
              >
                ORDER ON ZOMATO
              </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;