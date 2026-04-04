import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PartyOffer } from '../types';
import { Mail, Gift } from 'lucide-react';

const PartyOffers: React.FC = () => {
  const [offers, setOffers] = useState<PartyOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const { data, error } = await supabase
          .from('party_offers')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');

        if (!error && data) {
          setOffers(data);
        }
      } catch (err) {
        console.error('Error fetching party offers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();

    // Re-fetch globally if admin updates
    const handleUpdate = () => fetchOffers();
    window.addEventListener('partyOfferUpdated', handleUpdate);
    return () => window.removeEventListener('partyOfferUpdated', handleUpdate);
  }, []);

  const handleEnquire = (offerTitle: string) => {
    const message = encodeURIComponent(`Hi, I would like to enquire about the "${offerTitle}" package.`);
    window.open(`https://wa.me/919999999999?text=${message}`, '_blank');
  };

  if (loading) {
    return null; // Silent load on homepage
  }

  if (offers.length === 0) {
    return null; // Hide section entirely if no active offers exist
  }

  return (
    <section id="events" className="py-24 bg-brand-yellow relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal rounded-full blur-3xl mix-blend-multiply translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-cream rounded-full blur-3xl mix-blend-multiply -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-teal rounded-full mb-6 shadow-xl border-4 border-brand-cream transform hover:scale-110 transition-transform">
            <Gift className="text-brand-yellow w-8 h-8" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-brand-teal uppercase font-bold tracking-tight mb-4">
            Party Offers & Events
          </h2>
          <p className="text-brand-teal/80 max-w-2xl mx-auto font-medium">
            Elevate your next office party, corporate lunch, or private event with our exclusive packages. 
            Curated menus, molecular mixology, and unforgettable experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map(offer => (
            <div 
              key={offer.id} 
              className="bg-brand-cream rounded-2xl overflow-hidden shadow-2xl border-4 border-brand-teal flex flex-col transform hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(1,68,91,0.3)] group"
            >
              {offer.image_url ? (
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-brand-teal/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                  <img 
                    src={offer.image_url} 
                    alt={offer.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                  />
                  {offer.price_info && (
                    <div className="absolute top-4 right-4 z-20 bg-brand-yellow text-brand-teal font-bold px-4 py-2 rounded-full text-sm shadow-xl transform group-hover:-rotate-3 transition-transform">
                      {offer.price_info}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-40 bg-brand-teal flex items-center justify-center p-6 text-center">
                  <h3 className="font-display text-2xl text-brand-yellow uppercase">{offer.title}</h3>
                </div>
              )}

              <div className="p-6 md:p-8 flex-1 flex flex-col bg-graph-paper">
                {offer.image_url && (
                  <h3 className="font-display text-2xl text-brand-teal uppercase mb-3 leading-tight">
                    {offer.title}
                  </h3>
                )}
                
                <p className="text-gray-700 whitespace-pre-wrap flex-1 text-sm md:text-base leading-relaxed mb-6">
                  {offer.description}
                </p>

                <button 
                  onClick={() => handleEnquire(offer.title)}
                  className="w-full bg-brand-teal text-brand-yellow font-bold py-4 rounded-xl shadow-[0_8px_0_0_rgba(1,68,91,0.8)] hover:translate-y-2 hover:shadow-[0_0px_0_0_rgba(1,68,91,0.8)] transition-all flex items-center justify-center gap-2 uppercase tracking-wide group-hover:bg-brand-yellow group-hover:text-brand-teal group-hover:shadow-[0_8px_0_0_rgba(202,138,4,0.8)]"
                >
                  <Mail size={18} /> Enquire Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartyOffers;
