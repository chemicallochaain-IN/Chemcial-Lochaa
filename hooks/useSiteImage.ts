import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSiteImage(imageKey: string) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImage() {
      try {
        const { data, error } = await supabase
          .from('site_images')
          .select('image_url')
          .eq('image_key', imageKey)
          .single();

        if (data && data.image_url) {
          setImageUrl(data.image_url);
        }
      } catch (err) {
        console.error(`Error fetching site image for ${imageKey}:`, err);
      } finally {
        setLoading(false);
      }
    }

    fetchImage();

    const handleUpdate = () => fetchImage();
    window.addEventListener('siteImageUpdated', handleUpdate);
    return () => window.removeEventListener('siteImageUpdated', handleUpdate);
  }, [imageKey]);

  return { imageUrl, loading };
}
