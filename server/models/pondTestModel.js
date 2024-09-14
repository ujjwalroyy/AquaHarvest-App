// models/PondTest.js
import mongoose from 'mongoose';

const { Decimal128 } = mongoose.Schema.Types;

const pondTestSchema = new mongoose.Schema({
  pondId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ponds',
  },
  waterQuality: {
    type: String,
  },
  date: {
    type: Date,
  },
  pH: {
    type: Number,
  },
  temperature: {
    type: String,
  },
  DO: {
    type: Number,
  },
  TDS: {
    type: Number,
  },
  turbidity: {
    type: Number,
  },
  plankton: {
    type: Number,
  },
  avgLength: {
    type: Number,
  },
  avgWeight: {
    type: Number,
  },
});

export const PondTest = mongoose.model('PondTest', pondTestSchema);
export default PondTest;
