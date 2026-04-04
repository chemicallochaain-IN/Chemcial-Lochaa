import React, { useEffect, useState } from 'react';
import { Sparkles, Loader2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Offering } from '../types';

const OurOfferings: React.FC = () => {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffering, setSelectedOffering] = useState<Offering | null>(null);

  useEffect(() => {
    const fetchOfferings = async () => {
      try {
        const { data, error } = await supabase
          .from('offerings')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');

        if (!error && data) setOfferings(data);
      } catch (error) {
        console.error('Error loading offerings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOfferings();
  }, []);

  return (
    <section id="offerings" className="py-20 relative overflow-hidden">
      {/* Dreamy background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-cream via-white to-brand-cream pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-brand-yellow/10 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-teal/5 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-brand-teal p-4 rounded-full border-4 border-brand-yellow mb-4 shadow-lg">
            <Sparkles className="w-10 h-10 text-brand-yellow" strokeWidth={2.5} />
          </div>
          <h2 className="font-display text-5xl md:text-7xl text-brand-teal uppercase font-bold tracking-tight">
            Our Offerings
          </h2>
          <p className="mt-4 text-xl text-gray-600 font-sans bg-white/80 inline-block px-6 py-2 border border-brand-teal/10 rounded-full backdrop-blur-sm">
            Crafted with precision, served with passion
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-teal w-12 h-12" />
          </div>
        ) : offerings.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="w-16 h-16 text-brand-yellow/40 mx-auto mb-4" />
            <p className="text-gray-400 font-sans text-lg">Our offerings are being curated. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offerings.map((offering, idx) => (
              <div
                key={offering.id}
                onClick={() => setSelectedOffering(offering)}
                className="group relative bg-white cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-brand-teal/5 hover:border-brand-yellow/30 transform hover:-translate-y-2"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-brand-cream to-brand-teal/5">
                  {offering.image_url ? (
                    <img
                      src={offering.image_url}
                      alt={offering.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Sparkles className="w-16 h-16 text-brand-teal/20" />
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-teal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Floating tag */}
                  <div className="absolute top-4 right-4 bg-brand-yellow/90 text-brand-teal px-3 py-1 rounded-full font-display text-xs uppercase tracking-wider font-bold shadow-md backdrop-blur-sm transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    Signature
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 relative">
                  {/* Decorative line */}
                  <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-brand-yellow to-transparent"></div>
                  
                  <h3 className="font-display text-2xl text-brand-teal uppercase font-bold mb-3 group-hover:text-brand-yellow transition-colors duration-300 tracking-wide">
                    {offering.name}
                  </h3>
                  <div className="overflow-hidden">
                    <p className="font-sans text-gray-600 leading-relaxed text-sm line-clamp-4 whitespace-pre-wrap">
                      {offering.description}
                    </p>
                  </div>
                  
                  <div className="mt-2 text-right">
                    <span className="text-xs font-bold text-brand-teal uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      + Read More
                    </span>
                  </div>

                  {/* Bottom decorative element */}
                  <div className="mt-4 flex items-center gap-2">
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-brand-teal/20 to-transparent"></div>
                    <Sparkles className="w-4 h-4 text-brand-yellow/50 group-hover:text-brand-yellow transition-colors" />
                    <div className="h-[2px] flex-1 bg-gradient-to-l from-brand-teal/20 to-transparent"></div>
                  </div>
                </div>

                {/* Corner decorations */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-brand-yellow/0 group-hover:border-brand-yellow/50 transition-colors duration-500 rounded-tl pointer-events-none"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-brand-yellow/0 group-hover:border-brand-yellow/50 transition-colors duration-500 rounded-br pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Popup */}
      {selectedOffering && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSelectedOffering(null)}
        >
          <div 
            className="bg-brand-cream w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-300 border-4 border-brand-teal"
            onClick={e => e.stopPropagation()} // Prevent clicking inside modal from closing it
          >
            <button 
              onClick={() => setSelectedOffering(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-brand-teal text-brand-yellow rounded-full hover:bg-brand-yellow hover:text-brand-teal transition-colors shadow-lg"
            >
              <X size={20} />
            </button>
            <div className="flex flex-col md:flex-row">
              {/* Modal Image */}
              <div className="md:w-2/5 bg-gradient-to-br from-brand-teal to-brand-teal/80 relative min-h-[200px] md:min-h-full flex-shrink-0">
                {selectedOffering.image_url ? (
                  <img
                    src={selectedOffering.image_url}
                    alt={selectedOffering.name}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center pt-12 md:pt-0">
                    <Sparkles className="w-20 h-20 text-brand-yellow/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-teal/80 via-transparent to-transparent"></div>
              </div>

              {/* Modal Content */}
              <div className="p-8 md:p-12 md:w-3/5 bg-graph-paper">
                <div className="inline-block px-3 py-1 bg-brand-yellow text-brand-teal text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                  Signature Offering
                </div>
                <h3 className="font-display text-3xl md:text-4xl text-brand-teal uppercase font-bold mb-6">
                  {selectedOffering.name}
                </h3>
                <div className="w-16 h-1 bg-brand-yellow mb-6"></div>
                <p className="font-sans text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedOffering.description}
                </p>
                
                <div className="mt-10 flex items-center gap-4">
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-brand-teal/20 to-transparent"></div>
                  <Sparkles className="w-5 h-5 text-brand-yellow" />
                  <div className="h-[2px] flex-1 bg-gradient-to-l from-brand-teal/20 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default OurOfferings;
