import React from 'react';
import { CONTACT_INFO } from '../constants';
import { Instagram, MapPin, Phone, Mail, ExternalLink, LockKeyhole } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'login' | 'mylab' | 'admin' | 'adminLogin') => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-brand-teal text-brand-cream pt-20 pb-10 border-t-8 border-brand-yellow">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-display text-4xl text-brand-yellow uppercase tracking-wider">
              Chemical Lochaa
            </h3>
            <p className="font-sans text-brand-cream/80 text-sm">
              An experimental kitchen by Scientist Brothers. We bring the precision of science to the art of cooking.
            </p>
            <div className="flex gap-4 pt-4">
              <a 
                href={CONTACT_INFO.socials.instagram} 
                target="_blank" 
                rel="noreferrer"
                className="bg-brand-cream text-brand-teal p-2 rounded-full hover:bg-brand-yellow transition-colors"
                title="Instagram"
              >
                <Instagram size={20} />
              </a>
               <a 
                href={`mailto:${CONTACT_INFO.email}`}
                className="bg-brand-cream text-brand-teal p-2 rounded-full hover:bg-brand-yellow transition-colors"
                title="Email Us"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
             <h4 className="font-display text-xl text-white uppercase tracking-wide border-b border-brand-yellow/50 pb-2 inline-block">
              Explore
            </h4>
            <ul className="space-y-2 font-sans text-brand-cream/80 text-sm">
              <li><a href="#services" className="hover:text-brand-yellow transition-colors">Services</a></li>
              <li><a href="#gallery" className="hover:text-brand-yellow transition-colors">Food Gallery</a></li>
              <li><a href="#franchise" className="hover:text-brand-yellow transition-colors">Franchise</a></li>
              <li><a href="#story" className="hover:text-brand-yellow transition-colors">Our Story</a></li>
            </ul>
          </div>

          {/* Order On section - DISABLED: online ordering turned off */}
          {/* <div className="space-y-4">
             <h4 className="font-display text-xl text-white uppercase tracking-wide border-b border-brand-yellow/50 pb-2 inline-block">
              Order On
            </h4>
            <ul className="space-y-3 font-sans text-brand-cream/80 text-sm">
              <li>
                <a href={CONTACT_INFO.socials.zomato} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-brand-yellow transition-colors">
                    <ExternalLink size={14} /> Zomato
                </a>
              </li>
              <li>
                <a href={CONTACT_INFO.socials.swiggy} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-brand-yellow transition-colors">
                    <ExternalLink size={14} /> Swiggy
                </a>
              </li>
            </ul>
          </div> */}

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display text-xl text-white uppercase tracking-wide border-b border-brand-yellow/50 pb-2 inline-block">
              Lab Location
            </h4>
            <a 
              href="https://share.google/F4yb1s117HkIDCE62" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-start gap-3 group"
            >
              <MapPin className="text-brand-yellow flex-shrink-0 mt-1 w-5 h-5 group-hover:text-white transition-colors" />
              <p className="font-sans text-sm group-hover:text-brand-yellow transition-colors underline decoration-brand-yellow/30 underline-offset-4">{CONTACT_INFO.address}</p>
            </a>
            <div className="flex items-center gap-3">
              <Phone className="text-brand-yellow flex-shrink-0 w-5 h-5" />
              <p className="font-sans text-sm tracking-wide">{CONTACT_INFO.phone}</p>
            </div>
            {/* Hours */}
             <div className="pt-2">
                <p className="text-xs text-brand-yellow uppercase tracking-widest mb-1">Operating Hours</p>
                <p className="font-sans text-sm">Mon - Sun : 11:00 AM - 11:00 PM</p>
             </div>
          </div>
        </div>

        <div className="border-t border-brand-teal/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans text-xs text-brand-cream/60">
            © 2025 Chemical Lochaa. All Rights Reserved. Designed with <span className="text-brand-yellow">♥</span> by The Flavour Lab.
          </p>
          <button 
            onClick={() => onNavigate('adminLogin')}
            className="flex items-center gap-2 text-xs text-brand-cream/30 hover:text-brand-yellow transition-colors"
          >
            <LockKeyhole size={12} /> Admin Login
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;