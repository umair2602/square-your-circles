import mongoose from "mongoose";

const ideaSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  w3wLocation: {
    type: String,
    required: false,
    default: ""
  },

  citations: {
    type: [{
      ideaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Idea"
      },
      citedAt: {
        type: Date,
        default: Date.now
      },
      type: {
        type: String,
        enum: ['cited', 'citing']
      }
    }],
    default: []
  },

  score: {
    type: Number,
    default: 0
  },

  citationScore: {
    type: Number,
    default: 0
  },

  expiryDate: {
    type: Date,
    required: true
  },

  isArchived: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export default mongoose.models.Idea || mongoose.model("Idea", ideaSchema);
