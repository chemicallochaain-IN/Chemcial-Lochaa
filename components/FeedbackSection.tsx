import React, { useState } from 'react';
import { Star, Upload, Send, MessageSquare, Loader2, CheckCircle, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface FeedbackSectionProps {
  user: User | null;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ user }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [guestName, setGuestName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = null;

      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('review-images')
          .upload(filePath, image);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          // Continue without image if fails, or handle error
        } else {
           const { data } = supabase.storage.from('review-images').getPublicUrl(filePath);
           imageUrl = data.publicUrl;
        }
      }

      const { error } = await supabase.from('reviews').insert([
        {
          user_id: user?.id || null,
          guest_name: user ? user.name : guestName,
          rating,
          comment,
          image_url: imageUrl,
        },
      ]);

      if (error) throw error;

      setSubmitted(true);
      setRating(0);
      setComment('');
      setImage(null);
      setGuestName('');
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-brand-cream border-t-2 border-brand-teal/10 relative overflow-hidden">
        {/* Background Doodle */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-teal via-brand-yellow to-brand-teal"></div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
            <div className="text-center mb-12">
                <h2 className="font-display text-4xl md:text-5xl text-brand-teal uppercase font-bold tracking-tight mb-4">
                    Rate Your Experiment
                </h2>
                <p className="font-sans text-gray-600 max-w-xl mx-auto">
                    Your data helps us calibrate our flavours. Share your findings with the lab.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                
                {/* Internal Feedback Form */}
                <div className="bg-white p-8 rounded-lg shadow-lg border border-brand-teal/20">
                    {submitted ? (
                         <div className="h-full flex flex-col items-center justify-center text-center py-10 animate-in fade-in zoom-in">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="font-display text-2xl text-brand-teal mb-2">Data Recorded!</h3>
                            <p className="text-gray-600 mb-6">Thank you for your valuable feedback.</p>
                            <button onClick={() => setSubmitted(false)} className="text-brand-teal underline hover:text-brand-yellow">Submit another review</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Rating Stars */}
                            <div className="flex flex-col items-center">
                                <label className="mb-2 text-sm font-bold text-brand-teal uppercase tracking-wider">Lab Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star 
                                                size={32} 
                                                className={`${(hoverRating || rating) >= star ? 'fill-brand-yellow text-brand-yellow' : 'fill-gray-100 text-gray-300'}`} 
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Name (if guest) */}
                            {!user && (
                                <div>
                                    <label className="block text-sm font-bold text-brand-teal mb-1 uppercase tracking-wider">Observer Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full p-3 border border-brand-teal/20 rounded focus:border-brand-teal focus:outline-none bg-brand-cream/20"
                                        placeholder="Your Name"
                                        value={guestName}
                                        onChange={(e) => setGuestName(e.target.value)}
                                    />
                                </div>
                            )}

                            {/* Comment */}
                            <div>
                                <label className="block text-sm font-bold text-brand-teal mb-1 uppercase tracking-wider">Observations (Required)</label>
                                <textarea 
                                    required
                                    rows={4}
                                    className="w-full p-3 border border-brand-teal/20 rounded focus:border-brand-teal focus:outline-none bg-brand-cream/20"
                                    placeholder="Tell us about the taste, texture, and presentation..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-bold text-brand-teal mb-1 uppercase tracking-wider">Evidence (Optional)</label>
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-brand-teal/20 border-dashed rounded-lg cursor-pointer bg-brand-cream/10 hover:bg-brand-cream/30 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            {image ? (
                                                <p className="text-sm text-brand-teal font-bold">{image.name}</p>
                                            ) : (
                                                <>
                                                <Upload className="w-6 h-6 mb-2 text-brand-teal/60" />
                                                <p className="text-xs text-gray-500">Click to upload photo</p>
                                                </>
                                            )}
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full bg-brand-teal text-white py-3 rounded font-display uppercase tracking-widest font-bold hover:bg-brand-yellow hover:text-brand-teal transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Submit Data</>}
                            </button>
                        </form>
                    )}
                </div>

                {/* Google Review Link */}
                <div className="flex flex-col justify-center items-center text-center space-y-6 bg-white p-8 rounded-lg shadow-lg border border-brand-teal/20 h-full">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                         <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                             <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                             <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                             <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                             <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                    </div>
                    
                    <div>
                        <h3 className="font-display text-2xl text-brand-teal uppercase font-bold mb-2">Love the Lochaa?</h3>
                        <p className="text-gray-600 mb-6">
                            Help others discover our lab by rating us on Google. It means the world to us!
                        </p>
                        <a 
                            href="https://g.page/r/CVAabOMnrRZvEAE/review" 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-white border-2 border-brand-teal text-brand-teal px-6 py-3 rounded font-display uppercase tracking-wider font-bold hover:bg-brand-teal hover:text-white transition-all shadow-md"
                        >
                            Rate on Google <ExternalLink size={18} />
                        </a>
                    </div>
                </div>

            </div>
        </div>
    </section>
  );
};

export default FeedbackSection;