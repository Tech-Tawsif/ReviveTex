import React, { useState } from 'react';
import type { Product } from '../types';
import { XMarkIcon } from './ui-icons/XMarkIcon';
import { PlusIcon } from './ui-icons/PlusIcon';
import { ChevronLeftIcon } from './ui-icons/ChevronLeftIcon';
import { ChevronRightIcon } from './ui-icons/ChevronRightIcon';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      (prevIndex - 1 + product.imageUrls.length) % product.imageUrls.length
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      (prevIndex + 1) % product.imageUrls.length
    );
  };

  return (
    <div 
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" 
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-white rounded-lg overflow-hidden shadow-2xl max-w-4xl w-full flex flex-col md:flex-row animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full md:w-1/2 relative">
          <img 
            src={product.imageUrls[currentImageIndex]} 
            alt={`${product.name} image ${currentImageIndex + 1}`} 
            className="w-full h-full object-cover"
          />
          
          {product.imageUrls.length > 1 && (
            <>
              <button 
                onClick={handlePrevImage} 
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/60 text-amber-900 p-2 rounded-full hover:bg-white/80 transition focus:outline-none"
                aria-label="Previous image"
              >
                <ChevronLeftIcon />
              </button>
              <button 
                onClick={handleNextImage} 
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/60 text-amber-900 p-2 rounded-full hover:bg-white/80 transition focus:outline-none"
                aria-label="Next image"
              >
                <ChevronRightIcon />
              </button>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {product.imageUrls.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                    }}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      currentImageIndex === index ? 'bg-amber-900' : 'bg-amber-900/40 hover:bg-amber-900/60'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="w-full md:w-1/2 p-8 flex flex-col relative text-slate-900">
          <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors">
            <XMarkIcon />
          </button>
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                product.stockType === 'bulk' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {product.stockType}
              </span>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                Product ID: {product.id}
              </span>
            </div>
            <h2 className="text-4xl font-bold mb-2 font-display">{product.name}</h2>
            <div className="flex items-baseline space-x-4">
              <p className="text-3xl font-bold text-emerald-600">৳{product.price}</p>
              <p className="text-sm text-slate-400 font-medium">per unit</p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl mb-6 border border-slate-100">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Minimum Order Quantity (MOQ)</span>
              <span className="text-slate-900 font-bold">{product.moq} units</span>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto mb-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</h3>
            <p className="text-slate-600 leading-relaxed">{product.description}</p>
          </div>

          <button
            onClick={onAddToCart}
            className="w-full flex items-center justify-center bg-slate-900 text-white font-bold py-4 px-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            <PlusIcon />
            <span className="ml-2">Add to Bulk Order</span>
          </button>
        </div>
      </div>
       <style>{`
          @keyframes fade-in-up {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
          }
       `}</style>
    </div>
  );
};

export default ProductModal;