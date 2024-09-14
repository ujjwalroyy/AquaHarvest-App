import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
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

export const incomeModel = mongoose.model("Income", incomeSchema);
export default incomeModel;
