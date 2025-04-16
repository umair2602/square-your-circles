'use client';

import { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '@/components/payment/PaymentForm';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentPage() {
  const [clientSecret, setClientSecret] = useState<string>('');

  useEffect(() => {
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 10.00,
        currency: 'gbp',
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((error) => console.error('Error:', error));
  }, []);

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin m-auto" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center p-4 sm:p-6">
      <Card className="w-full max-w-lg shadow-xl border-0">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-gray-800">Complete your payment</CardTitle>
          <CardDescription className="flex items-center justify-between">
            <span className="text-lg text-gray-600">Amount to pay:</span>
            <span className="text-lg font-semibold text-gray-800">£ 10</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-700">
              Your payment is secured by Stripe's encrypted payment system
            </p>
          </div>
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'stripe',
                variables: {
                  colorPrimary: '#2563eb',
                  colorBackground: '#ffffff',
                  colorText: '#1f2937',
                  colorDanger: '#dc2626',
                  fontFamily: 'system-ui, sans-serif',
                  spacingUnit: '4px',
                  borderRadius: '8px',
                },
                rules: {
                  '.Input': {
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                    padding: '12px'
                  }
                }
              },
            }}
          >
            <PaymentForm clientSecret={clientSecret} />
          </Elements>
        </CardContent>
      </Card>
    </div>
  );
}
