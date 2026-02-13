import React from 'react';
import { FlaskConical, Atom, Dna, Microscope, Beaker, Pipette } from 'lucide-react';

const BackgroundDoodles: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-5 z-0">
      <FlaskConical className="absolute top-10 left-10 w-24 h-24 text-brand-teal transform -rotate-12" />
      <Atom className="absolute top-40 right-20 w-32 h-32 text-brand-teal transform rotate-45" />
      <Dna className="absolute bottom-20 left-1/4 w-20 h-20 text-brand-teal" />
      <Microscope className="absolute top-1/2 right-10 w-24 h-24 text-brand-teal" />
      <Beaker className="absolute bottom-10 left-10 w-16 h-16 text-brand-teal transform rotate-12" />
      <Pipette className="absolute top-1/3 left-1/3 w-12 h-12 text-brand-teal transform -rotate-45" />
      
      {/* Decorative molecules */}
      <div className="absolute top-20 left-1/2 w-4 h-4 rounded-full border-2 border-brand-teal"></div>
      <div className="absolute top-24 left-[52%] w-10 h-[2px] bg-brand-teal transform -rotate-12"></div>
      <div className="absolute top-28 left-[55%] w-4 h-4 rounded-full border-2 border-brand-teal"></div>
    </div>
  );
};

export default BackgroundDoodles;