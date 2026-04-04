import React, { useState, useEffect } from 'react';
import { Image, Upload, Trash2, Save, Loader2, Plus, X, GripVertical, AlertCircle } from 'lucide-react';
import { supabase, supabaseUrl } from '../../lib/supabase';
import { SiteImage } from '../../types';

const ACCEPTED_FORMATS = '.png,.jpg,.jpeg,.svg';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

type ImageSection = 'branding' | 'gallery';

const ImageManagerTab: React.FC = () => {
  const [section, setSection] = useState<ImageSection>('branding');
  const [siteImages, setSiteImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_images')
        .select('*')
        .order('sort_order');
      if (!error && data) {
         setSiteImages(data);
         window.dispatchEvent(new Event('siteImageUpdated'));
      }
    } catch (err) {
      console.error('Error fetching images:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageByKey = (key: string) => siteImages.find(img => img.image_key === key);
  const getGalleryImages = () => siteImages.filter(img => img.image_key.startsWith('gallery_')).sort((a, b) => a.sort_order - b.sort_order);

  const validateFile = (file: File): string | null => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['png', 'jpg', 'jpeg', 'svg'].includes(ext || '')) {
      return 'Invalid file format. Allowed: PNG, JPG, JPEG, SVG';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 5MB limit';
    }
    return null;
  };

  const uploadImage = async (file: File, imageKey: string, title?: string, description?: string) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(imageKey);
    setError(null);

    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${imageKey}_${Date.now()}.${ext}`;
      const filePath = `${imageKey}/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;

      // Check if image_key already exists (for single images like logo, favicon)
      const existing = getImageByKey(imageKey);

      if (existing && !imageKey.startsWith('gallery_')) {
        // Update existing
        const { error: dbError } = await supabase
          .from('site_images')
          .update({ image_url: imageUrl, title, description, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
        if (dbError) throw dbError;
      } else {
        // Insert new
        const maxSort = siteImages.filter(i => i.image_key.startsWith('gallery_')).length;
        const { error: dbError } = await supabase
          .from('site_images')
          .insert({
            image_key: imageKey,
            image_url: imageUrl,
            title: title || '',
            description: description || '',
            sort_order: imageKey.startsWith('gallery_') ? maxSort : 0
          });
        if (dbError) throw dbError;
      }

      await fetchImages();
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(null);
    }
  };

  const deleteImage = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    try {
      const { error } = await supabase.from('site_images').delete().eq('id', id);
      if (error) throw error;
      await fetchImages();
    } catch (err: any) {
      setError(err.message || 'Delete failed');
    }
  };

  const handleSingleImageUpload = (imageKey: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = ACCEPTED_FORMATS;
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        await uploadImage(file, imageKey);
      }
    };
    input.click();
  };

  // -- Gallery Image Add with title/description --
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [galleryForm, setGalleryForm] = useState({ title: '', description: '', file: null as File | null });

  const handleAddGalleryImage = async () => {
    if (!galleryForm.file) return;
    const key = `gallery_${Date.now()}`;
    await uploadImage(galleryForm.file, key, galleryForm.title, galleryForm.description);
    setGalleryForm({ title: '', description: '', file: null });
    setShowGalleryForm(false);
  };

  // -- Edit gallery image title/description inline --
  const [editingGallery, setEditingGallery] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });

  const startEditGallery = (img: SiteImage) => {
    setEditingGallery(img.id);
    setEditForm({ title: img.title || '', description: img.description || '' });
  };

  const saveEditGallery = async (id: string) => {
    try {
      await supabase.from('site_images').update({
        title: editForm.title,
        description: editForm.description,
        updated_at: new Date().toISOString()
      }).eq('id', id);
      setEditingGallery(null);
      await fetchImages();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // -- Single Image Card (for logo, favicon, about_photo) --
  const SingleImageCard = ({ imageKey, label, hint }: { imageKey: string; label: string; hint?: string }) => {
    const img = getImageByKey(imageKey);
    return (
      <div className="bg-white p-5 rounded-lg border border-brand-teal/10 hover:border-brand-teal/30 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-bold text-brand-teal text-sm uppercase tracking-wide">{label}</h4>
            {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
          </div>
          <button
            onClick={() => handleSingleImageUpload(imageKey)}
            disabled={uploading === imageKey}
            className="px-3 py-1.5 bg-brand-teal text-white text-xs font-bold rounded flex items-center gap-1 hover:bg-brand-yellow hover:text-brand-teal transition-colors disabled:opacity-50"
          >
            {uploading === imageKey ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
            {img ? 'Replace' : 'Upload'}
          </button>
        </div>
        {img ? (
          <div className="relative group">
            <img
              src={img.image_url}
              alt={label}
              className="w-full h-32 object-contain rounded border border-gray-100 bg-gray-50 p-2"
            />
            <button
              onClick={() => deleteImage(img.id)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remove"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ) : (
          <div className="h-32 bg-gray-50 rounded border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300">
            <Image size={32} />
          </div>
        )}
      </div>
    );
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
        <h2 className="font-display text-3xl text-brand-teal uppercase">Image Manager</h2>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle size={16} /> {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600"><X size={14} /></button>
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex gap-2">
        {(['branding', 'gallery'] as ImageSection[]).map(s => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className={`px-4 py-2 rounded text-sm font-bold uppercase transition-colors ${
              section === s ? 'bg-brand-teal text-white' : 'bg-white border hover:bg-gray-50 text-gray-600'
            }`}
          >
            {s === 'branding' ? '🎨 Branding' : '🖼️ Gallery'}
          </button>
        ))}
      </div>

      {/* Branding Section */}
      {section === 'branding' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SingleImageCard imageKey="logo" label="Website Logo" hint="Recommended: SVG or transparent PNG" />
          <SingleImageCard imageKey="favicon" label="Favicon" hint="Square image, 32x32 or 64x64 recommended" />
          <SingleImageCard imageKey="about_photo" label="About Section Photo" hint="The 'Scientist Brothers' photo" />
        </div>
      )}

      {/* Gallery Section */}
      {section === 'gallery' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Manage gallery images displayed on the website.</p>
            <button
              onClick={() => setShowGalleryForm(!showGalleryForm)}
              className="bg-brand-teal text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-bold hover:bg-brand-yellow hover:text-brand-teal transition-colors"
            >
              {showGalleryForm ? <X size={14} /> : <Plus size={14} />}
              {showGalleryForm ? 'Cancel' : 'Add Image'}
            </button>
          </div>

          {/* Add Gallery Image Form */}
          {showGalleryForm && (
            <div className="bg-brand-cream p-6 rounded-lg border border-brand-teal/20 space-y-4">
              <h4 className="font-bold text-brand-teal text-sm uppercase">New Gallery Image</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Image Title (e.g. Korean Fried Chicken)"
                  className="p-2 border rounded text-sm focus:outline-none focus:border-brand-teal"
                  value={galleryForm.title}
                  onChange={e => setGalleryForm({ ...galleryForm, title: e.target.value })}
                />
                <input
                  placeholder="Short Description"
                  className="p-2 border rounded text-sm focus:outline-none focus:border-brand-teal"
                  value={galleryForm.description}
                  onChange={e => setGalleryForm({ ...galleryForm, description: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept={ACCEPTED_FORMATS}
                  className="text-sm"
                  onChange={e => setGalleryForm({ ...galleryForm, file: e.target.files?.[0] || null })}
                />
                <button
                  onClick={handleAddGalleryImage}
                  disabled={!galleryForm.file || uploading !== null}
                  className="bg-brand-yellow text-brand-teal px-4 py-2 rounded font-bold text-sm hover:bg-brand-teal hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  Upload
                </button>
              </div>
            </div>
          )}

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getGalleryImages().map(img => (
              <div key={img.id} className="bg-white rounded-lg border border-brand-teal/10 overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img src={img.image_url} alt={img.title || 'Gallery'} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => deleteImage(img.id)}
                      className="p-1.5 bg-red-500 text-white rounded shadow hover:bg-red-600"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  {editingGallery === img.id ? (
                    <div className="space-y-2">
                      <input
                        value={editForm.title}
                        onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                        placeholder="Title"
                        className="w-full p-1.5 text-sm border rounded focus:outline-none focus:border-brand-teal"
                      />
                      <input
                        value={editForm.description}
                        onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                        placeholder="Description"
                        className="w-full p-1.5 text-sm border rounded focus:outline-none focus:border-brand-teal"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEditGallery(img.id)}
                          className="text-xs bg-brand-teal text-white px-3 py-1 rounded hover:bg-brand-yellow hover:text-brand-teal flex items-center gap-1"
                        >
                          <Save size={10} /> Save
                        </button>
                        <button
                          onClick={() => setEditingGallery(null)}
                          className="text-xs border px-3 py-1 rounded hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-gray-50 rounded p-1 -m-1 transition-colors"
                      onClick={() => startEditGallery(img)}
                      title="Click to edit"
                    >
                      <h4 className="font-bold text-brand-teal text-sm">{img.title || 'Untitled'}</h4>
                      <p className="text-xs text-gray-500">{img.description || 'No description — click to edit'}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {getGalleryImages().length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                <Image size={48} className="mx-auto mb-3 opacity-30" />
                <p className="font-bold">No gallery images yet</p>
                <p className="text-sm">Click "Add Image" above to upload your first gallery image.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageManagerTab;
