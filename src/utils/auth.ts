import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

type HandlerFunction = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

export const authenticate = (handler: HandlerFunction) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET || 'your-secret-key') as { userId: string };
      req.user = decoded;

      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};