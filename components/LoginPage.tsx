import React, { useState } from 'react';
import { Beaker, UserPlus, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isSignUp) {
        // 1. Sign Up
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (authError) throw authError;

        if (authData.user) {
          // 2. Create Profile
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              { 
                id: authData.user.id,
                name: formData.name,
                email: formData.email,
                loyalty_points: 0 // New users start at 0
              }
            ]);
            
          if (profileError) {
             console.error("Profile creation failed, but account created.", profileError);
          }
        }

      } else {
        // Sign In
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Authentication failed');
      setLoading(false);
    }
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

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

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
              minLength={6}
              className="w-full p-3 bg-brand-cream border border-brand-teal/20 rounded focus:outline-none focus:border-brand-teal transition-colors"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-brand-teal text-white py-4 rounded font-display uppercase tracking-widest font-bold hover:bg-brand-yellow hover:text-brand-teal transition-all duration-300 shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
               <Loader2 className="animate-spin" size={20} />
            ) : isSignUp ? (
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
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg(null);
              }}
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