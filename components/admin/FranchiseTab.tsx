import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, MapPin, Phone, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Franchise } from '../../types';
import { RichTextEditor } from './RichTextEditor';

const FranchiseTab: React.FC = () => {
    const [items, setItems] = useState<Franchise[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Franchise | null>(null);
    const [form, setForm] = useState({ owner_name: '', email: '', phone: '', location: '', status: 'inquiry' as Franchise['status'], notes: '' });
    const [filter, setFilter] = useState<string>('all');

    const fetch_ = async () => {
        const { data } = await supabase.from('franchises').select('*').order('created_at', { ascending: false });
        if (data) setItems(data);
    };
    useEffect(() => { fetch_(); }, []);

    const openForm = (item?: Franchise) => {
        if (item) {
            setEditing(item);
            setForm({ owner_name: item.owner_name, email: item.email || '', phone: item.phone || '', location: item.location, status: item.status, notes: item.notes || '' });
        } else {
            setEditing(null);
            setForm({ owner_name: '', email: '', phone: '', location: '', status: 'inquiry', notes: '' });
        }
        setShowForm(true);
    };

    const handleSave = async () => {
        if (!form.owner_name.trim() || !form.location.trim()) return alert('Owner name and location are required');
        if (editing) {
            await supabase.from('franchises').update(form).eq('id', editing.id);
        } else {
            await supabase.from('franchises').insert([form]);
        }
        setShowForm(false);
        fetch_();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this franchise?')) return;
        await supabase.from('franchises').delete().eq('id', id);
        fetch_();
    };

    const updateStatus = async (id: string, status: Franchise['status']) => {
        await supabase.from('franchises').update({ status }).eq('id', id);
        fetch_();
    };

    const statusColors: Record<string, string> = {
        inquiry: 'bg-blue-100 text-blue-700',
        approved: 'bg-yellow-100 text-yellow-700',
        active: 'bg-green-100 text-green-700',
        inactive: 'bg-gray-100 text-gray-500',
    };

    const filtered = filter === 'all' ? items : items.filter(i => i.status === filter);
    const counts = {
        all: items.length,
        inquiry: items.filter(i => i.status === 'inquiry').length,
        approved: items.filter(i => i.status === 'approved').length,
        active: items.filter(i => i.status === 'active').length,
        inactive: items.filter(i => i.status === 'inactive').length,
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h2 className="font-display text-3xl text-brand-teal uppercase">Franchises</h2>
                <button onClick={() => openForm()} className="bg-brand-teal text-white px-4 py-2 rounded font-bold flex items-center gap-2 hover:bg-brand-yellow hover:text-brand-teal transition-colors">
                    <Plus size={18} /> Add Franchise
                </button>
            </div>

            {/* Filter */}
            <div className="flex gap-2 flex-wrap">
                {(['all', 'inquiry', 'approved', 'active', 'inactive'] as const).map(s => (
                    <button key={s} onClick={() => setFilter(s)}
                        className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-colors ${filter === s ? 'bg-brand-teal text-white' : 'bg-white border hover:bg-gray-50'}`}
                    >
                        {s} ({counts[s]})
                    </button>
                ))}
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg border-2 border-brand-yellow shadow-lg animate-in fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-brand-teal">{editing ? 'Edit Franchise' : 'New Franchise'}</h3>
                        <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded"><X size={18} /></button>
                    </div>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-brand-teal mb-1 uppercase">Owner Name *</label>
                                <input value={form.owner_name} onChange={e => setForm({ ...form, owner_name: e.target.value })} className="w-full border rounded p-2 focus:outline-none focus:border-brand-yellow" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-teal mb-1 uppercase">Location *</label>
                                <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full border rounded p-2 focus:outline-none focus:border-brand-yellow" />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-brand-teal mb-1 uppercase">Email</label>
                                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border rounded p-2 focus:outline-none focus:border-brand-yellow" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-teal mb-1 uppercase">Phone</label>
                                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border rounded p-2 focus:outline-none focus:border-brand-yellow" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-teal mb-1 uppercase">Status</label>
                                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Franchise['status'] })} className="w-full border rounded p-2 focus:outline-none focus:border-brand-yellow bg-white">
                                    <option value="inquiry">Inquiry</option>
                                    <option value="approved">Approved</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-brand-teal mb-1 uppercase">Notes</label>
                            <RichTextEditor 
                                value={form.notes} 
                                onChange={val => setForm({ ...form, notes: val })} 
                                placeholder="Internal notes or inquiry details..." 
                                minHeight="150px"
                            />
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
                            <th className="text-left p-3 text-xs font-bold text-brand-teal uppercase">Owner</th>
                            <th className="text-left p-3 text-xs font-bold text-brand-teal uppercase">Location</th>
                            <th className="text-left p-3 text-xs font-bold text-brand-teal uppercase">Contact</th>
                            <th className="text-left p-3 text-xs font-bold text-brand-teal uppercase">Status</th>
                            <th className="text-right p-3 text-xs font-bold text-brand-teal uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filtered.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="p-3">
                                    <p className="font-bold text-brand-teal">{item.owner_name}</p>
                                    {item.notes && <p className="text-xs text-gray-400 truncate max-w-xs">{item.notes}</p>}
                                </td>
                                <td className="p-3 text-sm"><span className="flex items-center gap-1"><MapPin size={12} /> {item.location}</span></td>
                                <td className="p-3 text-xs space-y-0.5">
                                    {item.email && <p className="flex items-center gap-1"><Mail size={10} /> {item.email}</p>}
                                    {item.phone && <p className="flex items-center gap-1"><Phone size={10} /> {item.phone}</p>}
                                </td>
                                <td className="p-3">
                                    <select
                                        value={item.status}
                                        onChange={e => updateStatus(item.id, e.target.value as Franchise['status'])}
                                        className={`px-2 py-0.5 rounded-full text-xs font-bold border-0 cursor-pointer ${statusColors[item.status]}`}
                                    >
                                        <option value="inquiry">Inquiry</option>
                                        <option value="approved">Approved</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </td>
                                <td className="p-3 text-right">
                                    <button onClick={() => openForm(item)} className="p-1.5 hover:bg-gray-100 rounded mr-1"><Edit2 size={14} className="text-brand-teal" /></button>
                                    <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-red-50 rounded"><Trash2 size={14} className="text-red-500" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && <p className="text-center py-8 text-gray-400 italic">No franchises found.</p>}
            </div>
        </div>
    );
};

export default FranchiseTab;
