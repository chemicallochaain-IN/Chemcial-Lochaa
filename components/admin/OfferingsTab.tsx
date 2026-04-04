import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Edit2, Trash2, Save, X, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Offering } from '../../types';
import { RichTextEditor } from './RichTextEditor';

const ACCEPTED_FORMATS = '.png,.jpg,.jpeg,.svg';

const OfferingsTab: React.FC = () => {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    image_url: '',
    is_active: true,
    sort_order: 0
  });

  useEffect(() => {
    fetchOfferings();
  }, []);

  const fetchOfferings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('offerings')
        .select('*')
        .order('sort_order');
      if (!error && data) setOfferings(data);
    } catch (err) {
      console.error('Error fetching offerings:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: '', description: '', image_url: '', is_active: true, sort_order: offerings.length });
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    setShowForm(false);
    setError(null);
  };

  const startEdit = (offering: Offering) => {
    setForm({
      name: offering.name,
      description: offering.description,
      image_url: offering.image_url || '',
      is_active: offering.is_active,
      sort_order: offering.sort_order
    });
    setImagePreview(offering.image_url || null);
    setImageFile(null);
    setEditingId(offering.id);
    setShowForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!['png', 'jpg', 'jpeg', 'svg'].includes(ext || '')) {
        setError('Invalid format. Allowed: PNG, JPG, JPEG, SVG');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const fileName = `offering_${Date.now()}.${ext}`;
    const filePath = `offerings/${fileName}`;

    const { error } = await supabase.storage
      .from('site-images')
      .upload(filePath, file, { upsert: true });

    if (error) throw error;

    const { data } = supabase.storage
      .from('site-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.description.trim()) {
      setError('Name and description are required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      let imageUrl = form.image_url;

      // Upload new image if selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        image_url: imageUrl || null,
        is_active: form.is_active,
        sort_order: form.sort_order,
        updated_at: new Date().toISOString()
      };

      if (editingId) {
        const { error } = await supabase.from('offerings').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('offerings').insert(payload);
        if (error) throw error;
      }

      resetForm();
      await fetchOfferings();
    } catch (err: any) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this offering? This cannot be undone.')) return;
    try {
      const { error } = await supabase.from('offerings').delete().eq('id', id);
      if (error) throw error;
      await fetchOfferings();
    } catch (err: any) {
      setError(err.message || 'Delete failed');
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await supabase.from('offerings').update({ is_active: !isActive }).eq('id', id);
      await fetchOfferings();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-brand-teal" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-3xl text-brand-teal uppercase">Our Offerings</h2>
        <button
          onClick={() => { if (showForm) resetForm(); else { resetForm(); setShowForm(true); } }}
          className="bg-brand-teal text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-bold hover:bg-brand-yellow hover:text-brand-teal transition-colors"
        >
          {showForm && !editingId ? <><X size={14} /> Cancel</> : <><Plus size={14} /> New Offering</>}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle size={16} /> {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600"><X size={14} /></button>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-brand-cream p-6 rounded-lg border border-brand-teal/20 space-y-4 animate-in fade-in slide-in-from-top-2">
          <h3 className="font-bold text-lg text-brand-teal">
            {editingId ? 'Edit Offering' : 'New Offering'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-teal uppercase">Name *</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="E.g. Korean Fried Chicken Burger"
                className="w-full p-2.5 border rounded focus:outline-none focus:border-brand-teal text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-teal uppercase">Sort Order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 border rounded focus:outline-none focus:border-brand-teal text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-teal uppercase">Description *</label>
            <RichTextEditor
              value={form.description}
              onChange={val => setForm({ ...form, description: val })}
              placeholder="A dreamy, evocative description of this offering..."
              minHeight="150px"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-teal uppercase">Image</label>
              <input
                type="file"
                accept={ACCEPTED_FORMATS}
                onChange={handleImageChange}
                className="text-sm w-full"
              />
              <p className="text-xs text-gray-400">Accepts: PNG, JPG, JPEG, SVG. Max 5MB.</p>
            </div>
            {imagePreview && (
              <div className="relative w-40 h-28 rounded overflow-hidden border">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  onClick={() => { setImageFile(null); setImagePreview(null); setForm({ ...form, image_url: '' }); }}
                  className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded"
                >
                  <X size={10} />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={e => setForm({ ...form, is_active: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm font-bold text-gray-700">Active (visible on website)</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-brand-yellow text-brand-teal px-6 py-2 rounded font-bold text-sm hover:bg-brand-teal hover:text-white transition-colors disabled:opacity-50 flex items-center gap-1"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {editingId ? 'Update' : 'Create'}
            </button>
            <button
              onClick={resetForm}
              className="border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Offerings List */}
      <div className="bg-white p-6 rounded-lg border border-brand-teal/20">
        {offerings.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Sparkles size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-bold">No offerings yet</p>
            <p className="text-sm">Click "New Offering" to create your first item.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {offerings.map(offering => (
              <div
                key={offering.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all hover:shadow-md ${
                  offering.is_active ? 'bg-white border-brand-teal/10' : 'bg-gray-50 border-gray-200 opacity-60'
                } ${editingId === offering.id ? 'ring-2 ring-brand-yellow' : ''}`}
              >
                {/* Image Preview */}
                <div className="w-20 h-16 rounded overflow-hidden flex-shrink-0 bg-gray-100 border">
                  {offering.image_url ? (
                    <img src={offering.image_url} alt={offering.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Sparkles size={20} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-brand-teal truncate">{offering.name}</h4>
                    {!offering.is_active && (
                      <span className="text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded font-bold uppercase">Hidden</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{offering.description}</p>
                </div>

                {/* Sort Order */}
                <span className="text-xs text-gray-400 font-mono tabular-nums">#{offering.sort_order}</span>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => toggleActive(offering.id, offering.is_active)}
                    className="p-1.5 hover:bg-gray-100 rounded text-gray-400 transition-colors"
                    title={offering.is_active ? 'Hide' : 'Show'}
                  >
                    {offering.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    onClick={() => startEdit(offering)}
                    className="p-1.5 hover:bg-brand-teal hover:text-white rounded text-gray-400 transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(offering.id)}
                    className="p-1.5 hover:bg-red-500 hover:text-white rounded text-gray-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferingsTab;
