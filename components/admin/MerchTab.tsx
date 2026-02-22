import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Shirt } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { MerchItem } from '../../types';

const MerchTab: React.FC = () => {
    const [items, setItems] = useState<MerchItem[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<MerchItem | null>(null);
    const [form, setForm] = useState({ name: '', description: '', price: 0, image_url: '', stock: 0, is_active: true });

    const fetch_ = async () => {
        const { data } = await supabase.from('merchandise').select('*').order('created_at', { ascending: false });
        if (data) setItems(data);
    };
    useEffect(() => { fetch_(); }, []);

    const openForm = (item?: MerchItem) => {
        if (item) {
            setEditing(item);
            setForm({ name: item.name, description: item.description || '', price: item.price, image_url: item.image_url || '', stock: item.stock, is_active: item.is_active });
        } else {
            setEditing(null);
            setForm({ name: '', description: '', price: 0, image_url: '', stock: 0, is_active: true });
        }
        setShowForm(true);
    };

    const handleSave = async () => {
        if (!form.name.trim()) return alert('Name is required');
        if (editing) {
            await supabase.from('merchandise').update(form).eq('id', editing.id);
        } else {
            await supabase.from('merchandise').insert([form]);
        }
        setShowForm(false);
        fetch_();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this item?')) return;
        await supabase.from('merchandise').delete().eq('id', id);
        fetch_();
    };

    const toggleActive = async (item: MerchItem) => {
        await supabase.from('merchandise').update({ is_active: !item.is_active }).eq('id', item.id);
        fetch_();
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h2 className="font-display text-3xl text-brand-teal uppercase">Merchandise</h2>
                <button onClick={() => openForm()} className="bg-brand-teal text-white px-4 py-2 rounded font-bold flex items-center gap-2 hover:bg-brand-yellow hover:text-brand-teal transition-colors">
                    <Plus size={18} /> Add Item
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg border-2 border-brand-yellow shadow-lg animate-in fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-brand-teal">{editing ? 'Edit Merchandise' : 'New Merchandise'}</h3>
                        <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded"><X size={18} /></button>
                    </div>
                    <div className="grid gap-4">
                        <div>
                            <label className="block text-xs font-bold text-brand-teal mb-1 uppercase">Name *</label>
                            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded p-2 focus:outline-none focus:border-brand-yellow" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-brand-teal mb-1 uppercase">Description</label>
                            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border rounded p-2 focus:outline-none focus:border-brand-yellow" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-brand-teal mb-1 uppercase">Price (₹) *</label>
                                <input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="w-full border rounded p-2 focus:outline-none focus:border-brand-yellow" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-teal mb-1 uppercase">Stock</label>
                                <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} className="w-full border rounded p-2 focus:outline-none focus:border-brand-yellow" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-teal mb-1 uppercase">Image URL</label>
                                <input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="w-full border rounded p-2 focus:outline-none focus:border-brand-yellow" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} id="merch-active" className="rounded" />
                            <label htmlFor="merch-active" className="text-sm">Active (Visible to customers)</label>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowForm(false)} className="px-4 py-2 border rounded text-sm hover:bg-gray-50">Cancel</button>
                            <button onClick={handleSave} className="px-4 py-2 bg-brand-teal text-white rounded font-bold text-sm flex items-center gap-1 hover:bg-brand-yellow hover:text-brand-teal transition-colors"><Save size={14} /> Save</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-brand-teal/5">
                        <tr>
                            <th className="text-left p-3 text-xs font-bold text-brand-teal uppercase">Item</th>
                            <th className="text-left p-3 text-xs font-bold text-brand-teal uppercase">Price</th>
                            <th className="text-left p-3 text-xs font-bold text-brand-teal uppercase">Stock</th>
                            <th className="text-left p-3 text-xs font-bold text-brand-teal uppercase">Status</th>
                            <th className="text-right p-3 text-xs font-bold text-brand-teal uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {items.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="p-3">
                                    <div className="flex items-center gap-3">
                                        {item.image_url ? <img src={item.image_url} alt="" className="w-10 h-10 rounded object-cover" /> : <div className="w-10 h-10 rounded bg-brand-cream flex items-center justify-center"><Shirt size={16} className="text-brand-teal" /></div>}
                                        <div>
                                            <p className="font-bold text-brand-teal">{item.name}</p>
                                            {item.description && <p className="text-xs text-gray-500 truncate max-w-xs">{item.description}</p>}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-3 text-sm font-mono">₹{item.price}</td>
                                <td className="p-3 text-sm">
                                    <span className={`font-mono ${item.stock === 0 ? 'text-red-500 font-bold' : ''}`}>{item.stock}</span>
                                </td>
                                <td className="p-3">
                                    <button onClick={() => toggleActive(item)} className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {item.is_active ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td className="p-3 text-right">
                                    <button onClick={() => openForm(item)} className="p-1.5 hover:bg-gray-100 rounded mr-1"><Edit2 size={14} className="text-brand-teal" /></button>
                                    <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-red-50 rounded"><Trash2 size={14} className="text-red-500" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {items.length === 0 && <p className="text-center py-8 text-gray-400 italic">No merchandise yet.</p>}
            </div>
        </div>
    );
};

export default MerchTab;
