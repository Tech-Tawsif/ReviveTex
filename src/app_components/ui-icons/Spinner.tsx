import React from 'react';

export const Spinner: React.FC = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
  </div>
);
