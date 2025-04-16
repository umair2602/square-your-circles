import type { NextApiRequest, NextApiResponse } from 'next';
import User from '../../../../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/../lib/db';

interface LoginRequest extends NextApiRequest {
  body: {
    email: string;
    password: string;
    rememberMe: boolean;
  };
}

export default async function handler(req: LoginRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password, rememberMe } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
      await connectDB();

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password.' });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password.' });
      }

      // Generate JWT token
      let token: string;

      if (rememberMe) {
        token = jwt.sign(
          {
            userId: user._id,
            uuid: user.uuid,
            email: user.email
          },
          process.env.NEXT_PUBLIC_JWT_SECRET || 'your-secret-key',
        );
      } else {
        token = jwt.sign(
          {
            userId: user._id,
            uuid: user.uuid,
            email: user.email
          },
          process.env.NEXT_PUBLIC_JWT_SECRET || 'your-secret-key',
          { expiresIn: '24h' }
        );
      }

      // Remove sensitive data from response
      const { passwordHash: _, ...userWithoutPassword } = user.toObject();

      res.status(200).json({
        message: 'Login successful.',
        token,
        user: userWithoutPassword
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        message: 'Server error.',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
