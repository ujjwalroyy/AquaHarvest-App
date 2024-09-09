import mongoose from 'mongoose'

const expenseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users', 
            required: true
        },
        productName:{
            type:String,
        },
        quantity:{
            type:String,
        },
        cost:{
            type: Number,
        },
        remark:{
            type:String,
        },
        date:{
            type:Date,
        }
    }, {timestamps: true}
)

export const expenseModel = mongoose.model("Expenses", expenseSchema);
export default expenseModel;