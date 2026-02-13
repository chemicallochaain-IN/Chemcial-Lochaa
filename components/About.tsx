import React from 'react';
import { Microscope, Telescope } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="story" className="py-20 relative border-t-2 border-dashed border-brand-teal/30">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-white p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(1,68,91,1)] border-2 border-brand-teal relative overflow-hidden">
          
          {/* Decorative Corner Tape */}
          <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-6 rotate-45 bg-brand-yellow w-40 h-10 border-2 border-brand-teal"></div>
          
          <h2 className="font-display text-4xl md:text-6xl text-brand-teal mb-8 text-center uppercase border-b-4 border-brand-yellow inline-block w-full pb-2">
            From Lab Coats to Ladles
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-8">
            <div className="space-y-6 font-sans text-brand-teal/90 leading-relaxed text-lg text-justify">
              <p>
                Meet the masterminds behind <span className="font-bold text-brand-yellow">Chemical Lochaa</span>—two brothers, both scientists, now hanging their lab coats and opening a cloud kitchen! Or, should we say, a flavour lab?
              </p>
              <p>
                One used to study the stars as an <span className="font-bold">Astrophysicist</span> <Telescope className="inline w-5 h-5 text-brand-yellow" />, while the other cracked cases as a <span className="font-bold">Forensic Scientist</span> <Microscope className="inline w-5 h-5 text-brand-yellow" />.
              </p>
              <p>
                But their true passion? Cooking. Growing up, they spent hours in the kitchen with their mom, experimenting with flavours like they were running their own food laboratory.
              </p>
            </div>
            
            <div className="relative h-full flex items-center justify-center min-h-[300px] border-2 border-brand-teal bg-brand-cream/50 p-6 rounded-lg">
                {/* Abstract representation of the brothers since no image provided */}
                <div className="relative w-full h-full flex items-center justify-center">
                    <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <Telescope size={80} className="text-brand-teal mx-auto mb-2 opacity-80" strokeWidth={1.5} />
                        <span className="font-display text-xl text-brand-teal">The Astrophysicist</span>
                    </div>
                    <div className="w-[2px] h-32 bg-brand-yellow mx-4 transform rotate-12"></div>
                    <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2 text-center">
                        <Microscope size={80} className="text-brand-teal mx-auto mb-2 opacity-80" strokeWidth={1.5} />
                        <span className="font-display text-xl text-brand-teal">The Forensic Scientist</span>
                    </div>
                </div>
            </div>
          </div>

          <div className="bg-brand-teal/5 p-6 border-l-4 border-brand-yellow">
            <p className="font-sans text-brand-teal italic text-lg">
              "At Chemical Lochaa, every dish is crafted with the same precision as a chemistry experiment, balancing flavours, textures, and techniques to create fast food that's scientifically superior. This isn't just food—it's a carefully calibrated explosion of flavour."
            </p>
            <p className="mt-4 font-display text-xl text-right text-brand-teal uppercase font-bold">
              - Ready to taste the results?
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;