import mongoose from "mongoose";

const pendingFeeSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  customerId: {
    type: String,
    required: true,
  },
  chargeId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
},{
    timestamps: true,
  });

export const pendingFeeModel = mongoose.model(
  "PendingFee",
  pendingFeeSchema
);
export default pendingFeeModel;
