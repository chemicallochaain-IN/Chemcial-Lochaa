import React, { useState, useEffect } from 'react';
import { ArrowRight, Calendar, ArrowLeft, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BlogPost } from '../types';

interface BlogProps {
  onViewPost?: (post: BlogPost) => void;
}

const Blog: React.FC<BlogProps> = ({ onViewPost }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  };

  const getExcerpt = (html: string, maxLen = 150) => {
    const text = html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
    return text.length > maxLen ? text.slice(0, maxLen) + '…' : text;
  };

  const getReadTime = (html: string) => {
    const words = html.replace(/<[^>]+>/g, '').split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  // ─── Full Post View ───
  if (selectedPost) {
    return (
      <section id="blog" className="py-20 bg-white border-t border-brand-teal/10">
        <div className="max-w-3xl mx-auto px-6">
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 text-brand-teal font-bold mb-8 hover:text-brand-yellow transition-colors"
          >
            <ArrowLeft size={18} /> Back to Lab Notes
          </button>

          {selectedPost.cover_image_url && (
            <img
              src={selectedPost.cover_image_url}
              alt={selectedPost.title}
              className="w-full h-64 md:h-80 object-cover rounded-lg mb-8"
            />
          )}

          <h1 className="font-display text-4xl md:text-5xl text-brand-teal font-bold leading-tight mb-4">
            {selectedPost.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-brand-teal/10">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(selectedPost.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {getReadTime(selectedPost.content)} min read
            </span>
          </div>

          <div
            className="prose prose-lg max-w-none
              [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-brand-teal [&_h1]:mt-8 [&_h1]:mb-4
              [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-brand-teal [&_h2]:mt-6 [&_h2]:mb-3
              [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:mb-4
              [&_blockquote]:border-l-4 [&_blockquote]:border-brand-yellow [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600
              [&_a]:text-brand-teal [&_a]:underline [&_a]:hover:text-brand-yellow
              [&_img]:rounded-lg [&_img]:my-6 [&_img]:max-w-full
              [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded [&_pre]:overflow-x-auto
              [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6
              [&_table]:w-full [&_td]:border [&_td]:border-gray-300 [&_td]:p-2 [&_th]:border [&_th]:border-gray-300 [&_th]:p-2 [&_th]:bg-brand-cream"
            dangerouslySetInnerHTML={{ __html: selectedPost.content }}
          />
        </div>
      </section>
    );
  }

  // ─── Posts Grid ───
  // Fallback static posts if no published posts in database yet
  const fallbackPosts = [
    {
      id: 'static-1', title: "From Telescopes to Tables: Our Journey",
      content: "How an astrophysicist and a forensic scientist decided to trade their labs for a kitchen. The physics behind a perfectly grilled burger.",
      created_at: "2024-10-12", status: 'published' as const, slug: '', updated_at: '',
    },
    {
      id: 'static-2', title: "The Chemistry of the Perfect Sauce",
      content: "We spent 3 months calibrating the viscosity and spice levels of our signature Makhni sauce. Here is the science behind the flavor.",
      created_at: "2024-11-05", status: 'published' as const, slug: '', updated_at: '',
    },
    {
      id: 'static-3', title: "Why 'Chemical Lochaa'?",
      content: "Lochaa means trouble, but in our lab, it means the good kind of chaos. Exploring the ethos behind our brand name.",
      created_at: "2024-12-15", status: 'published' as const, slug: '', updated_at: '',
    }
  ];

  const displayPosts = posts.length > 0 ? posts : (loading ? [] : fallbackPosts);

  return (
    <section id="blog" className="py-20 bg-white border-t border-brand-teal/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="font-display text-4xl md:text-5xl text-brand-teal uppercase font-bold tracking-tight">
              Lab Notes
            </h2>
            <p className="mt-2 text-gray-600 font-sans">Updates from the Chemical Lochaa experimental journals.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-teal"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {displayPosts.slice(0, 6).map((post) => (
              <article
                key={post.id}
                className="flex flex-col h-full bg-brand-cream border border-brand-teal/20 rounded overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {post.cover_image_url && (
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <h3
                    onClick={() => post.id.startsWith('static') ? null : setSelectedPost(post)}
                    className="font-display text-2xl text-brand-teal font-bold leading-tight mb-3 hover:text-brand-yellow transition-colors cursor-pointer"
                  >
                    {post.title}
                  </h3>
                  <p className="font-sans text-gray-600 mb-6 flex-grow">
                    {getExcerpt(post.content)}
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-brand-teal/10">
                    <span className="flex items-center gap-2 text-sm text-gray-500 font-sans">
                      <Calendar size={14} />
                      {new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    {!post.id.startsWith('static') && (
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="text-brand-teal font-bold text-sm cursor-pointer hover:underline flex items-center gap-1"
                      >
                        Read Story <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {displayPosts.length === 0 && !loading && (
          <p className="text-center text-gray-400 italic py-12">No posts yet. Check back soon!</p>
        )}
      </div>
    </section>
  );
};

export default Blog;