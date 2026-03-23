import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, ShoppingBag, Users, UtensilsCrossed,
  MessageSquare, BarChart3, Settings, Search, CheckCircle,
  XCircle, Clock, ChefHat, Truck, Edit2, Plus, Trash2, Gift, Shirt, Calendar, UserPlus, Shield, FolderPlus, Send, FileText, Store, Mail, Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { User, Order, ContactMessage, MenuCategory, MenuItem } from '../types';
import MenuItemForm from './MenuItemForm';
import CategoryForm from './CategoryForm';
import BlogTab from './admin/BlogTab';
import RewardsTab from './admin/RewardsTab';
import MerchTab from './admin/MerchTab';
import EventsTab from './admin/EventsTab';
import FranchiseTab from './admin/FranchiseTab';

interface AdminDashboardProps {
  user: User;
}

type TabType = 'dashboard' | 'orders' | 'menu' | 'customers' | 'team' | 'messages' | 'merch' | 'events' | 'rewards' | 'blog' | 'franchise';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [stats, setStats] = useState({ revenue: 0, orders: 0, users: 0 });
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [menuData, setMenuData] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Menu form state
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<(MenuItem & { category_id?: string }) | undefined>(undefined);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | undefined>(undefined);

  // --- Data Fetching ---

  useEffect(() => {
    if (activeTab === 'dashboard') fetchStats();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'customers') fetchCustomers();
    if (activeTab === 'team') fetchEmployees();
    if (activeTab === 'messages') fetchMessages();
    if (activeTab === 'menu') fetchMenu();
  }, [activeTab]);

  const fetchStats = async () => {
    // In a real app, use Supabase count/sum queries
    const { data: ordersData } = await supabase.from('orders').select('total_amount');
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

    const revenue = ordersData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
    setStats({
      revenue,
      orders: ordersData?.length || 0,
      users: userCount || 0
    });
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setOrders(data);
    setIsLoading(false);
  };

  const fetchCustomers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('profiles').select('*').eq('is_admin', false);
    if (!error && data) {
      setCustomers(data.map(p => ({
        id: p.id,
        name: p.name || 'Unknown',
        email: p.email,
        loyaltyPoints: p.loyalty_points || 0,
        phone: p.phone,
        avatar: p.avatar_url
      })));
    }
    setIsLoading(false);
  };

  const fetchEmployees = async () => {
    setIsLoading(true);
    // Fetch profiles that are admins
    const { data, error } = await supabase.from('profiles').select('*').eq('is_admin', true);
    if (!error && data) {
      setEmployees(data.map(p => ({
        id: p.id,
        name: p.name || 'Unknown',
        email: p.email,
        loyaltyPoints: 0,
        phone: p.phone,
        avatar: p.avatar_url,
        isAdmin: true
      })));
    }
    setIsLoading(false);
  };

  const fetchMessages = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (!error && data) setMessages(data);
    setIsLoading(false);
  };

  const fetchMenu = async () => {
    setIsLoading(true);
    try {
      const { data: categories } = await supabase.from('categories').select('*').order('sort_order');
      const { data: items } = await supabase.from('menu_items').select('*').order('sort_order');

      if (categories && items) {
        const mergedMenu: MenuCategory[] = categories.map((cat: any) => ({
          id: cat.id,
          title: cat.title,
          note: cat.note,
          items: items.filter((item: any) => item.category_id === cat.id)
        }));
        setMenuData(mergedMenu);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const updateOrderStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    fetchOrders(); // Refresh
  };

  const updateLoyalty = async (id: string, points: number) => {
    await supabase.from('profiles').update({ loyalty_points: points }).eq('id', id);
    fetchCustomers();
  };

  // --- Sub-Components ---

  const DashboardTab = () => (
    <div className="space-y-6 animate-in fade-in">
      <h2 className="font-display text-3xl text-brand-teal uppercase">Lab Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-brand-teal/20 shadow-[4px_4px_0px_0px_rgba(1,68,91,0.1)]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-500 font-bold uppercase text-sm">Total Revenue</h3>
            <span className="p-2 bg-green-100 text-green-700 rounded-full"><BarChart3 size={20} /></span>
          </div>
          <p className="text-4xl font-display text-brand-teal">₹{stats.revenue.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-brand-teal/20 shadow-[4px_4px_0px_0px_rgba(1,68,91,0.1)]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-500 font-bold uppercase text-sm">Total Orders</h3>
            <span className="p-2 bg-blue-100 text-blue-700 rounded-full"><ShoppingBag size={20} /></span>
          </div>
          <p className="text-4xl font-display text-brand-teal">{stats.orders}</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-brand-teal/20 shadow-[4px_4px_0px_0px_rgba(1,68,91,0.1)]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-500 font-bold uppercase text-sm">Lab Partners</h3>
            <span className="p-2 bg-purple-100 text-purple-700 rounded-full"><Users size={20} /></span>
          </div>
          <p className="text-4xl font-display text-brand-teal">{stats.users}</p>
        </div>
      </div>

      {/* Recent Activity Mock */}
      <div className="bg-white rounded-lg border border-brand-teal/10 p-6">
        <h3 className="font-bold text-brand-teal mb-4">Recent Lab Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-4 text-sm border-b border-gray-100 pb-2 last:border-0">
              <div className="w-2 h-2 rounded-full bg-brand-yellow"></div>
              <span className="text-gray-500">{i * 10} mins ago</span>
              <span className="font-medium text-brand-teal">New Order received for ₹{450 * i}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const OrdersTab = () => (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-3xl text-brand-teal uppercase">Live Orders</h2>
        <button onClick={fetchOrders} className="text-sm underline">Refresh</button>
      </div>

      <div className="bg-white rounded-lg border border-brand-teal/20 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-cream text-brand-teal uppercase font-display border-b border-brand-teal/10">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-4 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                <td className="p-4">
                  <div className="font-bold text-brand-teal">{order.guest_info?.name || 'Guest'}</div>
                  <div className="text-xs text-gray-500">{order.guest_info?.phone}</div>
                </td>
                <td className="p-4">
                  {order.items?.map((item, i) => (
                    <div key={i} className="text-xs text-gray-600">
                      {item.quantity}x {item.name}
                    </div>
                  ))}
                </td>
                <td className="p-4 font-bold">₹{order.total_amount}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                    ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'ready' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => updateOrderStatus(order.id, 'preparing')} title="Start Cooking" className="p-1 hover:bg-blue-100 rounded text-blue-600"><ChefHat size={16} /></button>
                    <button onClick={() => updateOrderStatus(order.id, 'ready')} title="Mark Ready" className="p-1 hover:bg-purple-100 rounded text-purple-600"><CheckCircle size={16} /></button>
                    <button onClick={() => updateOrderStatus(order.id, 'delivered')} title="Mark Delivered" className="p-1 hover:bg-green-100 rounded text-green-600"><Truck size={16} /></button>
                    <button onClick={() => updateOrderStatus(order.id, 'cancelled')} title="Cancel" className="p-1 hover:bg-red-100 rounded text-red-600"><XCircle size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500">No active orders found in the lab.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const handleOpenAddItem = () => {
    setEditingItem(undefined);
    setShowItemForm(true);
  };

  const handleOpenEditItem = (item: MenuItem, categoryId: string) => {
    setEditingItem({ ...item, category_id: categoryId });
    setShowItemForm(true);
  };

  const handleOpenAddCategory = () => {
    setEditingCategory(undefined);
    setShowCategoryForm(true);
  };

  const handleOpenEditCategory = (cat: MenuCategory) => {
    setEditingCategory(cat);
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!confirm('Delete this category and ALL its items? This cannot be undone.')) return;
    // Delete items under the category first
    await supabase.from('menu_items').delete().eq('category_id', catId);
    await supabase.from('categories').delete().eq('id', catId);
    fetchMenu();
  };

  const MenuTab = () => (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-3xl text-brand-teal uppercase">Menu Management</h2>
        <div className="flex gap-3">
          <button
            onClick={handleOpenAddCategory}
            className="bg-white text-brand-teal border-2 border-brand-teal px-4 py-2 rounded flex items-center gap-2 hover:bg-brand-teal hover:text-white transition-colors"
          >
            <FolderPlus size={16} /> Add Category
          </button>
          <button
            onClick={handleOpenAddItem}
            className="bg-brand-teal text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-brand-yellow hover:text-brand-teal transition-colors"
          >
            <Plus size={16} /> Add Item
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-brand-teal/20">
        <div className="space-y-8">
          {menuData.length === 0 ? <p className="text-gray-500">No menu items found. Seed database or add items.</p> : null}
          {menuData.map(cat => (
            <div key={cat.id}>
              <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4">
                <div>
                  <h3 className="font-bold text-xl text-brand-teal">{cat.title}</h3>
                  {cat.note && <span className="text-xs text-gray-400">{cat.note}</span>}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleOpenEditCategory(cat)}
                    className="p-1.5 hover:bg-brand-teal hover:text-white rounded text-gray-400 transition-colors"
                    title="Edit Category"
                  ><Edit2 size={14} /></button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 hover:bg-red-500 hover:text-white rounded text-gray-400 transition-colors"
                    title="Delete Category"
                  ><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="grid gap-4">
                {cat.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-brand-teal/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-gray-800">{item.name}</div>
                        {item.isNew && <span className="text-[10px] bg-brand-yellow text-brand-teal px-1.5 py-0.5 rounded font-bold uppercase">New</span>}
                      </div>
                      <div className="text-xs text-gray-500">{item.description || 'No description'}</div>
                      {item.icons && item.icons.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {item.icons.map(icon => (
                            <span key={icon} className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">{icon}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${item.type === 'veg' ? 'bg-green-100 text-green-700' :
                        item.type === 'non-veg' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>{item.type}</span>
                      <span className="font-mono font-bold text-brand-teal">₹{item.price}</span>
                      <button
                        onClick={() => handleOpenEditItem(item, cat.id)}
                        className="p-1.5 hover:bg-brand-teal hover:text-white rounded text-gray-400 transition-colors"
                      ><Edit2 size={14} /></button>
                      <button
                        className="p-1.5 hover:bg-red-500 hover:text-white rounded text-gray-400 transition-colors"
                        onClick={async () => {
                          if (confirm('Delete this item?')) {
                            await supabase.from('menu_items').delete().eq('id', item.id);
                            fetchMenu();
                          }
                        }}
                      ><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
                {cat.items.length === 0 && (
                  <p className="text-sm text-gray-400 italic py-2">No items in this category yet.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {showItemForm && (
        <MenuItemForm
          categories={menuData}
          editingItem={editingItem}
          onClose={() => { setShowItemForm(false); setEditingItem(undefined); }}
          onSave={fetchMenu}
        />
      )}
      {showCategoryForm && (
        <CategoryForm
          editingCategory={editingCategory}
          onClose={() => { setShowCategoryForm(false); setEditingCategory(undefined); }}
          onSave={fetchMenu}
        />
      )}
    </div>
  );

  const TeamTab = () => {
    const [isAdding, setIsAdding] = useState(false);
    const [newEmployee, setNewEmployee] = useState({ name: '', email: '', password: '', isAdmin: false });

    const handleCreateEmployee = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        // Using RPC function to create user without logging out admin
        const { error } = await supabase.rpc('create_employee', {
          email: newEmployee.email,
          password: newEmployee.password,
          full_name: newEmployee.name,
          is_admin_role: newEmployee.isAdmin
        });

        if (error) throw error;

        alert('User created successfully');
        setIsAdding(false);
        setNewEmployee({ name: '', email: '', password: '', isAdmin: false });
        fetchEmployees();
      } catch (err: any) {
        alert(err.message);
      }
    };

    return (
      <div className="space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center">
          <h2 className="font-display text-3xl text-brand-teal uppercase">Lab Scientists (Team)</h2>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="bg-brand-teal text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-brand-yellow hover:text-brand-teal transition-colors"
          >
            <UserPlus size={16} /> {isAdding ? 'Cancel' : 'New Member'}
          </button>
        </div>

        {isAdding && (
          <div className="bg-brand-cream p-6 rounded-lg border border-brand-teal/20 mb-6">
            <h3 className="font-bold text-lg mb-4 text-brand-teal">Register New Employee</h3>
            <form onSubmit={handleCreateEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="Full Name"
                className="p-2 border rounded"
                required
                value={newEmployee.name}
                onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })}
              />
              <input
                placeholder="Email"
                type="email"
                className="p-2 border rounded"
                required
                value={newEmployee.email}
                onChange={e => setNewEmployee({ ...newEmployee, email: e.target.value })}
              />
              <input
                placeholder="Password"
                type="password"
                className="p-2 border rounded"
                required
                minLength={6}
                value={newEmployee.password}
                onChange={e => setNewEmployee({ ...newEmployee, password: e.target.value })}
              />
              <div className="flex items-center gap-2 bg-white p-2 border rounded">
                <input
                  type="checkbox"
                  id="adminCheck"
                  checked={newEmployee.isAdmin}
                  onChange={e => setNewEmployee({ ...newEmployee, isAdmin: e.target.checked })}
                />
                <label htmlFor="adminCheck" className="text-sm font-bold text-gray-700">Grant Admin Privileges</label>
              </div>
              <button type="submit" className="md:col-span-2 bg-brand-yellow text-brand-teal font-bold py-2 rounded hover:bg-brand-teal hover:text-white transition-colors">Create Account</button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg border border-brand-teal/20 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-cream text-brand-teal uppercase font-display border-b border-brand-teal/10">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td className="p-4 font-bold text-brand-teal">{emp.name}</td>
                  <td className="p-4">{emp.email}</td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 px-2 py-1 bg-brand-teal text-white text-xs rounded-full w-fit">
                      <Shield size={12} /> Admin
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-red-500 hover:underline text-xs" title="Requires Super Admin (Manual DB deletion for safety)">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const CustomersTab = () => (
    <div className="space-y-6 animate-in fade-in">
      <h2 className="font-display text-3xl text-brand-teal uppercase">Customers & Loyalty</h2>
      <div className="bg-white rounded-lg border border-brand-teal/20 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-cream text-brand-teal uppercase font-display border-b border-brand-teal/10">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Loyalty Stamps</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers.map(customer => (
              <tr key={customer.id}>
                <td className="p-4 font-bold text-brand-teal">{customer.name}</td>
                <td className="p-4">
                  <div>{customer.email}</div>
                  <div className="text-xs text-gray-500">{customer.phone || 'No phone'}</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-xl">{customer.loyaltyPoints}</span>
                    <div className="flex gap-1">
                      <button onClick={() => updateLoyalty(customer.id, customer.loyaltyPoints - 1)} className="w-6 h-6 bg-gray-200 rounded hover:bg-red-200 text-gray-600">-</button>
                      <button onClick={() => updateLoyalty(customer.id, customer.loyaltyPoints + 1)} className="w-6 h-6 bg-gray-200 rounded hover:bg-green-200 text-gray-600">+</button>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-gray-400 italic">View History</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const MessagesTab = () => {
    const [replySuccess, setReplySuccess] = useState<string | null>(null);
    const [replySuccessType, setReplySuccessType] = useState<'whatsapp' | 'email'>('whatsapp');
    const [msgFilter, setMsgFilter] = useState('all');

    // Email reply form state
    const [emailReplyTo, setEmailReplyTo] = useState<ContactMessage | null>(null);
    const [emailReplyText, setEmailReplyText] = useState('');
    const [emailSending, setEmailSending] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);

    const MESSAGE_CATEGORIES = ['all', 'Book an Event / Party', 'Franchise Enquiry', 'Feedback', 'Other'];
    const filteredMessages = msgFilter === 'all' ? messages : messages.filter(m => m.subject === msgFilter);
    const getCategoryCount = (cat: string) => cat === 'all' ? messages.length : messages.filter(m => m.subject === cat).length;

    const updateMessageStatus = async (id: string, status: string) => {
      await supabase.from('contact_messages').update({ status }).eq('id', id);
      fetchMessages();
    };

    const getWhatsAppLink = (phone: string, msg: ContactMessage) => {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const text = encodeURIComponent(
        `Hi ${msg.name},\n\nThank you for contacting Chemical Lochaa regarding "${msg.subject}".\n\n`
      );
      return `https://wa.me/${cleanPhone}?text=${text}`;
    };

    const handleWhatsAppReply = async (msg: ContactMessage) => {
      if (!msg.phone) {
        alert('No phone number available for this contact.');
        return;
      }
      window.open(getWhatsAppLink(msg.phone, msg), '_blank');
      await updateMessageStatus(msg.id, 'replied');
      setReplySuccessType('whatsapp');
      setReplySuccess(msg.id);
      setTimeout(() => setReplySuccess(null), 3000);
    };

    const handleEmailReply = async () => {
      if (!emailReplyTo || !emailReplyText.trim()) return;
      setEmailSending(true);
      setEmailError(null);

      try {
        const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://mrphakgvwefkknalkalj.supabase.co';
        const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycGhha2d2d2Vma2tuYWxrYWxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNTU4NDgsImV4cCI6MjA4NjczMTg0OH0._AmkNzbZj8yHPYPj4HJaRD0pshyBEibsf3V1VPR_Ad4';

        const res = await fetch(`${supabaseUrl}/functions/v1/send-reply`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            customerName: emailReplyTo.name,
            customerEmail: emailReplyTo.email,
            originalSubject: emailReplyTo.subject,
            originalMessage: emailReplyTo.message,
            replyMessage: emailReplyText.trim(),
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to send email');

        await updateMessageStatus(emailReplyTo.id, 'replied');
        setReplySuccessType('email');
        setReplySuccess(emailReplyTo.id);
        setEmailReplyTo(null);
        setEmailReplyText('');
        setTimeout(() => setReplySuccess(null), 3000);
      } catch (err: any) {
        setEmailError(err.message || 'Failed to send email reply');
      } finally {
        setEmailSending(false);
      }
    };

    const getStatusBadge = (status: string) => {
      switch (status) {
        case 'new':
          return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 uppercase">New</span>;
        case 'read':
          return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-200 text-gray-600 uppercase">Read</span>;
        case 'replied':
          return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 uppercase flex items-center gap-1"><CheckCircle size={10} /> Replied</span>;
        default:
          return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500 uppercase">{status}</span>;
      }
    };

    return (
      <div className="space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center">
          <h2 className="font-display text-3xl text-brand-teal uppercase">Communications</h2>
          <button onClick={fetchMessages} className="text-sm underline">Refresh</button>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {MESSAGE_CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setMsgFilter(cat)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${msgFilter === cat ? 'bg-brand-teal text-white' : 'bg-white border hover:bg-gray-50'}`}
            >
              {cat === 'all' ? 'All' : cat} ({getCategoryCount(cat)})
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredMessages.map(msg => (
            <div key={msg.id} className={`bg-white p-6 rounded-lg border shadow-sm transition-all ${msg.status === 'new' ? 'border-blue-300 border-l-4' :
              msg.status === 'replied' ? 'border-green-200' : 'border-brand-teal/20'
              }`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-lg text-brand-teal">{msg.subject}</h3>
                  {getStatusBadge(msg.status)}
                </div>
                <span className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <span className="font-bold">{msg.name}</span>
                <span>&lt;{msg.email}&gt;</span>
                {msg.phone && <span>• 📱 {msg.phone}</span>}
              </div>
              <p className="text-gray-700 bg-gray-50 p-4 rounded border border-gray-100 whitespace-pre-wrap">{msg.message}</p>

              {/* Reply Success Toast */}
              {replySuccess === msg.id && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm flex items-center gap-2 animate-in fade-in">
                  <CheckCircle size={16} />
                  {replySuccessType === 'whatsapp' ? `WhatsApp opened for ${msg.name}` : `Email sent to ${msg.email}`}
                </div>
              )}

              {/* Email Reply Form (inline, slides open below the message) */}
              {emailReplyTo?.id === msg.id && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-brand-teal flex items-center gap-2">
                      <Mail size={14} /> Reply via Email to {msg.name} &lt;{msg.email}&gt;
                    </h4>
                    <button
                      onClick={() => { setEmailReplyTo(null); setEmailReplyText(''); setEmailError(null); }}
                      className="text-xs text-gray-500 hover:text-red-500 font-bold"
                    >
                      ✕ Cancel
                    </button>
                  </div>
                  <textarea
                    value={emailReplyText}
                    onChange={e => setEmailReplyText(e.target.value)}
                    rows={4}
                    placeholder={`Type your reply to ${msg.name}...`}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal text-sm"
                  />
                  {emailError && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded text-red-600 text-xs flex items-center gap-1">
                      <XCircle size={12} /> {emailError}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={handleEmailReply}
                      disabled={emailSending || !emailReplyText.trim()}
                      className="text-xs bg-brand-teal text-white px-4 py-2 rounded hover:bg-brand-yellow hover:text-brand-teal transition-colors font-bold flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {emailSending ? <><Loader2 size={12} className="animate-spin" /> Sending...</> : <><Send size={12} /> Send Email</>}
                    </button>
                    <button
                      onClick={() => { setEmailReplyTo(null); setEmailReplyText(''); setEmailError(null); }}
                      className="text-xs border border-gray-300 px-3 py-2 rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex gap-2 flex-wrap">
                {msg.phone && (
                  <button
                    onClick={() => handleWhatsAppReply(msg)}
                    className="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition-colors font-bold flex items-center gap-1"
                  >
                    <MessageSquare size={12} /> Reply via WhatsApp
                  </button>
                )}
                {msg.email && (
                  <button
                    onClick={() => {
                      setEmailReplyTo(emailReplyTo?.id === msg.id ? null : msg);
                      setEmailReplyText('');
                      setEmailError(null);
                    }}
                    className={`text-xs px-3 py-1.5 rounded font-bold flex items-center gap-1 transition-colors ${
                      emailReplyTo?.id === msg.id
                        ? 'bg-blue-700 text-white'
                        : 'bg-brand-teal text-white hover:bg-brand-yellow hover:text-brand-teal'
                    }`}
                  >
                    <Mail size={12} /> Reply via Email
                  </button>
                )}
                {msg.status === 'new' && (
                  <button
                    onClick={() => updateMessageStatus(msg.id, 'read')}
                    className="text-xs border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}
          {messages.length === 0 && <p className="text-gray-500 italic">No messages found.</p>}
        </div>
      </div>
    );
  };

  // Placeholder for extra tabs
  const PlaceholderTab = ({ title, icon: Icon }: any) => (
    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg text-gray-400">
      <Icon size={48} className="mb-4 opacity-50" />
      <h3 className="font-bold text-xl">{title} Module</h3>
      <p>Coming to the lab soon.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-teal text-white fixed h-[calc(100vh-80px)] overflow-y-auto z-20 hidden md:block">
        <div className="p-6">
          <h1 className="font-display text-2xl text-brand-yellow">Lab Control</h1>
          <p className="text-xs text-brand-cream/60">Admin Console v1.0</p>
        </div>
        <nav className="space-y-1 px-3">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'orders', label: 'Live Orders', icon: ShoppingBag },
            { id: 'menu', label: 'Menu & Prices', icon: UtensilsCrossed },
            { id: 'blog', label: 'Blog', icon: FileText },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'team', label: 'Team', icon: Users },
            { id: 'messages', label: 'Communications', icon: MessageSquare },
            { id: 'merch', label: 'Merchandise', icon: Shirt },
            { id: 'events', label: 'Events', icon: Calendar },
            { id: 'rewards', label: 'Rewards', icon: Gift },
            { id: 'franchise', label: 'Franchises', icon: Store },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id
                ? 'bg-brand-yellow text-brand-teal font-bold'
                : 'hover:bg-white/10 text-brand-cream'
                }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal"></div>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && <DashboardTab />}
            {activeTab === 'orders' && <OrdersTab />}
            {activeTab === 'menu' && <MenuTab />}
            {activeTab === 'blog' && <BlogTab />}
            {activeTab === 'customers' && <CustomersTab />}
            {activeTab === 'team' && <TeamTab />}
            {activeTab === 'messages' && <MessagesTab />}
            {activeTab === 'merch' && <MerchTab />}
            {activeTab === 'events' && <EventsTab />}
            {activeTab === 'rewards' && <RewardsTab />}
            {activeTab === 'franchise' && <FranchiseTab />}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;