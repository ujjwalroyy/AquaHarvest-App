import mongoose from 'mongoose';

const { Decimal128 } = mongoose.Schema.Types;

const pondReportSchema = new mongoose.Schema({
    pondId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ponds',
        required: true
      },
  waterQuality: { type: String },
  date: { type: Date, default: Date.now },
  pH: { type: Decimal128 },
  temperature: { type: Decimal128 },
  DO: { type: Decimal128 },
  TDS: { type: Decimal128 },
  turbidity: { type: Decimal128 },
  plankton: { type: Decimal128 },
  avgLength: { type: Decimal128 },
  avgWeight: { type: Decimal128 },
});

export const PondReport = mongoose.model('PondReport', pondReportSchema);
export default PondReport;
