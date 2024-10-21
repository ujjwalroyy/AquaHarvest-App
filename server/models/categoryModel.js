import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: { 
        type: String,
        required: [true, 'Category name is required'], 
    },
}, { timestamps: true });

export const categoryModel = mongoose.model("Category", categorySchema);
export default categoryModel