import React from 'react';
import { Beaker } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        
        {/* Established Badge */}
        <div className="mb-8 inline-block border-b-2 border-brand-teal pb-1">
          <span className="font-display text-xl tracking-widest text-brand-teal">EST. 2025</span>
        </div>

        {/* Main Logo Composition */}
        <div className="relative mb-8 mx-auto w-fit">
           <div className="flex flex-col items-center">
             <img 
               src="/logo.png" 
               alt="Chemical Lochaa Logo" 
               className="w-full max-w-[320px] md:max-w-[450px] h-auto object-contain drop-shadow-sm"
             />
           </div>
        </div>

        {/* City Script */}
        <div className="relative mt-2 mb-10">
            <span className="font-handwriting text-3xl md:text-5xl text-brand-teal" style={{ fontFamily: 'cursive' }}>
              The Flavour Lab
            </span>
            <div className="h-[2px] w-24 bg-brand-teal mx-auto mt-2"></div>
        </div>

        <h1 className="sr-only">Chemical Lochaa</h1>
        
        <p className="font-display text-3xl md:text-5xl text-brand-teal uppercase font-bold leading-tight mb-6">
          Experiment with Flavour at Your Next Event
        </p>

        <p className="text-brand-teal font-sans text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          From corporate gatherings to private parties, let the Scientists curate an experimental culinary experience for you. 
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="#contact"
            className="px-8 py-4 bg-brand-teal text-brand-cream font-display text-xl uppercase tracking-wider rounded border-2 border-brand-teal hover:bg-transparent hover:text-brand-teal transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
          >
            <Beaker size={20} /> Host an Event
          </a>
          <a 
            href="#franchise"
            className="px-8 py-4 bg-transparent text-brand-teal font-display text-xl uppercase tracking-wider rounded border-2 border-brand-teal hover:bg-brand-yellow hover:border-brand-yellow hover:text-brand-teal transition-all duration-300"
          >
            Partner With Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;