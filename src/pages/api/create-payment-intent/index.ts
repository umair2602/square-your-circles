import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    let { amount, currency = 'gbp' } = req.body;
    const lowerCaseCurrency = currency.toLowerCase();

    // Convert amount to smallest currency unit
    const multiplier = 100;
    const amountInSmallestUnit = Math.round(amount * multiplier);

    // Create PaymentIntent with automatic payment methods only
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInSmallestUnit,
      currency: lowerCaseCurrency,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return res.status(500).json({
      message: 'Error creating payment intent',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}