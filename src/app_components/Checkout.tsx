import React, { useState, useEffect } from 'react';
import type { CartItem, NewOrderResponse, BusinessProfile } from '../types';
import { DELIVERY_CHARGE } from '../constants';
import { supabase } from '../supabaseClient';

interface CheckoutProps {
    cartItems: CartItem[];
    onBack: () => void;
    onPlaceOrder: (details: { name: string; phone: string; address: string; paymentMethod: string; }) => Promise<NewOrderResponse>;
    onPaymentSuccess: () => void;
    businessProfile: BusinessProfile | null;
}

const Checkout: React.FC<CheckoutProps> = ({ cartItems, onBack, onPlaceOrder, onPaymentSuccess, businessProfile }) => {
    const [name, setName] = useState(businessProfile?.ownerName || '');
    const [phone, setPhone] = useState(businessProfile?.phone || '');
    const [address, setAddress] = useState(businessProfile?.address || '');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (businessProfile) {
            setName(businessProfile.ownerName);
            setPhone(businessProfile.phone);
            setAddress(businessProfile.address);
        }
    }, [businessProfile]);

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const total = subtotal > 0 ? subtotal + DELIVERY_CHARGE : 0;

    const handleBkashPayment = async (order: NewOrderResponse) => {
        try {
            const { data, error } = await supabase.functions.invoke('bkash-create-payment', {
                body: { 
                    amount: total.toFixed(2),
                    orderId: String(order.id)
                },
            });

            if (error) throw new Error(`Function Error: ${error.message}`);
            
            if (data.bkashURL) {
                window.location.href = data.bkashURL;
            } else {
                throw new Error(data.errorMessage || 'bKash URL not received.');
            }

        } catch (error) {
            console.error('bKash payment initiation failed:', error);
            alert(`bKash payment initiation failed: ${error instanceof Error ? error.message : String(error)}`);
            setIsProcessing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cartItems.length === 0) {
            alert("Your cart is empty. Please add items before placing an order.");
            return;
        }
        if (!name || !phone || !address) {
            alert("Please fill in all the required fields.");
            return;
        }
        
        setIsProcessing(true);
        try {
            const newOrder = await onPlaceOrder({ name, phone, address, paymentMethod });

            if (paymentMethod === 'bkash') {
                await handleBkashPayment(newOrder);
            } else { // For COD or other methods
                onPaymentSuccess();
                setIsProcessing(false);
            }
        } catch(err) {
            alert(`Failed to place order: ${err instanceof Error ? err.message : String(err)}`);
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <button onClick={onBack} className="mb-6 text-amber-600 hover:text-amber-700">&larr; Back to Products</button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Delivery Information */}
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-amber-950 mb-6 border-b border-orange-200 pb-4">Delivery Information</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-amber-800 mb-2">Full Name</label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-orange-50/50 border border-orange-200 rounded-md p-3 text-amber-950 focus:ring-amber-500 focus:border-amber-500" />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-amber-800 mb-2">Phone Number</label>
                            <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full bg-orange-50/50 border border-orange-200 rounded-md p-3 text-amber-950 focus:ring-amber-500 focus:border-amber-500" />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-amber-800 mb-2">Full Address</label>
                            <textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} required rows={3} className="w-full bg-orange-50/50 border border-orange-200 rounded-md p-3 text-amber-950 focus:ring-amber-500 focus:border-amber-500"></textarea>
                        </div>

                        <h3 className="text-xl font-semibold text-amber-950 pt-4 border-t border-orange-200">Payment Method</h3>
                        <div className="space-y-3">
                             <label className="flex items-center p-4 bg-orange-50/50 rounded-md cursor-pointer hover:bg-orange-100 transition">
                                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="h-4 w-4 text-amber-600 bg-stone-100 border-stone-300 focus:ring-amber-600" />
                                <span className="ml-3 text-amber-900">Cash on Delivery</span>
                            </label>
                             <label className="flex items-center p-4 bg-orange-50/50 rounded-md cursor-pointer hover:bg-orange-100 transition">
                                <input type="radio" name="payment" value="bkash" checked={paymentMethod === 'bkash'} onChange={() => setPaymentMethod('bkash')} className="h-4 w-4 text-amber-600 bg-stone-100 border-stone-300 focus:ring-amber-600" />
                                <span className="ml-3 text-amber-900">bKash</span>
                            </label>
                        </div>

                        <button type="submit" disabled={isProcessing} className="w-full mt-4 bg-amber-900 text-white font-bold py-3 rounded-md hover:bg-amber-800 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center">
                            {isProcessing && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                            {isProcessing ? 'Processing...' : `Place Order (৳${total.toFixed(2)})`}
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="bg-white p-8 rounded-lg self-start shadow-md">
                    <h2 className="text-2xl font-bold text-amber-950 mb-6 border-b border-orange-200 pb-4">Order Summary</h2>
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    <img src={item.imageUrls[0]} alt={item.name} className="w-16 h-16 object-cover rounded-md"/>
                                    <div>
                                        <p className="font-semibold text-amber-950">{item.name}</p>
                                        <p className="text-sm text-amber-700">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="text-amber-950">৳{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-orange-200 space-y-3">
                        <div className="flex justify-between text-amber-800"><span>Subtotal</span><span>৳{subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between text-amber-800"><span>Delivery Charge</span><span>৳{subtotal > 0 ? DELIVERY_CHARGE.toFixed(2) : '0.00'}</span></div>
                        <div className="flex justify-between text-amber-950 font-bold text-xl"><span>Total</span><span>৳{total.toFixed(2)}</span></div>
                    </div>
                </div>
            </div>
             <style>{`
                  @keyframes fade-in {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                  }
                  .animate-fade-in {
                    animation: fade-in 0.5s ease-in-out forwards;
                  }
               `}</style>
        </div>
    );
};

export default Checkout;
