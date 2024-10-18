import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'product name is required'] 
    },
    description:{
        type:String,
        required:[true, 'product description is required']
    },
    price:{
        type:Number,
        required:[true, 'product price is required']
    },
    phone:{
        type:Number,
        required:[true, 'Phone is required']
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
},{timestamps: true})

export const productModel = mongoose.model("Products", productSchema);
export default productModel;
