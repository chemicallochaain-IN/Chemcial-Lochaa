import React, { useState } from 'react';
import { Beaker, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call and login
    const mockUser: User = {
      name: formData.name || 'Lab Partner',
      email: formData.email,
      loyaltyPoints: 4, // Start with some mock points for demo
      phone: '+91 98765 43210',
      address: '123, Science Park, Ambala City',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=200&h=200'
    };
    onLogin(mockUser);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] pt-32 pb-20 flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-brand-yellow/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-brand-teal/10 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white max-w-md w-full p-8 md:p-10 rounded-lg shadow-2xl border-t-8 border-brand-teal relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-teal rounded-full mb-4 shadow-lg border-4 border-brand-cream">
            <Beaker className="text-brand-yellow w-8 h-8" />
          </div>
          <h2 className="font-display text-3xl text-brand-teal uppercase font-bold">
            {isSignUp ? 'Join the Lab' : 'Access My Lab'}
          </h2>
          <p className="text-gray-500 font-sans mt-2 text-sm">
            {isSignUp ? 'Create your account to start earning rewards.' : 'Welcome back, scientist. Enter your credentials.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-teal uppercase tracking-wider">Full Name</label>
              <input 
                type="text" 
                required 
                className="w-full p-3 bg-brand-cream border border-brand-teal/20 rounded focus:outline-none focus:border-brand-teal transition-colors"
                placeholder="Albert Einstein"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-teal uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              required 
              className="w-full p-3 bg-brand-cream border border-brand-teal/20 rounded focus:outline-none focus:border-brand-teal transition-colors"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-teal uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              required 
              className="w-full p-3 bg-brand-cream border border-brand-teal/20 rounded focus:outline-none focus:border-brand-teal transition-colors"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-brand-teal text-white py-4 rounded font-display uppercase tracking-widest font-bold hover:bg-brand-yellow hover:text-brand-teal transition-all duration-300 shadow-md flex items-center justify-center gap-2"
          >
            {isSignUp ? (
                <>Create Account <UserPlus size={18} /></>
            ) : (
                <>Enter Lab <LogIn size={18} /></>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-brand-teal/10 pt-6">
          <p className="text-sm text-gray-600 font-sans">
            {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-2 text-brand-teal font-bold hover:text-brand-yellow transition-colors underline"
            >
              {isSignUp ? 'Login Here' : 'Join Now'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;