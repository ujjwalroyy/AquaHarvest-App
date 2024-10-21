import mongoose from 'mongoose';

const farmInventorySchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0, 
  },
  cost: {
    type: Number,
    required: true,
    min: 0,  
  },
  type: {
    type: String,
    enum: ['Income', 'Expense'],
    required: true,
  },
  userId: {  
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', 
  },
  profitOrLoss: {
    type: Number,
    default: 0,
  }
});

export const farmInventoryModel = mongoose.model("FarmInventory", farmInventorySchema);
export default farmInventoryModel;
