import type { NextApiRequest, NextApiResponse } from "next";
import Idea from '../../../../models/idea';
import User from '../../../../models/user';
import connectDB from '@/../lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      await connectDB();

      // Fetch all ideas with user information
      const ideas = await Idea.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        {
          $unwind: '$userInfo'
        },
        {
          $project: {
            _id: 1,
            username: '$userInfo.permanentUsername',
            ideaTitle: '$title',
            carbonCount: { $add: ['$score', '$citationScore'] },
            w3w: '$w3wLocation'
          }
        }
      ]);

      return res.status(200).json(ideas);

    } catch (error) {
      console.error('Error fetching ideas:', error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default handler;
