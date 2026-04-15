import React from 'react';

interface FooterProps {
  onGoToAdmin: () => void;
}

const Footer: React.FC<FooterProps> = ({ onGoToAdmin }) => {
  return (
    <footer className="bg-white border-t border-slate-100 mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-slate-900 font-display">
              Revive<span className="text-emerald-600">Tex</span>
            </h3>
            <p className="text-slate-500 text-sm mt-2 max-w-xs">
              Empowering small brands through sustainable industrial deadstock sourcing.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end space-y-2">
            <p className="text-slate-400 text-xs">&copy; {new Date().getFullYear()} ReviveTex. All Rights Reserved.</p>
            <button onClick={onGoToAdmin} className="text-[10px] text-slate-300 hover:text-slate-600 transition-colors uppercase tracking-widest font-bold">
              Factory Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;