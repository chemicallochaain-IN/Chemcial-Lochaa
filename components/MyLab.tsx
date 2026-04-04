import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';
import { 
  ShoppingBag, Award, Gift, Shirt, Calendar, Settings, 
  ExternalLink, Clock, MapPin, Edit2, LogOut, Beaker, Check, Loader2 
} from 'lucide-react';
import { CONTACT_INFO } from '../constants';

interface MyLabProps {
  user: User;
  onLogout: () => void;
  onOpenOrder: () => void;
}

type TabType = 'orders' | 'loyalty' | 'rewards' | 'merch' | 'events' | 'settings';

const MyLab: React.FC<MyLabProps> = ({ user, onLogout, onOpenOrder }) => {
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [rewards, setRewards] = useState<any[]>([]);
  const [merch, setMerch] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'rewards') fetchRewards();
    if (activeTab === 'merch') fetchMerch();
    if (activeTab === 'events') fetchEvents();
  }, [activeTab]);

  const fetchRewards = async () => {
    setLoading(true);
    const { data } = await supabase.from('rewards').select('*').order('created_at', { ascending: false });
    if (data) setRewards(data);
    setLoading(false);
  };

  const fetchMerch = async () => {
    setLoading(true);
    const { data } = await supabase.from('merchandise').select('*').order('created_at', { ascending: false });
    if (data) setMerch(data);
    setLoading(false);
  };

  const fetchEvents = async () => {
    setLoading(true);
    const { data } = await supabase.from('events').select('*').order('date', { ascending: true });
    if (data) setEvents(data);
    setLoading(false);
  };

  const tabs = [
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'loyalty', label: 'My Loyalty', icon: Award },
    { id: 'rewards', label: 'Rewards', icon: Gift },
    { id: 'merch', label: 'Merchandise', icon: Shirt },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'settings', label: 'Account', icon: Settings },
  ];

  // --- SUB-COMPONENTS ---

  const OrdersTab = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display text-2xl text-brand-teal uppercase">Order History</h3>
        <button onClick={onOpenOrder} className="bg-brand-teal text-brand-cream px-4 py-2 rounded font-display text-sm uppercase hover:bg-brand-yellow hover:text-brand-teal transition-colors">
          Start New Order
        </button>
      </div>
      
      {/* External Links */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <a href={CONTACT_INFO.socials.zomato} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-4 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors">
           <ExternalLink size={16} className="text-red-500" /> <span className="font-bold text-red-600">Order on Zomato</span>
        </a>
        <a href={CONTACT_INFO.socials.swiggy} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-4 bg-orange-50 border border-orange-100 rounded-lg hover:bg-orange-100 transition-colors">
           <ExternalLink size={16} className="text-orange-500" /> <span className="font-bold text-orange-600">Order on Swiggy</span>
        </a>
      </div>

      {/* Mock Orders */}
      <div className="space-y-4">
        {[1, 2, 3].map((order) => (
          <div key={order} className="bg-white border border-brand-teal/20 rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-display text-lg text-brand-teal font-bold">#{1000 + order}</span>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold uppercase">Delivered</span>
              </div>
              <p className="text-sm text-gray-500 font-sans flex items-center gap-1">
                <Clock size={14} /> {new Date().toLocaleDateString()} • ₹{450 + (order * 100)}
              </p>
              <p className="text-sm text-gray-700 mt-2">
                2x Classic Fried Chicken Burger, 1x Hazelnut Cold Coffee
              </p>
            </div>
            <button className="text-brand-teal text-sm font-bold underline hover:text-brand-yellow">Repeat Order</button>
          </div>
        ))}
      </div>
    </div>
  );

  const LoyaltyTab = () => {
    // 9 slots to match the requirement of "3rd, 6th, 9th" logic.
    // The image has 7, but logic dictates 9. We will follow logic but style like image.
    const totalSlots = 9; 
    const points = user.loyaltyPoints;

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-brand-cream border-2 border-brand-teal rounded-lg p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/10 rounded-bl-full"></div>
          
          <div className="text-center mb-10">
            <h3 className="font-display text-4xl text-brand-teal uppercase tracking-widest mb-2">Loyalty Card</h3>
            <p className="font-sans text-brand-teal/70">Collect stamps to unlock experimental rewards!</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8 max-w-3xl mx-auto mb-12">
            {Array.from({ length: totalSlots }).map((_, idx) => {
              const slotNum = idx + 1;
              const isRewardSlot = slotNum % 3 === 0;
              const isStamped = points >= slotNum;

              return (
                <div key={idx} className="relative group">
                  {/* Hand-drawn circle effect using border radius */}
                  <div 
                    className={`w-20 h-20 md:w-24 md:h-24 border-4 rounded-[50%_40%_60%_40%/60%_50%_60%_40%] flex items-center justify-center transition-all duration-300 transform ${
                      isStamped 
                        ? 'bg-brand-teal border-brand-teal rotate-2' 
                        : 'bg-transparent border-brand-teal -rotate-1 hover:rotate-2'
                    }`}
                  >
                    {isStamped ? (
                      <Beaker className="text-brand-yellow w-10 h-10 md:w-12 md:h-12 animate-in zoom-in duration-300" />
                    ) : isRewardSlot ? (
                       <Gift className="text-brand-teal/50 w-8 h-8 md:w-10 md:h-10 animate-bounce" />
                    ) : null}
                  </div>
                  
                  {isRewardSlot && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-max text-center">
                        {isStamped ? (
                             <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1"><Check size={10} /> Unlocked</span>
                        ) : (
                             <span className="text-xs font-bold text-brand-yellow bg-brand-teal px-2 py-1 rounded-full">Freebie</span>
                        )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-center border-t-2 border-dashed border-brand-teal/30 pt-8">
            <div className="p-4">
              <span className="font-display text-2xl text-brand-teal block mb-1">3 Stamps</span>
              <p className="font-sans text-sm text-gray-600">Free Beverage</p>
            </div>
            <div className="p-4 border-t md:border-t-0 md:border-l border-dashed border-brand-teal/30">
              <span className="font-display text-2xl text-brand-teal block mb-1">6 Stamps</span>
              <p className="font-sans text-sm text-gray-600">Free Veg Burger / Sandwich</p>
            </div>
            <div className="p-4 border-t md:border-t-0 md:border-l border-dashed border-brand-teal/30">
              <span className="font-display text-2xl text-brand-teal block mb-1">9 Stamps</span>
              <p className="font-sans text-sm text-gray-600">Any Item Free!</p>
            </div>
          </div>
          
           <div className="mt-6 text-center text-xs text-gray-500 font-sans">
              *T&C: Minimum order value ₹350. One stamp per order. Cards cannot be clubbed.
           </div>
        </div>
      </div>
    );
  };

  const RewardsTab = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="font-display text-2xl text-brand-teal uppercase mb-4">Your Rewards</h3>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-brand-teal" /></div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {rewards.map(reward => (
            <div key={reward.id} className="bg-brand-yellow/10 border border-brand-yellow rounded-lg p-6 relative overflow-hidden">
               <div className="absolute -right-4 -top-4 text-brand-yellow/20"><Gift size={100} /></div>
               <h4 className="font-display text-xl text-brand-teal font-bold mb-2">{reward.title}</h4>
               <div 
                 className="text-sm text-gray-600 mb-4 prose-sm max-w-none"
                 dangerouslySetInnerHTML={{ __html: reward.description }}
               />
               <button className="bg-brand-teal text-white px-4 py-2 rounded text-sm font-bold uppercase hover:bg-brand-yellow hover:text-brand-teal transition-colors">Redeem Now</button>
            </div>
          ))}
          {rewards.length === 0 && <p className="text-gray-400 italic">No rewards available at the moment.</p>}
        </div>
      )}
    </div>
  );

  const MerchTab = () => {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h3 className="font-display text-2xl text-brand-teal uppercase mb-6">Lab Merchandise</h3>
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-brand-teal" /></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {merch.map((prod) => (
              <div key={prod.id} className="bg-white border border-brand-teal/20 rounded-lg overflow-hidden group hover:shadow-lg transition-all">
                <div className="h-40 overflow-hidden">
                  <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <h4 className="font-display text-lg text-brand-teal leading-tight mb-2">{prod.name}</h4>
                  <div 
                    className="text-xs text-gray-500 mb-3 line-clamp-2 prose-xs"
                    dangerouslySetInnerHTML={{ __html: prod.description }}
                  />
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-brand-yellow">₹{prod.price}</span>
                    <button className="p-1.5 bg-brand-teal text-white rounded hover:bg-brand-yellow hover:text-brand-teal transition-colors">
                      <ShoppingBag size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {merch.length === 0 && <p className="text-gray-400 italic">No merchandise available yet.</p>}
          </div>
        )}
      </div>
    );
  };

  const EventsTab = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="mb-10">
          <h3 className="font-display text-2xl text-brand-teal uppercase mb-4">Upcoming Exclusive Events</h3>
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-brand-teal" /></div>
          ) : (
            <div className="space-y-6">
              {events.map(event => (
                <div key={event.id} className="bg-gradient-to-r from-brand-teal to-blue-900 text-white p-6 rounded-lg shadow-lg relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div>
                        {event.is_exclusive && <span className="bg-brand-yellow text-brand-teal text-xs font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block">Exclusive</span>}
                        <h4 className="font-display text-3xl mb-2">{event.title}</h4>
                        <div 
                          className="opacity-90 max-w-lg mb-4 text-sm prose-invert prose-sm"
                          dangerouslySetInnerHTML={{ __html: event.description }}
                        />
                        <div className="flex items-center gap-4 text-sm font-bold mb-4">
                          <span className="flex items-center gap-1"><MapPin size={14} /> {event.location}</span>
                          <span className="flex items-center gap-1"><Clock size={14} /> {new Date(event.date).toLocaleDateString()} at {event.time}</span>
                        </div>
                        <button className="bg-white text-brand-teal px-4 py-2 rounded font-bold hover:bg-brand-yellow transition-colors">RSVP Now</button>
                      </div>
                      <div className="hidden md:block text-center bg-white/10 p-4 rounded backdrop-blur-sm min-w-[80px]">
                         <span className="block text-2xl font-bold font-display">{new Date(event.date).getDate()}</span>
                         <span className="uppercase text-xs tracking-wider">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                      </div>
                    </div>
                  </div>
                  <Beaker className="absolute -right-10 -bottom-10 text-white opacity-10 w-64 h-64" />
                </div>
              ))}
              {events.length === 0 && <p className="text-gray-400 italic">No upcoming events found.</p>}
            </div>
          )}
       </div>

       <div>
         <h3 className="font-display text-2xl text-brand-teal uppercase mb-4">Host Your Event</h3>
         <form className="bg-white p-6 border border-brand-teal/20 rounded-lg space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Event Type</label>
                  <select className="w-full p-2 border border-gray-300 rounded focus:border-brand-teal focus:outline-none">
                    <option>Birthday Party</option>
                    <option>Corporate Luncheon</option>
                    <option>Private Workshop</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Expected Guests</label>
                  <input type="number" className="w-full p-2 border border-gray-300 rounded focus:border-brand-teal focus:outline-none" placeholder="e.g. 20" />
               </div>
            </div>
            <div>
               <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
               <input type="date" className="w-full p-2 border border-gray-300 rounded focus:border-brand-teal focus:outline-none" />
            </div>
            <div>
               <label className="block text-sm font-bold text-gray-700 mb-1">Special Requirements</label>
               <textarea rows={3} className="w-full p-2 border border-gray-300 rounded focus:border-brand-teal focus:outline-none" placeholder="Any theme or specific menu items?"></textarea>
            </div>
            <button className="w-full bg-brand-teal text-white py-3 rounded font-display uppercase tracking-wider font-bold hover:bg-brand-yellow hover:text-brand-teal transition-colors">Submit Request</button>
         </form>
       </div>
    </div>
  );

  const SettingsTab = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="font-display text-2xl text-brand-teal uppercase mb-6">Account Settings</h3>
      
      <div className="bg-white p-8 rounded-lg border border-brand-teal/20 shadow-sm">
        <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-8">
           <img src={user.avatar || "https://via.placeholder.com/150"} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-brand-cream" />
           <div>
             <button className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 transition-colors flex items-center gap-2 mb-2">
               <Edit2 size={14} /> Change Photo
             </button>
             <p className="text-xs text-gray-500">JPG, PNG or GIF. Max 2MB.</p>
           </div>
        </div>

        <form className="space-y-6">
           <div className="grid md:grid-cols-2 gap-6">
              <div>
                 <label className="block text-sm font-bold text-brand-teal mb-1">Full Name</label>
                 <input type="text" defaultValue={user.name} className="w-full p-2 border border-gray-300 rounded bg-gray-50" />
              </div>
              <div>
                 <label className="block text-sm font-bold text-brand-teal mb-1">Email</label>
                 <input type="email" defaultValue={user.email} className="w-full p-2 border border-gray-300 rounded bg-gray-50" readOnly />
              </div>
              <div>
                 <label className="block text-sm font-bold text-brand-teal mb-1">Phone</label>
                 <input type="tel" defaultValue={user.phone} className="w-full p-2 border border-gray-300 rounded" />
              </div>
              <div>
                 <label className="block text-sm font-bold text-brand-teal mb-1">Password</label>
                 <input type="password" placeholder="Change Password" className="w-full p-2 border border-gray-300 rounded" />
              </div>
           </div>
           <div>
              <label className="block text-sm font-bold text-brand-teal mb-1">Delivery Address</label>
              <div className="relative">
                 <MapPin className="absolute top-3 left-3 text-gray-400" size={16} />
                 <textarea defaultValue={user.address} rows={3} className="w-full p-2 pl-10 border border-gray-300 rounded"></textarea>
              </div>
           </div>
           
           <div className="flex justify-between pt-4">
              <button type="button" onClick={onLogout} className="text-red-500 flex items-center gap-2 hover:underline">
                 <LogOut size={16} /> Sign Out
              </button>
              <button type="submit" className="bg-brand-teal text-white px-6 py-2 rounded font-bold hover:bg-brand-yellow hover:text-brand-teal transition-colors">
                 Save Changes
              </button>
           </div>
        </form>
      </div>
    </div>
  );

  // --- MAIN LAYOUT ---

  return (
    <div className="min-h-screen pt-20 bg-graph-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Sidebar / Topbar */}
          <div className="lg:col-span-3">
             <div className="bg-white rounded-lg shadow-md border border-brand-teal/10 overflow-hidden sticky top-24">
                <div className="p-6 bg-brand-teal text-white text-center">
                   <div className="w-20 h-20 bg-brand-cream rounded-full mx-auto mb-3 p-1">
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                   </div>
                   <h2 className="font-display text-xl">{user.name}</h2>
                   <p className="text-brand-yellow text-sm font-mono">{user.loyaltyPoints} Stamp{user.loyaltyPoints !== 1 ? 's' : ''}</p>
                </div>
                
                <nav className="p-2 space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                        activeTab === tab.id 
                          ? 'bg-brand-cream text-brand-teal font-bold shadow-sm' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <tab.icon size={18} />
                      <span className="uppercase tracking-wide text-sm">{tab.label}</span>
                    </button>
                  ))}
                </nav>
             </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-9">
            {activeTab === 'orders' && <OrdersTab />}
            {activeTab === 'loyalty' && <LoyaltyTab />}
            {activeTab === 'rewards' && <RewardsTab />}
            {activeTab === 'merch' && <MerchTab />}
            {activeTab === 'events' && <EventsTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MyLab;