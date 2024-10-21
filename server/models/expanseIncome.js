import mongoose from 'mongoose';

const expanseIncomeSchema = new mongoose.Schema({
    pondId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ponds',  
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
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
    },
    type: {
        type: String,
        enum: ['Income', 'Expense'], 
        required: true
    }
}, { timestamps: true });

const ExpanseIncomeModel = mongoose.model("Transaction", expanseIncomeSchema);

export default ExpanseIncomeModel;
