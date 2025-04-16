import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ['text', 'multiple-choice', 'rating', 'number'],
    required: true
  },

  options: [String], // For multiple-choice questions

  required: {
    type: Boolean,
    default: true
  },

  weight: {
    type: Number,
    default: 1
  }

}, { timestamps: true });

export default mongoose.models.Challenge || mongoose.model("Challenge", challengeSchema);
