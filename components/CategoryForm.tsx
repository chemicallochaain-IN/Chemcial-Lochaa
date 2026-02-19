import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { MenuCategory } from '../types';

interface CategoryFormProps {
    editingCategory?: MenuCategory;
    onClose: () => void;
    onSave: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ editingCategory, onClose, onSave }) => {
    const isEditing = !!editingCategory;

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [note, setNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (editingCategory) {
            setTitle(editingCategory.title);
            setSlug(editingCategory.id);
            setNote(editingCategory.note || '');
        }
    }, [editingCategory]);

    // Auto-generate slug from title (only in add mode)
    useEffect(() => {
        if (!isEditing) {
            setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
        }
    }, [title, isEditing]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSaving(true);

        const payload = {
            title: title.trim(),
            note: note.trim() || null,
        };

        try {
            if (isEditing) {
                const { error: updateError } = await supabase
                    .from('categories')
                    .update(payload)
                    .eq('id', editingCategory!.id);
                if (updateError) throw updateError;
            } else {
                if (!slug.trim()) {
                    throw new Error('Category ID (slug) cannot be empty');
                }
                const { error: insertError } = await supabase
                    .from('categories')
                    .insert({ id: slug.trim(), ...payload });
                if (insertError) throw insertError;
            }
            onSave();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to save category');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-xl w-full max-w-md shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-brand-cream rounded-t-xl">
                    <h2 className="font-display text-2xl text-brand-teal uppercase">
                        {isEditing ? 'Edit Category' : 'Add New Category'}
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

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Category Title *</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="e.g. Burgers, Beverages, Desserts"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    {/* Slug / ID */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                            Category ID {isEditing && <span className="text-gray-400 font-normal">(read-only)</span>}
                        </label>
                        <input
                            type="text"
                            required
                            value={slug}
                            onChange={e => !isEditing && setSlug(e.target.value)}
                            readOnly={isEditing}
                            className={`w-full p-3 border border-gray-300 rounded-lg outline-none transition-all font-mono text-sm ${isEditing
                                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                    : 'focus:ring-2 focus:ring-brand-teal focus:border-transparent'
                                }`}
                        />
                        {!isEditing && (
                            <p className="text-xs text-gray-400 mt-1">Auto-generated from title. Used as a unique identifier.</p>
                        )}
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Note</label>
                        <input
                            type="text"
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            placeholder='e.g. (Served with fries)'
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition-all"
                        />
                        <p className="text-xs text-gray-400 mt-1">Optional note displayed below the category title</p>
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
                            {isSaving ? 'Saving...' : isEditing ? 'Update Category' : 'Add Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryForm;
