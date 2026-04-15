import React from 'react';
import type { BusinessProfile } from '../types';
import { supabase } from '../supabaseClient';

interface BusinessProfileViewProps {
  profile: BusinessProfile | null;
  user: any;
  onLogout: () => void;
  onBack: () => void;
}

const BusinessProfileView: React.FC<BusinessProfileViewProps> = ({ profile, user, onLogout, onBack }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
        <p className="text-slate-600 font-medium">Loading your business profile...</p>
        <button 
          onClick={handleLogout}
          className="mt-8 text-slate-400 hover:text-slate-600 text-sm font-medium underline"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <button 
        onClick={onBack}
        className="mb-8 text-emerald-600 hover:text-emerald-700 font-semibold flex items-center"
      >
        &larr; Back to Marketplace
      </button>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        <div className="bg-emerald-600 px-8 py-12 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{profile.businessName}</h1>
              <p className="text-emerald-100 flex items-center">
                <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
                {profile.isVerified ? 'Verified Business Partner' : 'Pending Verification'}
              </p>
            </div>
            <button 
              onClick={handleLogout}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-all backdrop-blur-sm border border-white/20"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Business Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Owner Name</label>
                <p className="text-slate-900 font-medium">{profile.ownerName}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Business Type</label>
                <p className="text-slate-900 font-medium capitalize">{profile.businessType}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</label>
                <p className="text-slate-900 font-medium">{profile.location}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Contact Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <p className="text-slate-900 font-medium">{profile.email}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                <p className="text-slate-900 font-medium">{profile.phone}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Delivery Address</label>
                <p className="text-slate-900 font-medium">{profile.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default BusinessProfileView;
