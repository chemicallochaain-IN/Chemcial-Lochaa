import React from 'react';
import { FlaskConical } from 'lucide-react';

const Franchise: React.FC = () => {
  return (
    <section id="franchise" className="py-24 bg-brand-teal text-brand-cream relative overflow-hidden">
      {/* Decorative large icon */}
      <FlaskConical className="absolute -right-20 -bottom-20 w-96 h-96 text-white opacity-5 transform rotate-12" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-4xl md:text-6xl text-brand-yellow uppercase font-bold tracking-tight mb-6">
              Expand the Experiment
            </h2>
            <p className="font-sans text-xl leading-relaxed mb-8 text-brand-cream/90">
              Chemical Lochaa is more than just a kitchen; it's a rapidly growing brand with a unique scientific identity. We are looking for partners to take this experiment to new cities.
            </p>
            <ul className="space-y-4 font-sans text-lg mb-8">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-brand-yellow rounded-full"></span>
                Proven "Cloud Kitchen" Model
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-brand-yellow rounded-full"></span>
                Standardized SOPs & Recipes
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-brand-yellow rounded-full"></span>
                Low Initial Investment
              </li>
            </ul>
            <a href="#contact" className="inline-block bg-brand-yellow text-brand-teal px-8 py-4 font-display text-xl uppercase font-bold tracking-wider rounded hover:bg-white transition-colors">
              Enquire Now
            </a>
          </div>
          
          <div className="bg-brand-cream/5 backdrop-blur-sm p-8 border border-brand-yellow/30 rounded-lg">
             <h3 className="font-display text-2xl text-white mb-6 uppercase border-b border-brand-yellow/30 pb-4">
               Franchise Models
             </h3>
             <div className="space-y-6">
               <div className="p-4 bg-black/20 rounded border-l-4 border-brand-yellow">
                 <h4 className="font-bold text-xl text-brand-yellow font-display">FOCO Model</h4>
                 <p className="text-sm mt-1 opacity-80 font-sans">Franchise Owned, Company Operated. For investors looking for passive income.</p>
               </div>
               <div className="p-4 bg-black/20 rounded border-l-4 border-brand-yellow">
                 <h4 className="font-bold text-xl text-brand-yellow font-display">FOFO Model</h4>
                 <p className="text-sm mt-1 opacity-80 font-sans">Franchise Owned, Franchise Operated. For entrepreneurs who want to be hands-on.</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Franchise;