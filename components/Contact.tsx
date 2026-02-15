import React, { useState } from 'react';
import { Send, CheckCircle, Loader2 } from 'lucide-react';

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        (e.target as HTMLFormElement).reset();
      }, 5000);
    }, 1500);
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

          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-display text-2xl text-brand-teal uppercase font-bold mb-2">Message Sent!</h3>
              <p className="text-gray-600 text-center">
                Thank you for contacting Chemical Lochaa.<br/>Our team will get back to you shortly.
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
                  <input required type="text" className="w-full bg-brand-cream border border-gray-300 p-3 rounded focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow" placeholder="Your Name" />
                </div>
                <div>
                  <label className="block text-brand-teal font-bold font-display uppercase tracking-wider text-sm mb-2">Phone</label>
                  <input required type="tel" className="w-full bg-brand-cream border border-gray-300 p-3 rounded focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow" placeholder="Your Number" />
                </div>
              </div>

              <div>
                <label className="block text-brand-teal font-bold font-display uppercase tracking-wider text-sm mb-2">Email</label>
                <input required type="email" className="w-full bg-brand-cream border border-gray-300 p-3 rounded focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow" placeholder="your@email.com" />
              </div>

              <div>
                <label className="block text-brand-teal font-bold font-display uppercase tracking-wider text-sm mb-2">Subject</label>
                <select className="w-full bg-brand-cream border border-gray-300 p-3 rounded focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow text-gray-700">
                  <option>Book an Event / Party</option>
                  <option>Franchise Enquiry</option>
                  <option>Feedback</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-brand-teal font-bold font-display uppercase tracking-wider text-sm mb-2">Message</label>
                <textarea required rows={4} className="w-full bg-brand-cream border border-gray-300 p-3 rounded focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow" placeholder="Tell us about your event requirements or franchise interest..."></textarea>
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