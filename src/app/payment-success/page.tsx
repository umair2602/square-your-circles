'use client';

import { useRouter } from 'next/navigation';
import { FaCheckCircle } from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface PaymentDetails {
  paymentId: string;
  amount: number;
  currency: string;
  date: string;
}

const page = () => {
  const router = useRouter();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);

  useEffect(() => {
    const paymentIntent = new URLSearchParams(window.location.search).get('payment_intent');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!paymentIntent || !user.email) {
      console.error('Missing payment intent or user email');
      return;
    }

    // Check if the paymentIntent is already processed
    const storedPayments = JSON.parse(localStorage.getItem('paymentDetailsArray') || '[]');
    const isProcessed = storedPayments.some((payment: PaymentDetails) => payment.paymentId === paymentIntent.slice(-8));

    if (isProcessed) {
      // Show the most recent payment details
      setPaymentDetails(storedPayments[storedPayments.length - 1]);
      return;
    }

    // Make API call to fetch payment details
    fetch('/api/update-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        paymentIntentId: paymentIntent,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const payment = data.payment;
        const newPaymentDetails = {
          paymentId: payment.paymentIntentId.slice(-8),
          amount: payment.amount / 100, // Convert from cents
          currency: payment.currency.toUpperCase(),
          date: new Date(payment.createdAt).toLocaleDateString('en-US'),
        };

        // Update local storage
        const updatedPayments = [...storedPayments, newPaymentDetails];
        localStorage.setItem('paymentDetailsArray', JSON.stringify(updatedPayments));

        // Set the current payment details
        setPaymentDetails(newPaymentDetails);
      })
      .catch((error) => {
        console.error('Error processing payment:', error);
      });
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    switch (currency) {
      case 'GBP':
        return `£ ${amount.toFixed(2)}`;
      case 'USD':
        return `$ ${amount.toFixed(2)}`;
      default:
        return `${currency} ${amount.toFixed(2)}`;
    }
  };

  if (!paymentDetails) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin m-auto" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center p-4 sm:p-6">
      <Card className="w-full max-w-lg shadow-xl border-0">
        <CardHeader className="text-center">
          <FaCheckCircle className="text-green-600 h-20 w-20 mx-auto" />
          <CardTitle className="text-2xl font-bold text-gray-800">Payment successful!</CardTitle>
          <CardDescription className="text-gray-600 mt-2">Thank you. Your payment has been successfully received.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6 bg-gray-50 rounded-lg mx-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Transaction ID</span>
            <span className="font-medium text-gray-900">{paymentDetails.paymentId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Amount paid</span>
            <span className="font-medium text-gray-900">{formatCurrency(paymentDetails.amount, paymentDetails.currency)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Date</span>
            <span className="font-medium text-gray-900">{paymentDetails.date}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <button onClick={() => router.push('/new-idea')} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200">
            Back to idea creation
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
