import React from 'react';
import type { Product } from '../types';
import { PlusIcon } from './icons/PlusIcon';

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
  onViewProduct: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewProduct }) => {
  return (
    <div className="rounded-lg overflow-hidden group transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-200/60">
      <div 
        className="relative cursor-pointer bg-white"
        onClick={onViewProduct}
      >
        <img src={product.imageUrls[0]} alt={product.name} className="w-full h-80 object-cover" />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
      </div>
      <div className="p-5 bg-white">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 
              className="text-lg font-bold text-slate-900 cursor-pointer truncate font-display" 
              onClick={onViewProduct}
              title={product.name}
            >
              {product.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                product.stockType === 'bulk' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {product.stockType}
              </span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                MOQ: {product.moq} units
              </span>
            </div>
          </div>
           <p className="text-xl font-bold text-slate-900 whitespace-nowrap ml-2">
            ৳{product.price}
          </p>
        </div>
        <button
          onClick={onAddToCart}
          className="w-full flex items-center justify-center mt-4 bg-slate-900 text-white font-bold py-3 px-4 rounded-xl hover:bg-slate-800 transition-all shadow-sm active:scale-95"
        >
          <PlusIcon />
          <span className="ml-2">Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;