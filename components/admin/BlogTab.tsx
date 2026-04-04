import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Save, ArrowLeft, Image } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { BlogPost } from '../../types';
import { RichTextEditor } from './RichTextEditor';

const BlogTab: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [editing, setEditing] = useState<BlogPost | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [title, setTitle] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState<'draft' | 'published'>('draft');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchPosts = async () => {
        const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
        if (data) setPosts(data);
    };

    useEffect(() => { fetchPosts(); }, []);

    // Removed manual editor functions since they are now in RichTextEditor component

    const handleSave = async () => {
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const postData = {
            title,
            slug,
            content,
            cover_image_url: coverImage || null,
            status,
            updated_at: new Date().toISOString(),
        };

        if (isNew) {
            const { error } = await supabase.from('blog_posts').insert([{ ...postData, author_id: (await supabase.auth.getUser()).data.user?.id }]);
            if (error) { alert('Save failed: ' + error.message); return; }
        } else if (editing) {
            const { error } = await supabase.from('blog_posts').update(postData).eq('id', editing.id);
            if (error) { alert('Save failed: ' + error.message); return; }
        }
        setEditing(null);
        setIsNew(false);
        fetchPosts();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this post?')) return;
        await supabase.from('blog_posts').delete().eq('id', id);
        fetchPosts();
    };

    const openEditor = (post?: BlogPost) => {
        if (post) {
            setTitle(post.title);
            setCoverImage(post.cover_image_url || '');
            setContent(post.content);
            setStatus(post.status);
        } else {
            setEditing({} as BlogPost);
            setIsNew(true);
            setTitle('');
            setCoverImage('');
            setContent('');
            setStatus('draft');
        }
    };

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const ext = file.name.split('.').pop();
            const path = `blog/covers/${Date.now()}.${ext}`;
            const { error } = await supabase.storage.from('blog-media').upload(path, file);
            if (error) throw error;
            const { data } = supabase.storage.from('blog-media').getPublicUrl(path);
            setCoverImage(data.publicUrl);
        } catch (e) {
            alert('Upload failed');
        }
        setUploading(false);
    };

    // ──── Post List View ────
    if (!editing) {
        return (
            <div className="space-y-6 animate-in fade-in">
                <div className="flex justify-between items-center">
                    <h2 className="font-display text-3xl text-brand-teal uppercase">Blog Posts</h2>
                    <button onClick={() => openEditor()} className="bg-brand-teal text-white px-4 py-2 rounded font-bold flex items-center gap-2 hover:bg-brand-yellow hover:text-brand-teal transition-colors">
                        <Plus size={18} /> New Post
                    </button>
                </div>
                {posts.length === 0 && <p className="text-gray-500 italic">No blog posts yet. Create your first one!</p>}
                <div className="grid gap-4">
                    {posts.map(post => (
                        <div key={post.id} className="bg-white p-5 rounded-lg border border-brand-teal/20 shadow-sm flex items-start gap-4">
                            {post.cover_image_url && (
                                <img src={post.cover_image_url} alt="" className="w-24 h-16 object-cover rounded" />
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-brand-teal text-lg truncate">{post.title}</h3>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {post.status}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => openEditor(post)} className="p-2 hover:bg-gray-100 rounded" title="Edit"><Edit2 size={16} className="text-brand-teal" /></button>
                                <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-red-50 rounded" title="Delete"><Trash2 size={16} className="text-red-500" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // ──── Editor View ────
    return (
        <div className="space-y-4 animate-in fade-in">
            <button onClick={() => { setEditing(null); setIsNew(false); }} className="text-sm text-brand-teal flex items-center gap-1 hover:underline">
                <ArrowLeft size={14} /> Back to Posts
            </button>

            {/* Title */}
            <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Post Title..."
                className="w-full text-3xl font-display font-bold text-brand-teal bg-transparent border-b-2 border-brand-teal/20 pb-2 focus:outline-none focus:border-brand-yellow placeholder-gray-300"
            />

            {/* Cover Image */}
            <div className="flex items-center gap-4">
                <button onClick={() => fileInputRef.current?.click()} className="text-sm border border-brand-teal/30 px-3 py-1.5 rounded flex items-center gap-1 hover:bg-brand-cream text-brand-teal">
                    <Image size={14} /> Cover Image
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                {coverImage && <img src={coverImage} alt="cover" className="h-12 rounded border" />}
                {uploading && <span className="text-xs text-gray-500">Uploading...</span>}

                <div className="ml-auto flex items-center gap-3">
                    <select value={status} onChange={e => setStatus(e.target.value as 'draft' | 'published')} className="text-sm border rounded px-2 py-1.5 bg-white">
                        <option value="draft">📝 Draft</option>
                        <option value="published">🟢 Published</option>
                    </select>
                    <button onClick={handleSave} className="bg-brand-teal text-white px-4 py-2 rounded font-bold flex items-center gap-2 hover:bg-brand-yellow hover:text-brand-teal transition-colors text-sm">
                        <Save size={14} /> Save
                    </button>
                </div>
            </div>

            {/* Editor Content */}
            <RichTextEditor 
                value={content} 
                onChange={setContent} 
                placeholder="Start writing your lab notes..." 
                minHeight="400px"
            />
        </div>
    );
};

export default BlogTab;
