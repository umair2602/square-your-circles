import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'reCAPTCHA token is required.' });
  }

  try {
    const secretKey = process.env.NEXT_PUBLIC_RECAPTCHA_V2_SECRET_KEY;

    if (!secretKey) {
      return res.status(500).json({ message: 'reCAPTCHA secret key not set.' });
    }

    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: secretKey,
          response: token,
        },
      }
    );

    const data = response.data;

    if (!data.success) {
      return res.status(400).json({ message: 'Failed reCAPTCHA verification.', data });
    }

    return res.status(200).json({ message: 'Human verified successfully', data });
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return res.status(500).json({
      message: 'Error verifying reCAPTCHA',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
