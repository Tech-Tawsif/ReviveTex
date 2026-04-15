import React from 'react';
import type { View } from '../types';
import { ShoppingBagIcon } from './ui-icons/ShoppingBagIcon';
import { HomeIcon } from './ui-icons/HomeIcon';
import { InformationCircleIcon } from './ui-icons/InformationCircleIcon';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  onNavigate: (view: View) => void;
  currentView: View;
  isLoggedIn: boolean;
  onAuthClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemCount, onCartClick, onNavigate, currentView, isLoggedIn, onAuthClick }) => {
  
  const NavLink: React.FC<{ view: View; children: React.ReactNode }> = ({ view, children }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => onNavigate(view)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
          isActive
            ? 'bg-emerald-50 text-emerald-700'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`}
      >
        {children}
      </button>
    );
  };

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-xl z-40 border-b border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-12">
            <button onClick={() => onNavigate('products')} className="flex-shrink-0 text-2xl font-bold tracking-tight text-slate-900 font-display">
              Revive<span className="text-emerald-600">Tex</span>
            </button>
            <nav className="hidden md:flex items-center space-x-2">
              <NavLink view="products">
                <HomeIcon />
                <span>Marketplace</span>
              </NavLink>
              <NavLink view="about">
                <InformationCircleIcon />
                <span>Our Model</span>
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onAuthClick}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                isLoggedIn 
                ? 'text-emerald-600 bg-emerald-50' 
                : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {isLoggedIn ? 'Business Profile' : 'Business Login'}
            </button>
            
            <button
              onClick={onCartClick}
              className="relative flex items-center space-x-2 p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-sm"
              aria-label="Open shopping cart"
            >
              <ShoppingBagIcon />
              <span className="hidden sm:inline font-bold text-sm">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-emerald-500 rounded-full border-2 border-white">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
