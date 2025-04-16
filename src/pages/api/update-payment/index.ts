import type { NextApiRequest, NextApiResponse } from 'next';
import User from '../../../../models/user';
import connectDB from '@/../lib/db';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

interface UpdatePaymentRequest extends NextApiRequest {
  body: {
    email: string;
    paymentIntentId: string;
  };
}

export default async function handler(req: UpdatePaymentRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await connectDB();
    const { email, paymentIntentId } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // If paymentIntentId is provided, update the payment information
    if (paymentIntentId) {
      if (!paymentIntentId) {
        return res.status(400).json({ message: 'Payment intent ID is required.' });
      }

      // Fetch payment details from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      user.payments = user.payments || []; // Initialize if doesn't exist

      // Check if paymentIntentId already exists in user's payments
      const alreadyExists = user.payments?.some(
        (payment: any) => payment?.paymentIntentId === paymentIntent.id
      );

      if (alreadyExists) {
        return res.status(400).json({ message: 'Payment already recorded.' });
      }

      // Add the new payment to the user's payments array
      user.payments.push({
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        createdAt: new Date(),
      });

      // Increment idea credits by 1 for each payment
      user.ideaCredits += 1;

      // Save the updated user data with the new payment
      await user.save();

      return res.status(200).json({
        message: 'Payment information stored successfully',
        payment: user.payments[user.payments.length - 1],
      });
    }

    return res.status(400).json({ message: 'Invalid request.' });

  } catch (error) {
    console.error('Error updating user data:', error);
    return res.status(500).json({
      message: 'Error updating user data',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
