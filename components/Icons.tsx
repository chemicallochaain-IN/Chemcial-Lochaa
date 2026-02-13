import React from 'react';
import { Wheat, Milk, Nut, Flame, Egg, Leaf, Drumstick, Sprout } from 'lucide-react';

interface MoleculeWrapperProps {
  children?: React.ReactNode;
  colorClass?: string;
  title?: string;
}

// Hexagon shape for "Benzene Ring" effect
const MoleculeWrapper = ({ children, colorClass = "text-brand-teal", title }: MoleculeWrapperProps) => (
  <div className="relative group" title={title}>
    <div className={`w-8 h-8 flex items-center justify-center ${colorClass}`}>
      {/* CSS Hexagon using clip-path */}
      <div 
        className="absolute inset-0 bg-current opacity-10"
        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
      ></div>
      <div 
        className="absolute inset-0 border-2 border-current"
        style={{ 
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          zIndex: 5 
        }}
      ></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  </div>
);

export const DietaryIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'wheat': 
      return <MoleculeWrapper title="Contains Gluten"><Wheat size={14} /></MoleculeWrapper>;
    case 'dairy': 
      return <MoleculeWrapper title="Contains Dairy"><Milk size={14} /></MoleculeWrapper>;
    case 'nut': 
      return <MoleculeWrapper title="Contains Nuts"><Nut size={14} /></MoleculeWrapper>;
    case 'chilli': 
      return <MoleculeWrapper colorClass="text-brand-yellow" title="Spicy"><Flame size={14} /></MoleculeWrapper>;
    case 'egg': 
      return <MoleculeWrapper title="Contains Egg"><Egg size={14} /></MoleculeWrapper>;
    case 'soy': 
      return <MoleculeWrapper title="Contains Soy"><Sprout size={14} /></MoleculeWrapper>;
    default: return null;
  }
};

export const VegIcon = () => (
  <div className="border-2 border-green-600 p-[2px] inline-block rounded-sm" title="Vegetarian">
    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
  </div>
);

export const NonVegIcon = () => (
  <div className="border-2 border-red-600 p-[2px] inline-block rounded-sm" title="Non-Vegetarian">
    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
  </div>
);