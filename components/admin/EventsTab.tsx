import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { EventItem } from '../../types';
import { RichTextEditor } from './RichTextEditor';

const EventsTab: React.FC = () => {
    const [items, setItems] = useState<EventItem[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<EventItem | null>(null);
    const [form, setForm] = useState({ title: '', description: '', event_date: '', location: '', image_url: '', is_active: true });

    const fetch_ = async () => {
        const { data } = await supabase.from('events').select('*').order('event_date', { ascending: false });
        if (data) setItems(data);
    };
    useEffect(() => { fetch_(); }, []);

    const openForm = (item?: EventItem) => {
        if (item) {
            setEditing(item);
            setForm({
                title: item.title,
                description: item.description || '',
                event_date: item.event_date ? new Date(item.event_date).toISOString().slice(0, 16) : '',
                location: item.location || '',
                image_url: item.image_url || '',
                is_active: item.is_active,
            });
        } else {
            setEditing(null);
            setForm({ title: '', description: '', event_date: '', location: '', image_url: '', is_active: true });
        }
        setShowForm(true);
    };

    const handleSave = async () => {
        if (!form.title.trim()) return alert('Title is required');
        if (!form.event_date) return alert('Date is required');
        const payload = { ...form, event_date: new Date(form.event_date).toISOString() };
        if (editing) {
            await supabase.from('events').update(payload).eq('id', editing.id);
        } else {
            await supabase.from('events').insert([payload]);
        }
        setShowForm(false);
        fetch_();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this event?')) return;
        await supabase.from('events').delete().eq('id', id);
        fetch_();
    };

    const toggleActive = async (item: EventItem) => {
        await supabase.from('events').update({ is_active: !item.is_active }).eq('id', item.id);
        fetch_();
    };

    const isPast = (date: string) => new Date(date) < new Date();

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h2 className="font-display text-3xl text-brand-teal uppercase">Events</h2>
                <button onClick={() => openForm()} className="bg-brand-teal text-white px-4 py-2 rounded font-bold flex items-center gap-2 hover:bg-brand-yellow hover:text-brand-teal transition-colors">
                    <Plus size={18} /> Add Event
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg border-2 border-brand-yellow shadow-lg animate-in fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-brand-teal">{editing ? 'Edit Event' : 'New Event'}</h3>
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
                                placeholder="Event details..." 
                                minHeight="150px"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-brand-teal mb-1 uppercase">Date & Time *</label>
                                <input type="datetime-local" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} className="w-full border rounded p-2 focus:outline-none focus:border-brand-yellow" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-teal mb-1 uppercase">Location</label>
                                <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full border rounded p-2 focus:outline-none focus:border-brand-yellow" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-brand-teal mb-1 uppercase">Image URL</label>
                            <input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="w-full border rounded p-2 focus:outline-none focus:border-brand-yellow" />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} id="event-active" className="rounded" />
                            <label htmlFor="event-active" className="text-sm">Active (Visible to customers)</label>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowForm(false)} className="px-4 py-2 border rounded text-sm hover:bg-gray-50">Cancel</button>
                            <button onClick={handleSave} className="px-4 py-2 bg-brand-teal text-white rounded font-bold text-sm flex items-center gap-1 hover:bg-brand-yellow hover:text-brand-teal transition-colors"><Save size={14} /> Save</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid gap-4">
                {items.map(item => (
                    <div key={item.id} className={`bg-white p-5 rounded-lg border shadow-sm flex items-start gap-4 ${isPast(item.event_date) ? 'opacity-60' : 'border-brand-teal/20'}`}>
                        {item.image_url && <img src={item.image_url} alt="" className="w-24 h-16 object-cover rounded" />}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-brand-teal text-lg">{item.title}</h3>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {item.is_active ? 'Active' : 'Inactive'}
                                </span>
                                {isPast(item.event_date) && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600">Past</span>}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(item.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                {item.location && <span>📍 {item.location}</span>}
                            </div>
                            {item.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>}
                        </div>
                        <div className="flex gap-1">
                            <button onClick={() => toggleActive(item)} className="p-1.5 hover:bg-gray-100 rounded text-xs">{item.is_active ? '🙈' : '👁️'}</button>
                            <button onClick={() => openForm(item)} className="p-1.5 hover:bg-gray-100 rounded"><Edit2 size={14} className="text-brand-teal" /></button>
                            <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-red-50 rounded"><Trash2 size={14} className="text-red-500" /></button>
                        </div>
                    </div>
                ))}
                {items.length === 0 && <p className="text-center py-8 text-gray-400 italic">No events yet.</p>}
            </div>
        </div>
    );
};

export default EventsTab;
