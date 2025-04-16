import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // UUID - unique identifier for the user
  uuid: {
    type: String,
    required: true,
    unique: true
  },

  // Name
  name: {
    type: String,
    required: true
  },

  // Permanent Username
  permanentUsername: {
    type: String,
    unique: true,
    required: false
  },

  // Email
  email: {
    type: String,
    unique: true,
    required: false,
    lowercase: true,
    trim: true
  },

  // Password - Password hash for the permanent username
  passwordHash: {
    type: String,
    required: false
  },

  // ID verification status - whether the user has completed ID verification
  isIdVerified: {
    type: Boolean,
    default: false
  },

  // Expiration date for permanent username
  validityExpiry: {
    type: Date,
    required: false
  },

  // Whether the user has used their free idea post
  hasUsedFreeIdea: {
    type: Boolean,
    default: false
  },

  // Track purchased credits
  ideaCredits: {
    type: Number,
    default: 0,
  },

  // Track payments
  payments: {
    type: [{
      paymentIntentId: String,
      amount: Number,
      currency: String,
      status: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    default: []
  }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);