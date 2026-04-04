import React, { useState, useEffect } from 'react';
import { Gift, Plus, Edit2, Trash2, Save, X, Upload, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { PartyOffer } from '../../types';

const ACCEPTED_FORMATS = '.png,.jpg,.jpeg,.svg';

const PartyOffersTab: React.FC = () => {
  const [offers, setOffers] = useState<PartyOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    price_info: '',
    image_url: '',
    is_active: true,
    sort_order: 0
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('party_offers')
        .select('*')
        .order('sort_order');
      if (!error && data) setOffers(data);
    } catch (err) {
      console.error('Error fetching party offers:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ title: '', description: '', price_info: '', image_url: '', is_active: true, sort_order: offers.length });
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    setShowForm(false);
    setError(null);
  };

  const startEdit = (offer: PartyOffer) => {
    setForm({
      title: offer.title,
      description: offer.description,
      price_info: offer.price_info || '',
      image_url: offer.image_url || '',
      is_active: offer.is_active,
      sort_order: offer.sort_order
    });
    setImagePreview(offer.image_url || null);
    setImageFile(null);
    setEditingId(offer.id);
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
    const fileName = `party_offer_${Date.now()}.${ext}`;
    const filePath = `party_offers/${fileName}`;

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
    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      let imageUrl = form.image_url;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        price_info: form.price_info.trim() || null,
        image_url: imageUrl || null,
        is_active: form.is_active,
        sort_order: form.sort_order,
        updated_at: new Date().toISOString()
      };

      if (editingId) {
        const { error } = await supabase.from('party_offers').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('party_offers').insert(payload);
        if (error) throw error;
      }

      resetForm();
      await fetchOffers();
    } catch (err: any) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this party offer? This cannot be undone.')) return;
    try {
      const { error } = await supabase.from('party_offers').delete().eq('id', id);
      if (error) throw error;
      await fetchOffers();
    } catch (err: any) {
      setError(err.message || 'Delete failed');
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await supabase.from('party_offers').update({ is_active: !isActive }).eq('id', id);
      await fetchOffers();
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
        <h2 className="font-display text-3xl text-brand-teal uppercase">Party Offers & Events</h2>
        <button
          onClick={() => { if (showForm) resetForm(); else { resetForm(); setShowForm(true); } }}
          className="bg-brand-teal text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-bold hover:bg-brand-yellow hover:text-brand-teal transition-colors"
        >
          {showForm && !editingId ? <><X size={14} /> Cancel</> : <><Plus size={14} /> New Offer</>}
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
            {editingId ? 'Edit Party Offer' : 'New Party Offer'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-teal uppercase">Title *</label>
              <input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="E.g. Corporate Lunch Package"
                className="w-full p-2.5 border rounded focus:outline-none focus:border-brand-teal text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-teal uppercase">Pricing Info</label>
              <input
                value={form.price_info}
                onChange={e => setForm({ ...form, price_info: e.target.value })}
                placeholder="E.g. Starting at ₹499 per person"
                className="w-full p-2.5 border rounded focus:outline-none focus:border-brand-teal text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-teal uppercase">Description * (Menus, details...)</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Full details of the package, menu options, inclusions..."
              rows={4}
              className="w-full p-2.5 border rounded focus:outline-none focus:border-brand-teal text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-teal uppercase">Image Overlay</label>
              <input
                type="file"
                accept={ACCEPTED_FORMATS}
                onChange={handleImageChange}
                className="text-sm w-full"
              />
              <p className="text-xs text-gray-400">Accepts: PNG, JPG, JPEG, SVG. Max 5MB.</p>
            </div>
            {imagePreview && (
              <div className="relative w-40 h-28 rounded overflow-hidden border bg-white">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  onClick={() => { setImageFile(null); setImagePreview(null); setForm({ ...form, image_url: '' }); }}
                  className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded"
                >
                  <X size={10} />
                </button>
              </div>
            )}
            
            <div className="space-y-1 mt-4">
              <label className="text-xs font-bold text-brand-teal uppercase">Sort Order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 border rounded focus:outline-none focus:border-brand-teal text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={e => setForm({ ...form, is_active: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm font-bold text-gray-700">Active (visible to customers)</span>
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

      {/* Offers List */}
      <div className="bg-white p-6 rounded-lg border border-brand-teal/20">
        {offers.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Gift size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-bold">No party offers yet</p>
            <p className="text-sm">Click "New Offer" to create a package or menu.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {offers.map(offer => (
              <div
                key={offer.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all hover:shadow-md ${
                  offer.is_active ? 'bg-white border-brand-teal/10' : 'bg-gray-50 border-gray-200 opacity-60'
                } ${editingId === offer.id ? 'ring-2 ring-brand-yellow' : ''}`}
              >
                {/* Image Preview */}
                <div className="w-20 h-16 rounded overflow-hidden flex-shrink-0 bg-gray-100 border">
                  {offer.image_url ? (
                    <img src={offer.image_url} alt={offer.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Gift size={20} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-brand-teal truncate">{offer.title}</h4>
                    {offer.price_info && (
                      <span className="text-[10px] bg-brand-yellow text-brand-teal px-1.5 py-0.5 rounded font-bold">{offer.price_info}</span>
                    )}
                    {!offer.is_active && (
                      <span className="text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded font-bold uppercase">Hidden</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{offer.description}</p>
                </div>

                {/* Sort Order */}
                <span className="text-xs text-gray-400 font-mono tabular-nums">#{offer.sort_order}</span>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => toggleActive(offer.id, offer.is_active)}
                    className="p-1.5 hover:bg-gray-100 rounded text-gray-400 transition-colors"
                    title={offer.is_active ? 'Hide' : 'Show'}
                  >
                    {offer.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    onClick={() => startEdit(offer)}
                    className="p-1.5 hover:bg-brand-teal hover:text-white rounded text-gray-400 transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(offer.id)}
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

export default PartyOffersTab;
