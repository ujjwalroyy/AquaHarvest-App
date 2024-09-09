import mongoose from 'mongoose'

const passbookSchema = new mongoose.Schema({
    type: String,
    productName: String,
    quantity: Number,
    cost: Number,
    remark: String,
    date: Date,
})

export const passbookModel = mongoose.model("Passbook", passbookSchema);
export default passbookModel;