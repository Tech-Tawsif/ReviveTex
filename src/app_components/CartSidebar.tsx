import React from 'react';
import type { CartItem } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';
import { TrashIcon } from './icons/TrashIcon';
import { DELIVERY_CHARGE } from '../constants';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string | number, quantity: number) => void;
  onRemoveFromCart: (id: string | number) => void;
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveFromCart, onCheckout }) => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + DELIVERY_CHARGE;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-orange-50 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-orange-200">
            <h2 className="text-2xl font-bold text-amber-950">Your Cart</h2>
            <button onClick={onClose} className="text-amber-500 hover:text-amber-800 transition">
              <XMarkIcon />
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-amber-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              <p className="text-xl">Your cart is empty.</p>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-start space-x-4 bg-white p-3 rounded-lg shadow-sm">
                  <img src={item.imageUrls[0]} alt={item.name} className="w-20 h-24 object-cover rounded-md"/>
                  <div className="flex-grow">
                    <p className="font-semibold text-amber-950">{item.name}</p>
                    <p className="text-sm text-amber-600">৳{item.price}</p>
                    <div className="flex items-center mt-2">
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 bg-orange-100 rounded-l hover:bg-orange-200 text-amber-900">-</button>
                      <span className="px-3 py-1 bg-orange-100 text-amber-900">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 bg-orange-100 rounded-r hover:bg-orange-200 text-amber-900">+</button>
                    </div>
                  </div>
                  <button onClick={() => onRemoveFromCart(item.id)} className="text-stone-400 hover:text-red-500 transition">
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="p-4 border-t border-orange-200 bg-white">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-amber-800">
                  <span>Subtotal</span>
                  <span>৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-amber-800">
                  <span>Delivery</span>
                  <span>৳{DELIVERY_CHARGE.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-amber-950 font-bold text-lg">
                  <span>Total</span>
                  <span>৳{total.toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={onCheckout}
                className="w-full bg-amber-900 text-white font-bold py-3 rounded-md hover:bg-amber-800 transition-colors duration-300"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
