import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2, ChevronRight, CheckCircle } from 'lucide-react';
import { MENU_DATA, CONTACT_INFO } from '../constants';
import { MenuItem, CartItem } from '../types';
import { VegIcon, NonVegIcon } from './Icons';

interface OrderOnlineProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderOnline: React.FC<OrderOnlineProps> = ({ isOpen, onClose }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState(MENU_DATA[0].id);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const addToCart = (item: MenuItem, variant?: string, price?: number) => {
    const finalPrice = price || (typeof item.price === 'number' ? item.price : parseInt(item.price.toString().split('/')[0]));
    const cartId = `${item.id}-${variant || 'default'}`;

    setCart(prev => {
      const existing = prev.find(i => i.cartId === cartId);
      if (existing) {
        return prev.map(i => i.cartId === cartId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, cartId, selectedVariant: variant, finalPrice, quantity: 1 }];
    });
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call to POS
    console.log("Sending order to POS System:", {
      items: cart,
      total: cartTotal,
      timestamp: new Date().toISOString()
    });
    
    setOrderPlaced(true);
    setTimeout(() => {
      setCart([]);
      setOrderPlaced(false);
      setShowCheckout(false);
      onClose();
      alert("Order successfully sent to Chemical Lochaa Kitchen!");
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col md:flex-row animate-in fade-in duration-200">
      
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-4 bg-brand-teal text-white shadow-md">
        <h2 className="font-display text-xl uppercase tracking-wider">Order Online</h2>
        <button onClick={onClose}><X /></button>
      </div>

      {/* Sidebar Navigation (Desktop) / Top Bar (Mobile) */}
      <div className="w-full md:w-64 bg-brand-cream border-r border-brand-teal/20 flex-shrink-0 md:h-full overflow-x-auto md:overflow-y-auto no-scrollbar flex md:flex-col">
        <div className="hidden md:flex justify-between items-center p-6 border-b border-brand-teal/10">
          <h2 className="font-display text-2xl text-brand-teal uppercase font-bold">Menu</h2>
          <button onClick={onClose} className="p-1 hover:bg-brand-teal/10 rounded-full transition-colors"><X size={20} /></button>
        </div>
        
        <div className="flex md:flex-col p-2 md:p-4 gap-2">
          {MENU_DATA.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex-shrink-0 px-4 py-3 text-left rounded-lg font-display uppercase tracking-wide transition-all ${
                activeCategory === category.id 
                  ? 'bg-brand-teal text-brand-yellow shadow-md' 
                  : 'text-brand-teal hover:bg-brand-teal/5'
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>
        
        <div className="hidden md:block mt-auto p-6 border-t border-brand-teal/10">
            <p className="text-xs text-brand-teal/60 font-sans text-center">
                Powered by Chemical Lochaa POS
            </p>
        </div>
      </div>

      {/* Main Menu Content */}
      <div className="flex-1 overflow-y-auto bg-white p-4 md:p-8 pb-32 md:pb-8 relative">
        <div className="max-w-4xl mx-auto">
          {MENU_DATA.map(category => (
             <div key={category.id} id={category.id} className={activeCategory === category.id ? 'block' : 'hidden'}>
               <div className="mb-6 border-b-2 border-brand-teal pb-2 flex items-baseline justify-between">
                 <h3 className="font-display text-3xl text-brand-teal uppercase font-bold">{category.title}</h3>
                 {category.note && <span className="text-sm text-gray-500 italic font-sans">{category.note}</span>}
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                 {category.items.map(item => (
                   <div key={item.id} className="border border-brand-teal/20 rounded-lg p-4 hover:border-brand-yellow transition-colors bg-brand-cream/20 flex justify-between gap-4">
                     <div className="flex-1">
                        <div className="flex items-start gap-2 mb-1">
                          <div className="mt-1">{item.type === 'veg' ? <VegIcon /> : item.type === 'non-veg' ? <NonVegIcon /> : <div className="flex gap-1"><VegIcon/><NonVegIcon/></div>}</div>
                          <h4 className="font-bold text-brand-teal font-display text-lg leading-tight uppercase">{item.name}</h4>
                        </div>
                        <p className="text-xs text-gray-500 font-sans mb-2 line-clamp-2">{item.description}</p>
                        <div className="font-bold text-brand-teal font-sans">
                           ₹{item.price}
                        </div>
                     </div>
                     <div className="flex flex-col items-end justify-center">
                       {/* Handling Variant Prices simply for this demo */}
                        {typeof item.price === 'string' ? (
                          <div className="flex flex-col gap-2">
                             {item.price.split('/').map((p, idx) => (
                               <button 
                                key={idx}
                                onClick={() => addToCart(item, idx === 0 ? 'Regular' : 'Large', parseInt(p.trim()))}
                                className="px-3 py-1 bg-white border border-brand-teal text-brand-teal text-xs font-bold uppercase rounded hover:bg-brand-teal hover:text-white transition-colors"
                               >
                                 Add {idx === 0 ? 'Reg' : 'Lrg'}
                               </button>
                             ))}
                          </div>
                        ) : (
                          <button 
                            onClick={() => addToCart(item)}
                            className="w-8 h-8 flex items-center justify-center bg-brand-teal text-white rounded-full hover:bg-brand-yellow hover:text-brand-teal transition-colors shadow-sm"
                          >
                            <Plus size={18} />
                          </button>
                        )}
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className={`fixed md:relative bottom-0 left-0 right-0 md:w-96 bg-white border-l border-brand-teal/20 shadow-2xl md:shadow-none transform transition-transform duration-300 z-50 flex flex-col ${showCheckout ? 'h-full md:h-auto' : 'h-auto max-h-[80vh] md:h-full'}`}>
        
        {/* Cart Header */}
        <div className="p-4 bg-brand-cream border-b border-brand-teal/10 flex justify-between items-center cursor-pointer md:cursor-default" onClick={() => window.innerWidth < 768 && setShowCheckout(!showCheckout)}>
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-brand-teal" />
            <h3 className="font-display text-xl text-brand-teal uppercase font-bold">Your Tray</h3>
            <span className="bg-brand-yellow text-brand-teal text-xs font-bold px-2 py-0.5 rounded-full">{cart.reduce((a,b)=>a+b.quantity,0)}</span>
          </div>
          <div className="md:hidden">
            <span className="font-bold text-brand-teal">₹{cartTotal}</span>
            <ChevronRight className={`inline ml-2 transition-transform ${showCheckout ? 'rotate-90' : '-rotate-90'}`} />
          </div>
        </div>

        {/* Cart Items */}
        {(!showCheckout && window.innerWidth < 768) ? null : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                <ShoppingBag size={48} className="opacity-20" />
                <p className="font-sans text-sm">Your experimental tray is empty.</p>
                <div className="pt-8 w-full border-t border-dashed border-gray-200">
                    <p className="text-center text-xs uppercase font-bold text-gray-300 mb-4">Or Order via Partners</p>
                    <div className="flex gap-2 justify-center">
                        <a href={CONTACT_INFO.socials.zomato} target="https://www.zomato.com/ambala/chemical-lochaa-2-ambala-locality/order" rel="noreferrer" className="px-4 py-2 bg-red-500 text-white rounded font-bold text-xs uppercase hover:bg-red-600 transition-colors">Zomato</a>
                        <a href={CONTACT_INFO.socials.swiggy} target="https://www.swiggy.com/city/ambala/chemical-lochaa-jail-land-marke-ambala-city-rest1102572" rel="noreferrer" className="px-4 py-2 bg-orange-500 text-white rounded font-bold text-xs uppercase hover:bg-orange-600 transition-colors">Swiggy</a>
                    </div>
                </div>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartId} className="flex items-center justify-between bg-brand-cream/30 p-3 rounded-lg border border-transparent hover:border-brand-teal/20 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="scale-75 origin-left">{item.type === 'veg' ? <VegIcon /> : <NonVegIcon />}</div>
                      <p className="font-bold text-brand-teal text-sm leading-tight">{item.name}</p>
                    </div>
                    {item.selectedVariant && <p className="text-xs text-gray-500 pl-5">{item.selectedVariant}</p>}
                    <p className="text-xs font-bold text-brand-teal pl-5 mt-1">₹{item.finalPrice * item.quantity}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white border border-brand-teal/20 rounded px-2 py-1">
                    <button onClick={() => updateQuantity(item.cartId, -1)} className="text-brand-teal hover:text-red-500"><Minus size={14} /></button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.cartId, 1)} className="text-brand-teal hover:text-brand-yellow"><Plus size={14} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer / Checkout Button */}
        <div className="p-4 border-t border-brand-teal/10 bg-brand-cream">
            <div className="flex justify-between items-center mb-4">
              <span className="font-sans text-gray-600">Total Bill</span>
              <span className="font-display text-2xl font-bold text-brand-teal">₹{cartTotal}</span>
            </div>
            
            {showCheckout && window.innerWidth >= 768 ? (
               <div className="animate-in slide-in-from-bottom duration-300">
                  <form onSubmit={handleCheckout} className="space-y-3 mb-4">
                      <input required placeholder="Your Name" className="w-full p-2 border border-brand-teal/20 rounded text-sm focus:outline-none focus:border-brand-teal" />
                      <input required placeholder="Phone Number" type="tel" className="w-full p-2 border border-brand-teal/20 rounded text-sm focus:outline-none focus:border-brand-teal" />
                      <input placeholder="Table No / Address" className="w-full p-2 border border-brand-teal/20 rounded text-sm focus:outline-none focus:border-brand-teal" />
                      <button type="submit" disabled={cart.length === 0} className="w-full bg-brand-teal text-white py-3 rounded font-display uppercase tracking-wider font-bold hover:bg-brand-yellow hover:text-brand-teal transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        {orderPlaced ? <span className="flex items-center justify-center gap-2"><CheckCircle size={18}/> Sent!</span> : 'Confirm Order'}
                      </button>
                  </form>
               </div>
            ) : (
              <button 
                onClick={() => {
                    if(window.innerWidth < 768) setShowCheckout(true);
                    else setShowCheckout(true);
                }}
                disabled={cart.length === 0}
                className="w-full bg-brand-teal text-white py-4 rounded font-display uppercase tracking-wider font-bold hover:bg-brand-yellow hover:text-brand-teal transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
              </button>
            )}
            
            {/* Show checkout form on mobile when expanded */}
            {showCheckout && window.innerWidth < 768 && (
                <div className="animate-in slide-in-from-bottom duration-300 mt-4 border-t border-dashed border-gray-300 pt-4">
                  <form onSubmit={handleCheckout} className="space-y-3 pb-8">
                      <h4 className="font-display text-brand-teal uppercase font-bold">Details</h4>
                      <input required placeholder="Your Name" className="w-full p-3 border border-brand-teal/20 rounded focus:outline-none focus:border-brand-teal" />
                      <input required placeholder="Phone Number" type="tel" className="w-full p-3 border border-brand-teal/20 rounded focus:outline-none focus:border-brand-teal" />
                      <input placeholder="Table No / Address" className="w-full p-3 border border-brand-teal/20 rounded focus:outline-none focus:border-brand-teal" />
                      <button type="submit" disabled={cart.length === 0} className="w-full bg-brand-teal text-white py-4 rounded font-display uppercase tracking-wider font-bold hover:bg-brand-yellow hover:text-brand-teal transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4">
                         {orderPlaced ? <span className="flex items-center justify-center gap-2"><CheckCircle size={18}/> Sent!</span> : 'Confirm & Send to Kitchen'}
                      </button>
                  </form>
               </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default OrderOnline;