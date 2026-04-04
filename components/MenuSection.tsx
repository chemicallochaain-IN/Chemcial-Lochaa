import React, { useEffect, useState } from 'react';
import { DIETARY_ICONS } from '../constants';
import { MenuItem, MenuCategory } from '../types';
import { VegIcon, NonVegIcon, DietaryIcon } from './Icons';
import { Beaker, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const MenuItemCard: React.FC<{ item: MenuItem }> = ({ item }) => {
  return (
    <div className="group relative bg-white border border-brand-teal p-5 shadow-[4px_4px_0px_0px_rgba(251,173,37,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(251,173,37,1)] transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-display text-xl font-bold text-brand-teal pr-2 leading-tight uppercase group-hover:text-brand-yellow transition-colors">
          {item.name}
        </h4>
        <div className="flex-shrink-0 mt-1 scale-110">
          {item.type === 'veg' && <VegIcon />}
          {item.type === 'non-veg' && <NonVegIcon />}
          {item.type === 'both' && (
             <div className="flex gap-1">
               <VegIcon />
               <NonVegIcon />
             </div>
          )}
        </div>
      </div>
      
      {item.description && (
        <div 
          className="text-sm text-gray-500 font-sans mb-3 italic prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: item.description }}
        />
      )}

      <div className="flex justify-between items-end mt-4 border-t-2 border-dashed border-gray-200 pt-3">
        <div className="flex gap-1">
          {item.icons?.map((icon, idx) => (
            <div key={idx}>
               <DietaryIcon type={icon} />
            </div>
          ))}
        </div>
        <div className="font-display text-2xl text-brand-teal font-semibold">
          <span className="text-sm font-sans font-normal mr-1 text-gray-400">₹</span>
          {item.price}
        </div>
      </div>

      {/* Lab detail decoration */}
      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-cream border border-brand-teal/20"></div>
      <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-brand-cream border border-brand-teal/20"></div>
    </div>
  );
};

const MenuSection: React.FC = () => {
  const [menuData, setMenuData] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // Fetch Categories
        const { data: categories, error: catError } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order');

        if (catError) throw catError;

        // Fetch Items
        const { data: items, error: itemError } = await supabase
          .from('menu_items')
          .select('*')
          .order('sort_order');

        if (itemError) throw itemError;

        // Merge
        const mergedMenu: MenuCategory[] = categories.map((cat: any) => ({
          id: cat.id,
          title: cat.title,
          note: cat.note,
          items: items.filter((item: any) => item.category_id === cat.id)
        })).filter(cat => cat.items.length > 0); // Only show categories with items

        setMenuData(mergedMenu);
      } catch (error) {
        console.error('Error loading menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return (
    <section id="menu" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <div className="inline-block bg-brand-yellow p-4 rounded-full border-4 border-brand-teal mb-4 shadow-lg">
            <Beaker className="w-10 h-10 text-brand-teal" strokeWidth={2.5} />
          </div>
          <h2 className="font-display text-5xl md:text-7xl text-brand-teal uppercase font-bold tracking-tight">
            Experimental Menu
          </h2>
          <p className="mt-4 text-xl text-gray-600 font-sans bg-white inline-block px-4 py-1 border border-brand-teal/20 rounded-full">
            Calibrated for maximum flavour
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
             <Loader2 className="animate-spin text-brand-teal w-12 h-12" />
          </div>
        ) : (
          <div className="space-y-16">
            {menuData.map((category: MenuCategory) => (
              <div key={category.id} className="relative">
                {/* Category Header */}
                <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-4 mb-8 border-b-4 border-brand-teal pb-2">
                  <h3 className="font-display text-4xl text-[#f6f4f0] uppercase tracking-wide bg-brand-teal px-4 py-1 inline-block transform -skew-x-12">
                    <span className="transform skew-x-12 inline-block">{category.title}</span>
                  </h3>
                  {category.note && (
                     <span className="font-sans text-brand-teal/70 font-medium pb-1 italic pl-2">
                       {category.note}
                     </span>
                  )}
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dietary Legend */}
        <div className="mt-24 bg-white p-8 border-2 border-brand-teal relative">
          <div className="absolute -top-4 left-8 bg-brand-yellow px-4 py-1 border-2 border-brand-teal font-display font-bold text-brand-teal uppercase tracking-wider">
            Element Analysis Key
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {DIETARY_ICONS.map((d) => (
              <div key={d.name} className="flex items-center gap-3">
                <div className="scale-75 origin-left">
                  {React.cloneElement(d.icon as React.ReactElement<any>, { size: 24 })}
                </div>
                <span className="font-sans text-sm font-bold text-brand-teal">{d.name}</span>
              </div>
            ))}
            
            {/* Hardcoded Legend for consistency with new Icon system */}
             <div className="flex items-center gap-2">
                <DietaryIcon type="wheat" /> <span className="font-sans text-sm font-bold text-brand-teal">Gluten</span>
             </div>
             <div className="flex items-center gap-2">
                <DietaryIcon type="dairy" /> <span className="font-sans text-sm font-bold text-brand-teal">Dairy</span>
             </div>
             <div className="flex items-center gap-2">
                <DietaryIcon type="nut" /> <span className="font-sans text-sm font-bold text-brand-teal">Nuts</span>
             </div>
             <div className="flex items-center gap-2">
                <DietaryIcon type="chilli" /> <span className="font-sans text-sm font-bold text-brand-teal">Spicy</span>
             </div>
              <div className="flex items-center gap-2">
                <DietaryIcon type="egg" /> <span className="font-sans text-sm font-bold text-brand-teal">Egg</span>
             </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default MenuSection;