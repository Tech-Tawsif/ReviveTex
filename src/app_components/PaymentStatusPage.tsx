import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Spinner } from './ui-icons/Spinner';

interface PaymentStatusPageProps {
  paymentID: string;
  status: string;
  onSuccess: () => void;
  onDone: () => void;
}

const PaymentStatusPage: React.FC<PaymentStatusPageProps> = ({ paymentID, status, onSuccess, onDone }) => {
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'failed' | 'cancelled'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (status !== 'success') {
      setVerificationStatus('cancelled');
      return;
    }

    const verifyPayment = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('bkash-execute-payment', {
          body: { paymentID },
        });

        if (error) throw new Error(error.message);

        if (data.success) {
          setVerificationStatus('success');
          onSuccess(); // Trigger the confirmation modal in App.tsx
        } else {
          throw new Error(data.errorMessage || 'Unknown error during verification.');
        }

      } catch (err) {
        setVerificationStatus('failed');
        setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred.');
      }
    };

    verifyPayment();
  }, [paymentID, status, onSuccess]);

  const renderContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <>
            <Spinner />
            <h2 className="text-2xl font-bold mt-4">Verifying your payment...</h2>
            <p className="mt-2 text-amber-700">Please do not close this window.</p>
          </>
        );
      case 'success':
        return (
          <>
            <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
            <p className="mt-2 text-amber-700">Your payment has been verified. You will see the confirmation shortly.</p>
          </>
        );
      case 'failed':
        return (
          <>
            <h2 className="text-2xl font-bold text-red-600">Payment Verification Failed</h2>
            <p className="mt-2 text-amber-700">We could not verify your payment.</p>
            <p className="mt-1 text-sm text-gray-500">{errorMessage}</p>
            <button onClick={onDone} className="mt-6 bg-amber-900 text-white font-bold py-2 px-4 rounded-md hover:bg-amber-800">
                Back to Shop
            </button>
          </>
        );
      case 'cancelled':
        return (
          <>
            <h2 className="text-2xl font-bold text-amber-900">Payment Cancelled</h2>
            <p className="mt-2 text-amber-700">You have cancelled the payment process.</p>
             <button onClick={onDone} className="mt-6 bg-amber-900 text-white font-bold py-2 px-4 rounded-md hover:bg-amber-800">
                Back to Shop
            </button>
          </>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center py-16">
        <div className="bg-white p-8 rounded-lg shadow-lg">
            {renderContent()}
        </div>
    </div>
  );
};

export default PaymentStatusPage;
