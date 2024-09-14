import mongoose from "mongoose";

const cardDetailSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  customerId: {
    type: String,
    required: true,
  },
  cardId: {
    type: String,
    required: false,
  },
  brand: {
    type: String,
    required: false,
  },
  month: {
    type: String,
    required: false,
  },
  year: {
    type: Number,
    required: false,
  },
},{
    timestamps: true,
  });

export const cardDetailModel = mongoose.model(
  "CardDetail",
  cardDetailSchema
);
export default cardDetailModel;
