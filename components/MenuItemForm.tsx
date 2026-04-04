import React, { useState, useEffect } from 'react';
import { X, Leaf, Drumstick, Flame } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { MenuItem, MenuCategory } from '../types';
import { RichTextEditor } from './admin/RichTextEditor';

interface MenuItemFormProps {
  categories: MenuCategory[];
  editingItem?: MenuItem & { category_id?: string };
  onClose: () => void;
  onSave: () => void;
}

const ICON_OPTIONS = [
  { value: 'wheat', label: 'Wheat/Gluten' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'chilli', label: 'Spicy' },
  { value: 'nut', label: 'Nuts' },
  { value: 'egg', label: 'Egg' },
];

const MenuItemForm: React.FC<MenuItemFormProps> = ({ categories, editingItem, onClose, onSave }) => {
  const isEditing = !!editingItem;

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState<'veg' | 'non-veg' | 'both'>('veg');
  const [description, setDescription] = useState('');
  const [icons, setIcons] = useState<string[]>([]);
  const [isNew, setIsNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setCategoryId(editingItem.category_id || '');
      setPrice(String(editingItem.price));
      setType(editingItem.type);
      setDescription(editingItem.description || '');
      setIcons(editingItem.icons || []);
      setIsNew(editingItem.isNew || false);
    }
  }, [editingItem]);

  const toggleIcon = (icon: string) => {
    setIcons(prev => prev.includes(icon) ? prev.filter(i => i !== icon) : [...prev, icon]);
  };

  const generateId = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 20);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    const payload = {
      name: name.trim(),
      category_id: categoryId,
      price: price.trim(),
      type,
      description: description.trim() || null,
      icons: icons.length > 0 ? icons : null,
      is_new: isNew,
    };

    try {
      if (isEditing) {
        const { error: updateError } = await supabase
          .from('menu_items')
          .update(payload)
          .eq('id', editingItem!.id);
        if (updateError) throw updateError;
      } else {
        const itemId = generateId(name) + '-' + Date.now().toString(36);
        const { error: insertError } = await supabase
          .from('menu_items')
          .insert({ id: itemId, ...payload });
        if (insertError) throw insertError;
      }
      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save item');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-brand-cream rounded-t-xl">
          <h2 className="font-display text-2xl text-brand-teal uppercase">
            {isEditing ? 'Edit Item' : 'Add New Item'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Item Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Korean Fried Chicken Burger"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Category *</label>
            <select
              required
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition-all bg-white"
            >
              <option value="">Select a category...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.title}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Price *</label>
            <input
              type="text"
              required
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder='e.g. 230 or "250 / 270" for variants'
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition-all"
            />
            <p className="text-xs text-gray-400 mt-1">Use "250 / 270" format for veg/non-veg price variants</p>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Dietary Type *</label>
            <div className="flex gap-4">
              {([
                { value: 'veg', label: 'Veg', color: 'green', icon: <Leaf size={16} /> },
                { value: 'non-veg', label: 'Non-Veg', color: 'red', icon: <Drumstick size={16} /> },
                { value: 'both', label: 'Both', color: 'amber', icon: <Flame size={16} /> },
              ] as const).map(opt => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${
                    type === opt.value
                      ? `border-${opt.color}-500 bg-${opt.color}-50 text-${opt.color}-700 font-bold shadow-sm`
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={opt.value}
                    checked={type === opt.value}
                    onChange={() => setType(opt.value)}
                    className="sr-only"
                  />
                  {opt.icon}
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="e.g. Served with special sauce, R / L sizes"
              minHeight="120px"
            />
          </div>

          {/* Icons/Allergens */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Allergen Icons</label>
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleIcon(opt.value)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                    icons.includes(opt.value)
                      ? 'bg-brand-teal text-white border-brand-teal shadow-sm'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-brand-teal'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Is New Badge */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isNewCheck"
              checked={isNew}
              onChange={e => setIsNew(e.target.checked)}
              className="w-4 h-4 accent-brand-teal"
            />
            <label htmlFor="isNewCheck" className="text-sm font-bold text-gray-700">
              Mark as NEW (shows a badge on the menu)
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-3 bg-brand-yellow text-brand-teal font-bold rounded-lg hover:bg-brand-teal hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[3px_3px_0px_0px_rgba(1,68,91,0.2)]"
            >
              {isSaving ? 'Saving...' : isEditing ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuItemForm;
