import React from 'react';
import { FlaskConical, Utensils } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        
        {/* Established Badge */}
        <div className="mb-8 inline-block border-b-2 border-brand-teal pb-1">
          <span className="font-display text-xl tracking-widest text-brand-teal">EST. 2025</span>
        </div>

        {/* Main Logo Composition */}
        <div className="relative mb-6 mx-auto w-fit">
           <div className="flex flex-col items-center">
             {/* Logo Icon Graphic */}
             <div className="relative mb-4">
                <FlaskConical className="w-32 h-32 md:w-48 md:h-48 text-brand-teal fill-brand-teal" />
                <Utensils className="absolute bottom-2 right-[-10px] w-16 h-16 md:w-24 md:h-24 text-brand-yellow transform -rotate-12 bg-brand-cream rounded-full p-2 border-2 border-brand-teal" />
                {/* Bubbles */}
                <div className="absolute -top-4 left-1/2 w-4 h-4 bg-brand-teal rounded-full animate-bounce delay-100"></div>
                <div className="absolute -top-10 left-[60%] w-3 h-3 bg-brand-teal rounded-full animate-bounce delay-300"></div>
             </div>

             <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold text-brand-teal leading-none tracking-tighter drop-shadow-sm">
               CHEMICAL
             </h1>
             <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold text-brand-yellow leading-none tracking-tighter drop-shadow-sm">
               LOCHAA
             </h1>
           </div>
        </div>

        {/* City Script */}
        <div className="relative mt-2 mb-12">
            <span className="font-handwriting text-4xl md:text-6xl text-brand-teal" style={{ fontFamily: 'cursive' }}>
              Ambala City
            </span>
            <div className="h-[2px] w-32 bg-brand-teal mx-auto mt-2"></div>
        </div>

        <p className="text-brand-teal font-sans text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Where science meets flavor. An experimental kitchen by an Astrophysicist & a Forensic Scientist.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="#menu"
            className="px-8 py-4 bg-brand-teal text-brand-cream font-display text-xl uppercase tracking-wider rounded border-2 border-brand-teal hover:bg-transparent hover:text-brand-teal transition-all duration-300 shadow-lg"
          >
            Explore Menu
          </a>
          <a 
            href="#story"
            className="px-8 py-4 bg-transparent text-brand-teal font-display text-xl uppercase tracking-wider rounded border-2 border-brand-teal hover:bg-brand-yellow hover:border-brand-yellow hover:text-brand-teal transition-all duration-300"
          >
            Our Story
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;