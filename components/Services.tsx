import React from 'react';
import { PartyPopper, Briefcase, UtensilsCrossed, ChefHat } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: <Briefcase className="w-12 h-12 text-brand-cream" />,
      title: "Corporate Meetings",
      description: "Fuel your team's creativity with our scientifically balanced meals. Perfect for luncheons, board meetings, and office parties."
    },
    {
      icon: <PartyPopper className="w-12 h-12 text-brand-cream" />,
      title: "Private Events",
      description: "From birthdays to anniversaries, we turn standard parties into flavour experiments. Custom menus designed for your guests."
    },
    {
      icon: <ChefHat className="w-12 h-12 text-brand-cream" />,
      title: "Live Food Lab",
      description: "Watch the 'Lochaa' happen live. We set up experimental cooking stations where guests can witness the chemistry of cooking."
    }
  ];

  return (
    <section id="services" className="py-20 bg-brand-teal text-brand-cream relative">
       {/* Background pattern */}
       <div className="absolute inset-0 opacity-10" 
         style={{ backgroundImage: 'radial-gradient(#fbad25 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
       </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl text-brand-yellow uppercase font-bold tracking-tight">
            Our Services
          </h2>
          <p className="mt-4 text-xl text-brand-cream/80 font-sans max-w-2xl mx-auto">
            We don't just serve food; we engineer experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white/5 border border-brand-yellow/30 p-8 rounded hover:bg-white/10 transition-colors group">
              <div className="bg-brand-yellow w-20 h-20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(251,173,37,0.5)]">
                {React.cloneElement(service.icon as React.ReactElement<any>, { className: "text-brand-teal w-10 h-10" })}
              </div>
              <h3 className="font-display text-2xl text-brand-yellow mb-4 uppercase tracking-wide">
                {service.title}
              </h3>
              <p className="font-sans text-brand-cream/90 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;