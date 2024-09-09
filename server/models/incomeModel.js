import mongoose from 'mongoose'

const incomeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', 
        required: true
    },
    productName:{
        type:String,
    },
    cost:{
        type:Number,
    },
    quantity:{
        type:String,
    },
    totalPrice:{
        type:Number,
    },
    remark:{
        type: String
    },
    date:{
        type:Date,
    }
}, {timestamps: true})

export const incomeModel = mongoose.model("Income", incomeSchema)
export default incomeModel