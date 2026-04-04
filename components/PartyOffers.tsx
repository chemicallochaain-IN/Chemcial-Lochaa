import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PartyOffer } from '../types';
import { Mail, Gift, MessageCircle, X } from 'lucide-react';

const PartyOffers: React.FC = () => {
  const [offers, setOffers] = useState<PartyOffer[]>([]);
  const [loading, setLoading] = useState(true);

  const [enquireOffer, setEnquireOffer] = useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<PartyOffer | null>(null);

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

    const handleUpdate = () => fetchOffers();
    window.addEventListener('partyOfferUpdated', handleUpdate);
    return () => window.removeEventListener('partyOfferUpdated', handleUpdate);
  }, []);

  const handleWhatsApp = () => {
    if (!enquireOffer) return;
    const message = encodeURIComponent(`Hi, I would like to enquire about the "${enquireOffer}" package.`);
    window.open(`https://wa.me/917206879847?text=${message}`, '_blank');
    setEnquireOffer(null);
  };

  const handleContactForm = () => {
    if (!enquireOffer) return;
    const detail = {
      subject: 'Book an Event / Party',
      message: `I would like to enquire about the "${enquireOffer}" package.\n\nAdditional Details:\n`
    };
    window.dispatchEvent(new CustomEvent('prefillContact', { detail }));
    setEnquireOffer(null);
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

        <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pb-8 no-scrollbar">
          {offers.map(offer => (
            <div 
              key={offer.id} 
              onClick={() => setSelectedOffer(offer)}
              className="bg-brand-cream rounded-2xl overflow-hidden shadow-xl border-4 border-brand-teal flex flex-col transform hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(1,68,91,0.3)] group cursor-pointer relative min-w-[85vw] sm:min-w-[60vw] md:min-w-0 snap-center flex-shrink-0 md:flex-shrink"
            >
              {offer.image_url ? (
                <div className="relative h-48 md:h-56 overflow-hidden bg-brand-teal/5">
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-teal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
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

              <div className="p-6 md:p-8 flex-1 flex flex-col bg-graph-paper relative">
                {offer.image_url && (
                  <h3 className="font-display text-2xl text-brand-teal uppercase mb-3 leading-tight group-hover:text-brand-yellow transition-colors duration-300">
                    {offer.title}
                  </h3>
                )}
                
                <p className="text-gray-600 whitespace-pre-wrap flex-1 text-sm leading-relaxed mb-6 line-clamp-3">
                  {offer.description}
                </p>

                <div className="mt-2 text-right">
                  <span className="text-xs font-bold text-brand-teal uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    + Read More
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-brand-teal/20 to-transparent"></div>
                  <Gift className="w-4 h-4 text-brand-yellow/50 group-hover:text-brand-yellow transition-colors" />
                  <div className="h-[2px] flex-1 bg-gradient-to-l from-brand-teal/20 to-transparent"></div>
                </div>
              </div>

              {/* Hover Enquire Button Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-30">
                <button 
                  onClick={(e) => { e.stopPropagation(); setEnquireOffer(offer.title); }}
                  className="w-full bg-brand-yellow text-brand-teal font-bold py-4 rounded-xl shadow-2xl hover:translate-y-1 hover:shadow-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wide border-2 border-brand-teal"
                >
                  <Mail size={18} /> Enquire Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enquire Modal */}
      {enquireOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setEnquireOffer(null)}>
          <div className="bg-brand-cream w-full max-w-md p-8 rounded-3xl shadow-2xl relative border-4 border-brand-teal text-center" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setEnquireOffer(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-brand-teal transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="font-display text-2xl text-brand-teal uppercase font-bold mb-2">How would you like to connect?</h3>
            <p className="text-gray-600 mb-8">Choose your preferred method to enquire about the "{enquireOffer}" package.</p>
            
            <div className="space-y-4">
              <button 
                onClick={handleWhatsApp}
                className="w-full bg-[#25D366] text-white font-bold py-4 rounded-xl shadow-[0_8px_0_0_#128C7E] hover:translate-y-2 hover:shadow-[0_0px_0_0_#128C7E] transition-all flex items-center justify-center gap-3 uppercase tracking-wide text-lg"
              >
                <MessageCircle size={22} /> WhatsApp Us
              </button>
              
              <button 
                onClick={handleContactForm}
                className="w-full bg-brand-teal text-brand-yellow font-bold py-4 rounded-xl shadow-[0_8px_0_0_rgba(1,68,91,0.8)] hover:translate-y-2 hover:shadow-[0_0px_0_0_rgba(1,68,91,0.8)] transition-all flex items-center justify-center gap-3 uppercase tracking-wide text-lg border-2 border-brand-teal"
              >
                <Mail size={22} /> Use Contact Form
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Offer Modal */}
      {selectedOffer && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSelectedOffer(null)}
        >
          <div 
            className="bg-brand-cream w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-300 border-4 border-brand-teal overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedOffer(null)}
              className="absolute top-4 right-4 z-20 p-2 bg-brand-teal text-brand-yellow rounded-full hover:bg-brand-yellow hover:text-brand-teal transition-colors shadow-lg"
            >
              <X size={20} />
            </button>
            
            <div className="w-full bg-brand-teal/5 relative h-64 md:h-80 flex-shrink-0 flex items-center justify-center p-0">
              {selectedOffer.image_url ? (
                <img
                  src={selectedOffer.image_url}
                  alt={selectedOffer.title}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <Gift className="w-20 h-20 text-brand-yellow/30" />
              )}
            </div>

            <div className="p-8 md:p-10 w-full bg-graph-paper overflow-y-auto no-scrollbar flex-1 relative pb-24">
              <div className="inline-block px-3 py-1 bg-brand-yellow text-brand-teal text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                Party Package
              </div>
              <h3 className="font-display text-3xl md:text-4xl text-brand-teal uppercase font-bold mb-4 pr-8">
                {selectedOffer.title}
              </h3>
              {selectedOffer.price_info && (
                <div className="text-xl font-bold text-gray-800 mb-4 inline-block bg-white px-4 py-2 border-2 border-brand-teal/20 rounded-md shadow-sm">
                  {selectedOffer.price_info}
                </div>
              )}
              <div className="w-16 h-1 bg-brand-yellow mb-6"></div>
              <p className="font-sans text-gray-700 leading-relaxed whitespace-pre-wrap">
                {selectedOffer.description}
              </p>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-graph-paper via-graph-paper to-transparent text-center border-t border-brand-teal/10">
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedOffer(null); setEnquireOffer(selectedOffer.title); }}
                  className="w-full bg-brand-teal text-brand-yellow font-bold py-4 rounded-xl shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
                >
                  <Mail size={18} /> Enquire About This Package
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PartyOffers;
