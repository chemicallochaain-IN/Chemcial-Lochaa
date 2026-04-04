import React, { useState } from 'react';
import { Menu, X, ShoppingBag, Instagram, User as UserIcon, LogIn, FlaskConical, LayoutDashboard } from 'lucide-react';
import { CONTACT_INFO } from '../constants';
import { User } from '../types';
import { Logo } from './Logo';

interface NavbarProps {
  onOpenOrder: () => void;
  onNavigate: (view: 'home' | 'login' | 'mylab' | 'admin') => void;
  currentView: string;
  user: User | null;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenOrder, onNavigate, currentView, user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Story', href: '#story' },
    { name: 'Offerings', href: '#offerings' },
    { name: 'Events', href: '#events' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Franchise', href: '#franchise' },
    { name: 'Blog', href: '#blog' },
  ];

  const handleLinkClick = (href: string) => {
    if (currentView !== 'home') {
      onNavigate('home');
      // Allow time for render then scroll
      setTimeout(() => {
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed w-full z-50 bg-brand-cream/90 backdrop-blur-sm border-b-2 border-brand-teal shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleLinkClick('#home')}>
            <Logo variant="default" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden xl:block">
            <div className="ml-10 flex items-center space-x-6">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link.href)}
                  className="font-display text-lg tracking-wide text-brand-teal hover:text-brand-yellow transition-colors duration-300 uppercase bg-transparent border-none cursor-pointer"
                >
                  {link.name}
                </button>
              ))}
              
              <div className="h-6 w-[2px] bg-brand-teal/20 mx-2"></div>
              
              {user ? (
                <>
                  <button 
                    onClick={() => onNavigate('mylab')}
                    className={`flex items-center gap-2 font-display text-lg uppercase tracking-wide transition-colors ${currentView === 'mylab' ? 'text-brand-yellow' : 'text-brand-teal hover:text-brand-yellow'}`}
                  >
                    <FlaskConical size={20} /> My Lab
                  </button>
                  {user.isAdmin && (
                     <button 
                      onClick={() => onNavigate('admin')}
                      className={`flex items-center gap-2 font-display text-lg uppercase tracking-wide transition-colors ${currentView === 'admin' ? 'text-brand-yellow' : 'text-brand-teal hover:text-brand-yellow'}`}
                    >
                      <LayoutDashboard size={20} /> Admin
                    </button>
                  )}
                 {/* Login button DISABLED for regular customers */}
                 {/* {!user && (
                   <button 
                     onClick={() => onNavigate('login')}
                     className={`flex items-center gap-2 font-display text-lg uppercase tracking-wide transition-colors ${currentView === 'login' ? 'text-brand-yellow' : 'text-brand-teal hover:text-brand-yellow'}`}
                   >
                     <LogIn size={20} /> Login
                   </button>
                 )} */}
               </>
             ) : null /* Public user - no auth button shown */}

              <a href={CONTACT_INFO.socials.instagram} target="_blank" rel="noreferrer" className="text-brand-teal hover:text-brand-yellow transition-colors">
                <Instagram size={20} />
              </a>
              
              {/* ORDER ONLINE button DISABLED */}
              {/* <button 
                onClick={onOpenOrder}
                className="bg-brand-teal text-white px-5 py-2 rounded font-display tracking-wider hover:bg-brand-yellow hover:text-brand-teal transition-all duration-300 flex items-center gap-2 shadow-md animate-pulse hover:animate-none"
              >
                <ShoppingBag size={18} /> ORDER ONLINE
              </button> */}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="xl:hidden flex items-center gap-4">
             {/* ORDER button DISABLED on mobile */}
             {/* <button 
                onClick={onOpenOrder}
                className="bg-brand-teal text-white px-3 py-1.5 rounded font-display text-sm tracking-wider hover:bg-brand-yellow hover:text-brand-teal transition-all duration-300 flex items-center gap-2"
              >
                <ShoppingBag size={16} /> ORDER
              </button> */}
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
              <button
                key={link.name}
                onClick={() => handleLinkClick(link.href)}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium font-display text-brand-teal hover:bg-brand-teal/10 hover:text-brand-yellow uppercase"
              >
                {link.name}
              </button>
            ))}
            <div className="border-t border-brand-teal/10 my-2"></div>
            
            {user ? (
               <>
                 <button
                  onClick={() => {
                    onNavigate('mylab');
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium font-display text-brand-teal hover:bg-brand-teal/10 hover:text-brand-yellow uppercase"
                >
                  <FlaskConical className="inline mr-2" size={18}/> My Lab
                </button>
                {user.isAdmin && (
                  <button
                    onClick={() => {
                      onNavigate('admin');
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium font-display text-brand-teal hover:bg-brand-teal/10 hover:text-brand-yellow uppercase"
                  >
                    <LayoutDashboard className="inline mr-2" size={18}/> Admin Panel
                  </button>
                )}
              </>
            ) : (
              // Login button DISABLED for regular customers
              // <button
              //   onClick={() => { onNavigate('login'); setIsOpen(false); }}
              //   className="block w-full text-left px-3 py-2 ..."
              // >
              //   <LogIn className="inline mr-2" size={18}/> Login
              // </button>
              null
            )}

             <div className="mt-4 pt-4 border-t border-brand-teal/10 flex justify-center gap-6">
                 <a href={CONTACT_INFO.socials.instagram} target="_blank" rel="noreferrer" className="text-brand-teal flex items-center gap-2 font-display uppercase">
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