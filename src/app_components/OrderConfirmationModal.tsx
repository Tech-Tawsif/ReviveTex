import React from 'react';
import { CheckCircleIcon } from './ui-icons/CheckCircleIcon';

interface OrderConfirmationModalProps {
    onClose: () => void;
}

const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({ onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full text-center p-8 sm:p-12 transform animate-scale-in">
                <div className="mx-auto mb-6">
                    <CheckCircleIcon />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-amber-950 mb-4 font-serif">
                    Congratulations!
                </h2>
                <p className="text-amber-800 mb-8 text-lg">
                    Thank you for your order! Your purchase has been confirmed and is being prepared.
                </p>
                <button
                    onClick={onClose}
                    className="w-full bg-amber-900 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-800 transition-all duration-300 text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-amber-900"
                >
                    Continue Shopping
                </button>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
                @keyframes scale-in {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scale-in 0.4s ease-out forwards 0.1s;
                }
                @keyframes stroke-draw {
                    from { stroke-dashoffset: 1000; }
                    to { stroke-dashoffset: 0; }
                }
                .checkmark-circle {
                    stroke-dasharray: 1000;
                    animation: stroke-draw 0.8s ease-out forwards 0.4s;
                }
                 @keyframes tick-draw {
                    from { stroke-dashoffset: 200; }
                    to { stroke-dashoffset: 0; }
                }
                .checkmark-tick {
                    stroke-dasharray: 200;
                    animation: tick-draw 0.6s ease-out forwards 1s;
                }
            `}</style>
        </div>
    );
};

export default OrderConfirmationModal;