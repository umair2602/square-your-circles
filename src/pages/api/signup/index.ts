import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import User from '../../../../models/user';
import connectDB from '@/../lib/db';

interface SignupRequest extends NextApiRequest {
  body: {
    name: string;
    email: string;
    password: string;
  };
}

export default async function handler(req: SignupRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    // Password strength validation (at least 8 characters)
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    try {
      await connectDB();

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists.' });
      }

      // Generate UUID
      const uuid = uuidv4();

      // Extract permanent username from email (part before @)
      const permanentUsername = email.split('@')[0];

      // Set validity to 1 year from now
      const validityExpiry = new Date();
      validityExpiry.setFullYear(validityExpiry.getFullYear() + 1);

      // Hash the password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create new user
      const user = await User.create({
        uuid,
        name,
        email,
        permanentUsername,
        passwordHash,
        isIdVerified: true,
        validityExpiry,
        hasUsedFreeIdea: false
      });

      // Remove sensitive data from response
      const { passwordHash: _, ...userWithoutPassword } = user.toObject();

      res.status(201).json({
        message: 'User created successfully.',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Signup error:', error);
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
