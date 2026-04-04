import React, { useState } from 'react';
import { Send, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const COUNTRY_CODES = [
  { code: '+91', label: '🇮🇳 +91', country: 'India' },
  { code: '+1', label: '🇺🇸 +1', country: 'US/Canada' },
  { code: '+44', label: '🇬🇧 +44', country: 'UK' },
  { code: '+61', label: '🇦🇺 +61', country: 'Australia' },
  { code: '+971', label: '🇦🇪 +971', country: 'UAE' },
  { code: '+966', label: '🇸🇦 +966', country: 'Saudi Arabia' },
  { code: '+65', label: '🇸🇬 +65', country: 'Singapore' },
  { code: '+60', label: '🇲🇾 +60', country: 'Malaysia' },
  { code: '+977', label: '🇳🇵 +977', country: 'Nepal' },
  { code: '+880', label: '🇧🇩 +880', country: 'Bangladesh' },
  { code: '+94', label: '🇱🇰 +94', country: 'Sri Lanka' },
  { code: '+49', label: '🇩🇪 +49', country: 'Germany' },
  { code: '+33', label: '🇫🇷 +33', country: 'France' },
  { code: '+81', label: '🇯🇵 +81', country: 'Japan' },
  { code: '+82', label: '🇰🇷 +82', country: 'South Korea' },
  { code: '+86', label: '🇨🇳 +86', country: 'China' },
  { code: '+39', label: '🇮🇹 +39', country: 'Italy' },
  { code: '+7', label: '🇷🇺 +7', country: 'Russia' },
  { code: '+55', label: '🇧🇷 +55', country: 'Brazil' },
  { code: '+27', label: '🇿🇦 +27', country: 'South Africa' },
];

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState('+91');
  
  const [subject, setSubject] = useState('Book an Event / Party');
  const [message, setMessage] = useState('');

  React.useEffect(() => {
    const handlePrefill = (e: any) => {
      if (e.detail) {
        if (e.detail.subject) setSubject(e.detail.subject);
        if (e.detail.message) setMessage(e.detail.message);
        
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    };
    window.addEventListener('prefillContact', handlePrefill);
    return () => window.removeEventListener('prefillContact', handlePrefill);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const phoneNumber = formData.get('phone') as string;
    const fullPhone = `${countryCode}${phoneNumber.replace(/^0+/, '')}`;

    const payload = {
      name: formData.get('name'),
      phone: fullPhone,
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      status: 'new'
    };

    try {
      const { error } = await supabase.from('contact_messages').insert([payload]);

      if (error) throw error;

      // Fire-and-forget: send email notification to admin
      const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://mrphakgvwefkknalkalj.supabase.co';
      const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycGhha2d2d2Vma2tuYWxrYWxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNTU4NDgsImV4cCI6MjA4NjczMTg0OH0._AmkNzbZj8yHPYPj4HJaRD0pshyBEibsf3V1VPR_Ad4';
      fetch(`${supabaseUrl}/functions/v1/notify-contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify(payload),
      }).catch(err => console.warn('Email notification failed (non-critical):', err));

      setIsSubmitting(false);
      setIsSubmitted(true);
      form.reset();
      setCountryCode('+91');

      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);

    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to send message. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-brand-cream">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white p-8 md:p-12 shadow-2xl rounded border-t-8 border-brand-teal">
          <div className="text-center mb-10">
            <h2 className="font-display text-4xl text-brand-teal uppercase font-bold mb-4">
              Get in Touch
            </h2>
            <p className="font-sans text-gray-600">
              Book an event, enquire about franchising, or just say hello.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-600 flex items-center gap-2">
              <AlertCircle size={18} /> {errorMsg}
            </div>
          )}

          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-display text-2xl text-brand-teal uppercase font-bold mb-2">Message Sent!</h3>
              <p className="text-gray-600 text-center">
                Thank you for contacting Chemical Lochaa.<br />Our team will get back to you shortly.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-6 text-brand-teal font-bold underline hover:text-brand-yellow transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-brand-teal font-bold font-display uppercase tracking-wider text-sm mb-2">Name</label>
                  <input name="name" required type="text" className="w-full bg-brand-cream border border-gray-300 p-3 rounded focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow" placeholder="Your Name" />
                </div>
                <div>
                  <label className="block text-brand-teal font-bold font-display uppercase tracking-wider text-sm mb-2">Phone</label>
                  <div className="flex gap-0">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-brand-cream border border-gray-300 border-r-0 p-3 rounded-l focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow text-sm min-w-[100px]"
                    >
                      {COUNTRY_CODES.map((cc) => (
                        <option key={cc.code} value={cc.code}>
                          {cc.label}
                        </option>
                      ))}
                    </select>
                    <input name="phone" required type="tel" pattern="[0-9]{6,14}" className="w-full bg-brand-cream border border-gray-300 p-3 rounded-r focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow" placeholder="Phone Number" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-brand-teal font-bold font-display uppercase tracking-wider text-sm mb-2">Email</label>
                <input name="email" required type="email" className="w-full bg-brand-cream border border-gray-300 p-3 rounded focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow" placeholder="your@email.com" />
              </div>

              <div>
                <label className="block text-brand-teal font-bold font-display uppercase tracking-wider text-sm mb-2">Subject</label>
                <select name="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-brand-cream border border-gray-300 p-3 rounded focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow text-gray-700">
                  <option>Book an Event / Party</option>
                  <option>Franchise Enquiry</option>
                  <option>Feedback</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-brand-teal font-bold font-display uppercase tracking-wider text-sm mb-2">Message</label>
                <textarea name="message" value={message} onChange={(e) => setMessage(e.target.value)} required rows={4} className="w-full bg-brand-cream border border-gray-300 p-3 rounded focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow" placeholder="Tell us about your event requirements or franchise interest..."></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-teal text-white font-display font-bold uppercase tracking-widest py-4 rounded hover:bg-brand-yellow hover:text-brand-teal transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>Sending <Loader2 className="animate-spin" size={18} /></>
                ) : (
                  <>Send Message <Send size={18} /></>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;