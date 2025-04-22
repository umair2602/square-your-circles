import type { NextApiRequest, NextApiResponse } from "next";
import Idea from '../../../../models/idea';
import User from '../../../../models/user';
import connectDB from '@/../lib/db';
import { authenticate } from "@/utils/auth";
import mongoose from 'mongoose';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      await connectDB();

      // user id from the authenticated token
      const userId = req.user?.userId;

      // Check if user has idea credits
      const user = await User.findById(userId);
      if (!user || user.ideaCredits <= 0) {
        return res.status(403).json({
          message: "You need to purchase idea credits before creating an idea",
          needsPayment: true
        });
      }

      const {
        title,
        description,
        w3wLocation,
        citations,
        score,
      } = req.body;

      // Collect missing fields
      const missingFields: string[] = [];

      if (!title) missingFields.push("title");
      if (!description) missingFields.push("description");
      if (w3wLocation === undefined) missingFields.push("w3wLocation");
      if (score === undefined) missingFields.push("score");

      if (missingFields.length > 0) {
        return res.status(400).json({
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }

      // Set validity to 1 year from now
      const validityExpiry = new Date();
      validityExpiry.setFullYear(validityExpiry.getFullYear() + 1);

      const newIdea = new Idea({
        user: userId,
        title,
        description,
        w3wLocation,
        citations: citations?.map((ideaId: string) => ({
          ideaId,
          type: 'citing',
          citedAt: new Date()
        })) || [],
        score: score || 0,
        expiryDate: validityExpiry,
      });

      // Check and update citation score if citations exist
      if (citations && citations.length > 0) {
        // Check if the citation ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(citations[0])) {
          return res.status(400).json({
            message: "Invalid citation ID format"
          });
        }

        const citedIdea = await Idea.findById(citations[0]);
        if (!citedIdea) {
          return res.status(400).json({
            message: "Cited idea not found"
          });
        }
        
        // Update citation score of the cited idea
        await Idea.findByIdAndUpdate(
          citations[0],
          { $inc: { citationScore: 10000 } },
          { new: true }
        );
      }

      // Save the idea to the database
      const savedIdea = await newIdea.save();

      // Deduct one idea credit after successful creation
      await User.findByIdAndUpdate(userId, { $inc: { ideaCredits: -1 } });

      return res.status(201).json({
        data: savedIdea,
        message: "Idea created successfully",
      });
    } catch (error) {
      console.error('Error creating idea:', error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default authenticate(handler);
