import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '@/context/AuthContext';

export default function PaymentForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    // Validation step
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message ?? 'An error occurred');
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
        payment_method_data: {
          billing_details: {
            name: user?.permanentUsername || 'Guest User',
            email: user?.email || 'guest@example.com',
            phone: '+10000000000', // Provide phone number
            address: {
              country: 'US', // Default country
              postal_code: '00000', // Default postal code
            },
          },
        },
      },
    });

    if (error) {
      setErrorMessage(error.message ?? 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          paymentMethodOrder: ['card'],
          layout: {
            type: 'tabs',
            defaultCollapsed: false,
          },
          fields: {
            billingDetails: 'auto',
          },
          wallets: {
            applePay: 'never',
            googlePay: 'never',
          },
        }}
      />
      <button type="submit" disabled={!stripe || loading} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50">
        {loading ? 'Processing...' : 'Pay now'}
      </button>
      {/* {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>} */}
    </form>
  );
}
