import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Gift } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Reward } from '../../types';
import { RichTextEditor } from './RichTextEditor';

const RewardsTab: React.FC = () => {
    const [items, setItems] = useState<Reward[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Reward | null>(null);
    const [form, setForm] = useState({ title: '', description: '', points_required: 0, image_url: '', is_active: true });

    const fetch_ = async () => {
        const { data } = await supabase.from('rewards').select('*').order('created_at', { ascending: false });
        if (data) setItems(data);
    };
    useEffect(() => { fetch_(); }, []);

    const openForm = (item?: Reward) => {
        if (item) {
            setEditing(item);
            setForm({ title: item.title, description: item.description || '', points_required: item.points_required, image_url: item.image_url || '', is_active: item.is_active });
        } else {
            setEditing(null);
            setForm({ title: '', description: '', points_required: 0, image_url: '', is_active: true });
        }
        setShowForm(true);
    };

    const handleSave = async () => {
        if (!form.title.trim()) return alert('Title is required');
        if (editing) {
            await supabase.from('rewards').update(form).eq('id', editing.id);
        } else {
            await supabase.from('rewards').insert([form]);
        }
        setShowForm(false);
        fetch_();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this reward?')) return;
        await supabase.from('rewards').delete().eq('id', id);
        fetch_();
    };

    const toggleActive = async (item: Reward) => {
        await supabase.from('rewards').update({ is_active: !item.is_active }).eq('id', item.id);
        fetch_();
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h2 className="font-display text-3xl text-brand-teal uppercase">Rewards</h2>
                <button onClick={() => openForm()} className="bg-brand-teal text-white px-4 py-2 rounded font-bold flex items-center gap-2 hover:bg-brand-yellow hover:text-brand-teal transition-colors">
                    <Plus size={18} /> Add Reward
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="bg-white p-6 rounded-lg border-2 border-brand-yellow shadow-lg animate-in fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-brand-teal">{editing ? 'Edit Reward' : 'New Reward'}</h3>
                        <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded"><X size={18} /></button>
                    </div>
                    <div className="grid gap-4">
                        <div>
                            <label className="block text-xs font-bold text-brand-teal mb-1 uppercase">Title *</label>
                            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border rounded p-2 focus:outline-none focus:border-brand-yellow" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-brand-teal uppercase">Description</label>
                            <RichTextEditor 
                                value={form.description} 
                                onChange={val => setForm({ ...form, description: val })} 
                                placeholder="Details about this reward..."
                                minHeight="150px"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-brand-teal mb-1 uppercase">Points Required</label>
                                <input type="number" value={form.points_required} onChange={e => setForm({ ...form, points_required: Number(e.target.value) })} className="w-full border rounded p-2 focus:outline-none focus:border-brand-yellow" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-teal mb-1 uppercase">Image URL</label>
                                <input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="w-full border rounded p-2 focus:outline-none focus:border-brand-yellow" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} id="reward-active" className="rounded" />
                            <label htmlFor="reward-active" className="text-sm">Active</label>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowForm(false)} className="px-4 py-2 border rounded text-sm hover:bg-gray-50">Cancel</button>
                            <button onClick={handleSave} className="px-4 py-2 bg-brand-teal text-white rounded font-bold text-sm flex items-center gap-1 hover:bg-brand-yellow hover:text-brand-teal transition-colors"><Save size={14} /> Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-lg border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-brand-teal/5">
                        <tr>
                            <th className="text-left p-3 text-xs font-bold text-brand-teal uppercase">Reward</th>
                            <th className="text-left p-3 text-xs font-bold text-brand-teal uppercase">Points</th>
                            <th className="text-left p-3 text-xs font-bold text-brand-teal uppercase">Status</th>
                            <th className="text-right p-3 text-xs font-bold text-brand-teal uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {items.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="p-3">
                                    <div className="flex items-center gap-3">
                                        {item.image_url ? <img src={item.image_url} alt="" className="w-10 h-10 rounded object-cover" /> : <div className="w-10 h-10 rounded bg-brand-cream flex items-center justify-center"><Gift size={16} className="text-brand-teal" /></div>}
                                        <div>
                                            <p className="font-bold text-brand-teal">{item.title}</p>
                                            {item.description && <p className="text-xs text-gray-500 truncate max-w-xs">{item.description}</p>}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-3 text-sm font-mono">{item.points_required} pts</td>
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
                {items.length === 0 && <p className="text-center py-8 text-gray-400 italic">No rewards yet.</p>}
            </div>
        </div>
    );
};

export default RewardsTab;
