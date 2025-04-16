import mongoose from 'mongoose';

const CarbonDataSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  ppm: {
    type: Number,
    required: true
  }
}, { timestamps: true });

export default mongoose.models.CarbonData || mongoose.model('CarbonData', CarbonDataSchema);