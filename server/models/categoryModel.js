import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: { // Changed 'category' to 'name' for clarity
        type: String,
        required: [true, 'Category name is required'], 
    },
}, { timestamps: true });

export const categoryModel = mongoose.model("Category", categorySchema);
export default categoryModel