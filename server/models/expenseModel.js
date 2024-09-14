import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    pondId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ponds',  
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    remark: {
        type: String,
    },
    date: {
        type: Date,
        required: true
    }
}, { timestamps: true });

export const expenseModel = mongoose.model("Expenses", expenseSchema);
export default expenseModel;
