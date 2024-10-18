import mongoose from 'mongoose';

const farmInventorySchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['Income', 'Expense'],
    required: true,
  },
  profitOrLoss: Number
});

export const farmInventoryModel = mongoose.model("FarmInventory", farmInventorySchema);
export default farmInventoryModel;
