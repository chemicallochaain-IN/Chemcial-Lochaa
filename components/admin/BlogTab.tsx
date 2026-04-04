import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Save, Eye, ArrowLeft, Image, Film, Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link, Type, Code, Quote, Table, Smile, Heading1, Heading2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { BlogPost } from '../../types';

const BlogTab: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [editing, setEditing] = useState<BlogPost | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [title, setTitle] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [status, setStatus] = useState<'draft' | 'published'>('draft');
    const [uploading, setUploading] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchPosts = async () => {
        const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
        if (data) setPosts(data);
    };

    useEffect(() => { fetchPosts(); }, []);

    const exec = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    };

    const insertImage = async (file: File) => {
        setUploading(true);
        try {
            const ext = file.name.split('.').pop();
            const path = `blog/${Date.now()}.${ext}`;
            const { error } = await supabase.storage.from('blog-media').upload(path, file);
            if (error) throw error;
            const { data } = supabase.storage.from('blog-media').getPublicUrl(path);
            exec('insertImage', data.publicUrl);
        } catch (e) {
            console.error('Upload failed:', e);
            alert('Image upload failed. Make sure the blog-media storage bucket exists.');
        }
        setUploading(false);
    };

    const insertVideo = () => {
        const url = prompt('Enter video URL (YouTube, Vimeo, etc.):');
        if (url) {
            let embedUrl = url;
            const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
            if (ytMatch) embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
            const html = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:16px 0;"><iframe src="${embedUrl}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen></iframe></div>`;
            exec('insertHTML', html);
        }
    };

    const insertTable = () => {
        const html = `<table style="width:100%;border-collapse:collapse;margin:16px 0;"><tr><td style="border:1px solid #ccc;padding:8px;">Cell 1</td><td style="border:1px solid #ccc;padding:8px;">Cell 2</td><td style="border:1px solid #ccc;padding:8px;">Cell 3</td></tr><tr><td style="border:1px solid #ccc;padding:8px;">Cell 4</td><td style="border:1px solid #ccc;padding:8px;">Cell 5</td><td style="border:1px solid #ccc;padding:8px;">Cell 6</td></tr></table>`;
        exec('insertHTML', html);
    };

    const insertEmoji = () => {
        const emojis = ['😀', '😂', '❤️', '🔥', '👍', '🎉', '🧪', '🍔', '🍕', '🌶️', '⭐', '✅', '🚀', '💡', '📢'];
        const emoji = prompt(`Pick an emoji:\n${emojis.join(' ')}`);
        if (emoji) exec('insertText', emoji);
    };

    const insertSymbol = () => {
        const symbols = ['©', '®', '™', '°', '±', '×', '÷', '→', '←', '↑', '↓', '•', '…', '—', '€', '£', '¥', '₹'];
        const sym = prompt(`Pick a symbol:\n${symbols.join(' ')}`);
        if (sym) exec('insertText', sym);
    };

    const handleSave = async () => {
        const content = editorRef.current?.innerHTML || '';
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
            setEditing(post);
            setIsNew(false);
            setTitle(post.title);
            setCoverImage(post.cover_image_url || '');
            setStatus(post.status);
            setTimeout(() => {
                if (editorRef.current) editorRef.current.innerHTML = post.content;
            }, 50);
        } else {
            setEditing({} as BlogPost);
            setIsNew(true);
            setTitle('');
            setCoverImage('');
            setStatus('draft');
            setTimeout(() => {
                if (editorRef.current) editorRef.current.innerHTML = '';
            }, 50);
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
    const ToolBtn = ({ onClick, icon: Icon, title, active }: { onClick: () => void; icon: any; title: string; active?: boolean }) => (
        <button onClick={onClick} title={title} className={`p-1.5 rounded hover:bg-brand-cream transition-colors ${active ? 'bg-brand-cream text-brand-teal' : 'text-gray-600'}`}>
            <Icon size={16} />
        </button>
    );

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

            {/* Toolbar */}
            <div className="flex flex-wrap gap-0.5 bg-white border border-gray-200 rounded-t p-1.5 sticky top-20 z-10">
                <ToolBtn onClick={() => exec('formatBlock', 'h1')} icon={Heading1} title="Heading 1" />
                <ToolBtn onClick={() => exec('formatBlock', 'h2')} icon={Heading2} title="Heading 2" />
                <ToolBtn onClick={() => exec('formatBlock', 'p')} icon={Type} title="Paragraph" />
                <div className="w-px bg-gray-200 mx-1" />
                <ToolBtn onClick={() => exec('bold')} icon={Bold} title="Bold" />
                <ToolBtn onClick={() => exec('italic')} icon={Italic} title="Italic" />
                <ToolBtn onClick={() => exec('underline')} icon={UnderlineIcon} title="Underline" />
                <ToolBtn onClick={() => exec('strikeThrough')} icon={Type} title="Strikethrough" />
                <div className="w-px bg-gray-200 mx-1" />
                <ToolBtn onClick={() => exec('insertUnorderedList')} icon={List} title="Bullet List" />
                <ToolBtn onClick={() => exec('insertOrderedList')} icon={ListOrdered} title="Numbered List" />
                <ToolBtn onClick={() => exec('formatBlock', 'blockquote')} icon={Quote} title="Quote" />
                <ToolBtn onClick={() => exec('formatBlock', 'pre')} icon={Code} title="Code Block" />
                <div className="w-px bg-gray-200 mx-1" />
                <ToolBtn onClick={() => exec('justifyLeft')} icon={AlignLeft} title="Align Left" />
                <ToolBtn onClick={() => exec('justifyCenter')} icon={AlignCenter} title="Align Center" />
                <ToolBtn onClick={() => exec('justifyRight')} icon={AlignRight} title="Align Right" />
                <div className="w-px bg-gray-200 mx-1" />
                <ToolBtn onClick={() => { const url = prompt('Enter URL:'); if (url) exec('createLink', url); }} icon={Link} title="Insert Link" />
                <ToolBtn onClick={() => { const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*'; input.onchange = (e: any) => { if (e.target.files[0]) insertImage(e.target.files[0]); }; input.click(); }} icon={Image} title="Insert Image" />
                <ToolBtn onClick={insertVideo} icon={Film} title="Insert Video" />
                <ToolBtn onClick={insertTable} icon={Table} title="Insert Table" />
                <div className="w-px bg-gray-200 mx-1" />
                <ToolBtn onClick={insertEmoji} icon={Smile} title="Insert Emoji" />
                <ToolBtn onClick={insertSymbol} icon={Type} title="Insert Symbol" />
            </div>

            {/* Editor */}
            <div
                ref={editorRef}
                contentEditable
                className="min-h-[400px] bg-white border border-t-0 border-gray-200 rounded-b p-6 focus:outline-none prose prose-lg max-w-none [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-brand-teal [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-brand-teal [&_blockquote]:border-l-4 [&_blockquote]:border-brand-yellow [&_blockquote]:pl-4 [&_blockquote]:italic [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded [&_a]:text-brand-teal [&_a]:underline [&_table]:w-full [&_td]:border [&_td]:border-gray-300 [&_td]:p-2 [&_img]:max-w-full [&_img]:rounded [&_img]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4 [&_li]:mb-2"
                suppressContentEditableWarning
            />
        </div>
    );
};

export default BlogTab;
