import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';

const Blog: React.FC = () => {
  const posts = [
    {
      title: "From Telescopes to Tables: Our Journey",
      excerpt: "How an astrophysicist and a forensic scientist decided to trade their labs for a kitchen. The physics behind a perfectly grilled burger.",
      date: "Oct 12, 2024",
      tag: "Origin Story"
    },
    {
      title: "The Chemistry of the Perfect Sauce",
      excerpt: "We spent 3 months calibrating the viscosity and spice levels of our signature Makhni sauce. Here is the science behind the flavor.",
      date: "Nov 05, 2024",
      tag: "Food Science"
    },
    {
      title: "Why 'Chemical Lochaa'?",
      excerpt: "Lochaa means trouble, but in our lab, it means the good kind of chaos. Exploring the ethos behind our brand name.",
      date: "Dec 15, 2024",
      tag: "Brand Identity"
    }
  ];

  const handleReadMore = () => {
    alert("Full article coming soon to our blog!");
  };

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
          <button 
            onClick={handleReadMore}
            className="hidden md:flex items-center gap-2 text-brand-teal font-bold uppercase tracking-wider hover:text-brand-yellow transition-colors mt-4 md:mt-0"
          >
            View All Posts <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <article key={idx} className="flex flex-col h-full bg-brand-cream border border-brand-teal/20 p-6 rounded hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <span className="bg-brand-teal text-brand-cream text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                  {post.tag}
                </span>
              </div>
              <h3 
                onClick={handleReadMore}
                className="font-display text-2xl text-brand-teal font-bold leading-tight mb-3 hover:text-brand-yellow transition-colors cursor-pointer"
              >
                {post.title}
              </h3>
              <p className="font-sans text-gray-600 mb-6 flex-grow">
                {post.excerpt}
              </p>
              <div className="flex justify-between items-center pt-4 border-t border-brand-teal/10">
                <span className="flex items-center gap-2 text-sm text-gray-500 font-sans">
                  <Calendar size={14} /> {post.date}
                </span>
                <button 
                  onClick={handleReadMore}
                  className="text-brand-teal font-bold text-sm cursor-pointer hover:underline"
                >
                  Read Story
                </button>
              </div>
            </article>
          ))}
        </div>
        
        <div className="mt-8 md:hidden text-center">
            <button 
              onClick={handleReadMore}
              className="inline-flex items-center gap-2 text-brand-teal font-bold uppercase tracking-wider hover:text-brand-yellow transition-colors"
            >
                View All Posts <ArrowRight size={20} />
            </button>
        </div>
      </div>
    </section>
  );
};

export default Blog;