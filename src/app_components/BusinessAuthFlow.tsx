import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import * as SupabaseService from '../supabaseService';
import { Spinner } from './ui-icons/Spinner';

interface BusinessAuthProps {
  onAuthSuccess: () => void;
  onBack: () => void;
}

const BusinessAuthFlow: React.FC<BusinessAuthProps> = ({ onAuthSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState('');
  const [businessType, setBusinessType] = useState('retailer');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!supabase || !supabase.auth) {
        throw new Error("Supabase Auth is not available. Please check your configuration.");
      }

      if (isLogin) {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (loginError) throw loginError;
      } else {
        // Sign Up
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;

        if (authData.user) {
          await SupabaseService.createBusinessProfile({
            id: authData.user.id,
            businessName,
            ownerName,
            email,
            phone,
            address,
            location,
            businessType,
          });
        }
      }
      console.log("Auth operation successful, calling onAuthSuccess");
      onAuthSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
      <h2 className="text-3xl font-bold text-slate-900 mb-2 font-display text-center">
        {isLogin ? 'Business Login' : 'Register Business'}
      </h2>
      <p className="text-slate-500 text-center mb-8 text-sm">
        {isLogin ? 'Access your ReviveTex account' : 'Join our sustainable B2B network'}
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Business Name</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="e.g. EcoThreads Ltd."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Owner Name</label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Location / City</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Full Address</label>
              <textarea
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all h-20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Business Type</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
              >
                <option value="retailer">Retailer</option>
                <option value="brand">Clothing Brand</option>
                <option value="designer">Independent Designer</option>
                <option value="other">Other</option>
              </select>
            </div>
          </>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isLoading ? <Spinner /> : <span>{isLogin ? 'Login' : 'Create Account'}</span>}
        </button>
      </form>

      <div className="mt-8 text-center space-y-4">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-emerald-600 font-semibold hover:underline"
        >
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
        </button>
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={onBack}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            ← Back to Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessAuthFlow;
