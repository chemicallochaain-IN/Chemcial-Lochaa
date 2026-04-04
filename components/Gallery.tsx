import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { SiteImage } from '../types';

const FALLBACK_IMAGES = [
  { src: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800", title: "The Experimental Burger", desc: "Our signature patty formulation" },
  { src: "https://images.unsplash.com/photo-1551183053-bf91b1dca034?auto=format&fit=crop&q=80&w=800", title: "Makhni Pasta", desc: "Fusion at molecular level" },
  { src: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800", title: "Korean Fried Chicken", desc: "Spicy chemical reaction" },
  { src: "https://images.unsplash.com/photo-1561758033-d8f5376f17ea?auto=format&fit=crop&q=80&w=800", title: "Loaded Fries", desc: "Calculated chaos" },
  { src: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&q=80&w=800", title: "Momos Experiment", desc: "Steamed to perfection" },
  { src: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=800", title: "Hazelnut Coffee", desc: "Liquid energy" },
];

const Gallery: React.FC = () => {
  const [images, setImages] = useState<Array<{ src: string; title: string; desc: string }>>(FALLBACK_IMAGES);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const { data, error } = await supabase
          .from('site_images')
          .select('*')
          .like('image_key', 'gallery_%')
          .order('sort_order');

        if (!error && data && data.length > 0) {
          const dbImages = (data as SiteImage[]).map(img => ({
            src: img.image_url,
            title: img.title || 'Gallery',
            desc: img.description || ''
          }));
          setImages(dbImages);
        }
        // If no DB images, fallback images remain
      } catch (err) {
        console.error('Error loading gallery images:', err);
        // Fallback images remain
      }
    };

    fetchGalleryImages();
  }, []);

  return (
    <section id="gallery" className="py-20 bg-brand-cream relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl text-brand-teal uppercase font-bold tracking-tight">
            The Lab Gallery
          </h2>
          <div className="h-1 w-20 bg-brand-yellow mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, idx) => (
            <div key={idx} className="group relative overflow-hidden rounded-lg shadow-md border-2 border-brand-teal/10">
              <div className="aspect-w-4 aspect-h-3 bg-gray-200">
                <img 
                  src={img.src} 
                  alt={img.title} 
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-brand-teal/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-4">
                <h3 className="font-display text-2xl text-brand-yellow uppercase mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                  {img.title}
                </h3>
                <p className="font-sans text-white text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                  {img.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;