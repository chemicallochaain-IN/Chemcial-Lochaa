import React, { useState, useEffect } from 'react';
import { Beaker, UserPlus, LogIn, AlertCircle, Loader2, CheckCircle2, ShieldCheck, Mail, ArrowRight, Shield, KeyRound } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface RegisterPageProps {
  onSuccess?: () => void;
  onBackToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onSuccess, onBackToLogin }) => {
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [otpCode, setOtpCode] = useState('');

  // Password Validation State
  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    special: false,
    number: false,
    match: false
  });

  useEffect(() => {
    const { password, confirmPassword } = formData;
    setValidations({
      length: password.length >= 8 && password.length <= 16,
      uppercase: /[A-Z]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      number: /[0-9]/.test(password),
      match: password === confirmPassword && password.length > 0
    });
  }, [formData]);

  const allValid = Object.values(validations).every(v => v === true) && formData.name.trim().length > 0;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allValid) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Sign Up (with metadata for the trigger)
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name
          }
        }
      });

      if (error) throw error;

      // 2. Transition to OTP Verification
      // If email confirmation is enabled, Supabase will send the code/link
      setStep('verify');
    } catch (error: any) {
      setErrorMsg(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: formData.email,
        token: otpCode,
        type: 'signup'
      });

      if (error) throw error;

      // Success!
      if (onSuccess) onSuccess();
      // Since it's a new page flow, we might just redirect him to dashboard
      // but for now, we'll just show success or call back.
      onBackToLogin(); // Or similar
    } catch (error: any) {
      setErrorMsg(error.message || 'Verification failed. Please check the OTP.');
    } finally {
      setLoading(false);
    }
  };

  const ValidationItem = ({ label, isValid }: { label: string; isValid: boolean }) => (
    <div className={`flex items-center gap-2 text-xs font-bold uppercase transition-colors ${isValid ? 'text-green-600' : 'text-gray-400'}`}>
      {isValid ? <CheckCircle2 size={12} /> : <Shield size={12} />} {label}
    </div>
  );

  if (step === 'verify') {
    return (
      <div className="min-h-[calc(100vh-80px)] pt-32 pb-20 flex items-center justify-center px-4 relative">
        <div className="bg-white max-w-md w-full p-8 md:p-10 rounded-lg shadow-2xl border-t-8 border-brand-teal text-center animate-in zoom-in-95">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 shadow-lg border-4 border-white">
            <Mail className="text-blue-600 w-8 h-8" />
          </div>
          <h2 className="font-display text-2xl text-brand-teal uppercase font-bold mb-2">Check Your Lab Inbox</h2>
          <p className="text-gray-500 text-sm mb-6">
            We've sent a 6-digit verification code to <span className="text-brand-teal font-bold">{formData.email}</span>. Please enter it below.
          </p>

          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <input 
              type="text" 
              required 
              maxLength={6}
              className="w-full p-4 bg-brand-cream border-2 border-brand-teal/20 rounded-lg text-center text-3xl font-display tracking-[1em] focus:outline-none focus:border-brand-teal transition-all"
              placeholder="000000"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
            />

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-red-600 text-sm italic">
                <AlertCircle size={16} /> {errorMsg}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading || otpCode.length < 6}
              className="w-full bg-brand-teal text-white py-4 rounded font-display uppercase tracking-widest font-bold hover:bg-brand-yellow hover:text-brand-teal transition-all duration-300 shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Verify Account <ArrowRight size={18} /></>}
            </button>
          </form>

          <button 
            onClick={() => setStep('register')}
            className="mt-6 text-xs text-gray-500 hover:text-brand-teal font-bold uppercase transition-colors"
          >
            ← Back to Registration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] pt-32 pb-20 flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-brand-yellow/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-brand-teal/10 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white max-w-lg w-full p-8 md:p-10 rounded-lg shadow-2xl border-t-8 border-brand-teal relative z-10 animate-in fade-in slide-in-from-bottom-5">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-teal rounded-full mb-4 shadow-lg border-4 border-brand-cream">
            <UserPlus className="text-brand-yellow w-8 h-8" />
          </div>
          <h2 className="font-display text-3xl text-brand-teal uppercase font-bold">New Scientist Registration</h2>
          <p className="text-gray-500 font-sans mt-2 text-sm">Join the Lab, collect loyalty stamps, and unlock exclusive rewards.</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-red-600 text-sm italic font-bold">
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-brand-teal uppercase tracking-widest">Full Name</label>
              <input 
                type="text" 
                required 
                className="w-full p-3 bg-brand-cream border border-brand-teal/20 rounded focus:outline-none focus:border-brand-teal transition-colors"
                placeholder="E.g. Nikola Tesla"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-brand-teal uppercase tracking-widest">Email Address</label>
              <input 
                type="email" 
                required 
                className="w-full p-3 bg-brand-cream border border-brand-teal/20 rounded focus:outline-none focus:border-brand-teal transition-colors"
                placeholder="scientist@lab.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-brand-teal uppercase tracking-widest">Set Password</label>
              <input 
                type="password" 
                required 
                className="w-full p-3 bg-brand-cream border border-brand-teal/20 rounded focus:outline-none focus:border-brand-teal transition-colors"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-brand-teal uppercase tracking-widest">Confirm Password</label>
              <input 
                type="password" 
                required 
                className="w-full p-3 bg-brand-cream border border-brand-teal/20 rounded focus:outline-none focus:border-brand-teal transition-colors"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          </div>

          {/* Compliance Checklist */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 grid grid-cols-2 gap-y-2 gap-x-4">
            <ValidationItem label="8-16 Characters" isValid={validations.length} />
            <ValidationItem label="1 Uppercase Letter" isValid={validations.uppercase} />
            <ValidationItem label="1 Special Character" isValid={validations.special} />
            <ValidationItem label="1 Number" isValid={validations.number} />
            <div className="col-span-2 mt-1 pt-1 border-t border-gray-200">
               <ValidationItem label="Passwords Match" isValid={validations.match} />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || !allValid}
            className="w-full bg-brand-teal text-white py-4 rounded font-display uppercase tracking-widest font-bold hover:bg-brand-yellow hover:text-brand-teal transition-all duration-300 shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Generate Account <KeyRound size={18} /></>}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-brand-teal/10 pt-6">
          <p className="text-sm text-gray-500 font-sans">
            Have an existing scientist ID? 
            <button 
              onClick={onBackToLogin}
              className="ml-2 text-brand-teal font-bold hover:text-brand-yellow transition-colors underline uppercase text-xs"
            >
              Access Lab Now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
