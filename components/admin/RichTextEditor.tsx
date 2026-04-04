import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link, Type, Code, Quote, Table, Smile, Heading1, Heading2, Image, Film } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface RichTextEditorProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder = "Type something...", minHeight = "200px" }) => {
    const editorRef = useRef<HTMLDivElement>(null);

    // Initialize content once on mount or when value changes externally (not during typing)
    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const exec = (command: string, val?: string) => {
        document.execCommand(command, false, val);
        editorRef.current?.focus();
        handleInput();
    };

    const insertImage = async (file: File) => {
        try {
            const ext = file.name.split('.').pop();
            const path = `blog-media/inline/${Date.now()}.${ext}`;
            const { error } = await supabase.storage.from('site-images').upload(path, file);
            if (error) {
                // Try blog-media bucket if site-images fails
                const res2 = await supabase.storage.from('blog-media').upload(path, file);
                if (res2.error) throw res2.error;
                const { data } = supabase.storage.from('blog-media').getPublicUrl(path);
                exec('insertImage', data.publicUrl);
                return;
            }
            const { data } = supabase.storage.from('site-images').getPublicUrl(path);
            exec('insertImage', data.publicUrl);
        } catch (e) {
            console.error('Upload failed:', e);
            alert('Image upload failed.');
        }
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

    const ToolBtn = ({ onClick, icon: Icon, title }: { onClick: () => void; icon: any; title: string }) => (
        <button type="button" onClick={(e) => { e.preventDefault(); onClick(); }} title={title} className="p-1.5 rounded hover:bg-brand-cream text-gray-600 transition-colors">
            <Icon size={16} />
        </button>
    );

    return (
        <div className="border border-gray-300 rounded overflow-hidden flex flex-col bg-white">
            <div className="flex flex-wrap gap-0.5 bg-gray-50 border-b border-gray-200 p-1.5">
                <ToolBtn onClick={() => exec('formatBlock', 'h1')} icon={Heading1} title="Heading 1" />
                <ToolBtn onClick={() => exec('formatBlock', 'h2')} icon={Heading2} title="Heading 2" />
                <ToolBtn onClick={() => exec('formatBlock', 'p')} icon={Type} title="Paragraph" />
                <div className="w-px bg-gray-300 mx-1 my-1" />
                <ToolBtn onClick={() => exec('bold')} icon={Bold} title="Bold" />
                <ToolBtn onClick={() => exec('italic')} icon={Italic} title="Italic" />
                <ToolBtn onClick={() => exec('underline')} icon={UnderlineIcon} title="Underline" />
                <ToolBtn onClick={() => exec('strikeThrough')} icon={Type} title="Strikethrough" />
                <div className="w-px bg-gray-300 mx-1 my-1" />
                <ToolBtn onClick={() => exec('insertUnorderedList')} icon={List} title="Bullet List" />
                <ToolBtn onClick={() => exec('insertOrderedList')} icon={ListOrdered} title="Numbered List" />
                <ToolBtn onClick={() => exec('formatBlock', 'blockquote')} icon={Quote} title="Quote" />
                <ToolBtn onClick={() => exec('formatBlock', 'pre')} icon={Code} title="Code Block" />
                <div className="w-px bg-gray-300 mx-1 my-1" />
                <ToolBtn onClick={() => exec('justifyLeft')} icon={AlignLeft} title="Align Left" />
                <ToolBtn onClick={() => exec('justifyCenter')} icon={AlignCenter} title="Align Center" />
                <ToolBtn onClick={() => exec('justifyRight')} icon={AlignRight} title="Align Right" />
                <div className="w-px bg-gray-300 mx-1 my-1" />
                <ToolBtn onClick={() => { const url = prompt('Enter URL:'); if (url) exec('createLink', url); }} icon={Link} title="Insert Link" />
                <ToolBtn onClick={() => { const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*'; input.onchange = (e: any) => { if (e.target.files[0]) insertImage(e.target.files[0]); }; input.click(); }} icon={Image} title="Insert Image" />
                <ToolBtn onClick={insertVideo} icon={Film} title="Insert Video" />
                <ToolBtn onClick={insertTable} icon={Table} title="Insert Table" />
                <div className="w-px bg-gray-300 mx-1 my-1" />
                <ToolBtn onClick={insertEmoji} icon={Smile} title="Insert Emoji" />
                <ToolBtn onClick={insertSymbol} icon={Type} title="Insert Symbol" />
            </div>

            <div 
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onBlur={handleInput}
                className="w-full focus:outline-none p-4 prose prose-sm max-w-none 
                    [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-brand-teal [&_h1]:mt-4 [&_h1]:mb-2
                    [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-brand-teal [&_h2]:mt-4 [&_h2]:mb-2
                    [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:mb-2
                    [&_blockquote]:border-l-4 [&_blockquote]:border-brand-yellow [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600
                    [&_a]:text-brand-teal [&_a]:underline [&_a]:hover:text-brand-yellow
                    [&_img]:rounded-lg [&_img]:my-4 [&_img]:max-w-full
                    [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded [&_pre]:overflow-x-auto
                    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1
                    [&_table]:w-full [&_td]:border [&_td]:border-gray-300 [&_td]:p-2 [&_th]:border [&_th]:border-gray-300 [&_th]:p-2 [&_th]:bg-brand-cream"
                style={{ minHeight }}
                data-placeholder={placeholder}
            />
            <style>{`
                div[contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    pointer-events: none;
                    display: block;
                }
            `}</style>
        </div>
    );
};
