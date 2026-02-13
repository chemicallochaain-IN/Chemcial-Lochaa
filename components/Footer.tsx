import React from 'react';
import { CONTACT_INFO } from '../constants';
import { Instagram, MapPin, Phone, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-brand-teal text-brand-cream pt-20 pb-10 border-t-8 border-brand-yellow">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-display text-4xl text-brand-yellow uppercase tracking-wider">
              Chemical Lochaa
            </h3>
            <p className="font-sans text-brand-cream/80 max-w-xs">
              A carefully calibrated explosion of flavour. Join the experiment today.
            </p>
            <div className="flex gap-4 pt-4">
              <a 
                href={`https://instagram.com/${CONTACT_INFO.socials.instagram}`} 
                target="_blank" 
                rel="noreferrer"
                className="bg-brand-cream text-brand-teal p-2 rounded-full hover:bg-brand-yellow transition-colors"
              >
                <Instagram size={24} />
              </a>
              {/* Zomato Placeholder Icon */}
               <a 
                href="#" 
                className="bg-brand-cream text-brand-teal px-3 py-1 rounded-full hover:bg-brand-yellow transition-colors font-bold font-display flex items-center"
              >
                ZOMATO
              </a>
              {/* Swiggy Placeholder Icon */}
              <a 
                href="#" 
                className="bg-brand-cream text-brand-teal px-3 py-1 rounded-full hover:bg-brand-yellow transition-colors font-bold font-display flex items-center"
              >
                SWIGGY
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display text-2xl text-white uppercase tracking-wide border-b border-brand-yellow/50 pb-2 inline-block">
              Lab Location
            </h4>
            <div className="flex items-start gap-3">
              <MapPin className="text-brand-yellow flex-shrink-0 mt-1" />
              <p className="font-sans text-lg">{CONTACT_INFO.address}</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-brand-yellow flex-shrink-0" />
              <p className="font-sans text-lg tracking-wide">{CONTACT_INFO.phone}</p>
            </div>
          </div>

          {/* Hours (Assumed) */}
          <div className="space-y-4">
             <h4 className="font-display text-2xl text-white uppercase tracking-wide border-b border-brand-yellow/50 pb-2 inline-block">
              Operating Hours
            </h4>
            <ul className="space-y-2 font-sans text-brand-cream/80">
              <li className="flex justify-between">
                <span>Mon - Sun</span>
                <span>11:00 AM - 11:00 PM</span>
              </li>
            </ul>
             <div className="mt-6 p-4 border border-brand-yellow/30 rounded bg-brand-teal/50">
               <p className="text-sm italic text-center">
                 "Dietary restrictions mentioned on the back of the menu."
               </p>
             </div>
          </div>
        </div>

        <div className="border-t border-brand-teal/50 pt-8 text-center">
          <p className="font-sans text-sm text-brand-cream/60">
            © 2025 Chemical Lochaa. All Rights Reserved. Designed with <span className="text-brand-yellow">♥</span> by The Flavour Lab.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;