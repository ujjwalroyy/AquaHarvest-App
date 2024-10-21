import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body; 
        if (!name) {
            return res.status(400).send({ 
                success: false,
                message: "Please provide category name",
            });
        }
        await categoryModel.create({ name });
        res.status(201).send({
            success: true,
            message: `${name} category created successfully`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Create Category API",
        });
    }
};

export const getAllCategoriesController = async (req, res) => {
    try {
        const categories = await categoryModel.find({}); 
        res.status(200).send({
            success: true,
            message: "Categories fetched successfully",
            categories,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Get All Categories API",
        });
    }
};

export const deleteCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id);
        if (!category) {
            return res.status(404).send({
                success: false,
                message: "Category not found",
            });
        }

        const products = await productModel.find({ category: category._id }); 
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            product.category = undefined; 
            await product.save();
        }
        
        await categoryModel.deleteOne({ _id: req.params.id }); 
        res.status(200).send({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        console.log(error);
        if (error.name == "CastError") {
            return res.status(400).send({ 
                success: false,
                message: "Invalid ID",
            });
        }
        res.status(500).send({
            success: false,
            message: "Error in Delete Category API",
            error,
        });
    }
};

export const updateCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id);
        if (!category) {
            return res.status(404).send({
                success: false,
                message: "Category not found",
            });
        }
        
        const { name } = req.body; 
        category.name = name; 
        await category.save(); 

        const products = await productModel.find({ category: category._id });
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            product.category = category._id; 
            await product.save();
        }

        res.status(200).send({
            success: true,
            message: "Category updated successfully",
        });
    } catch (error) {
        console.log(error);
        if (error.name == "CastError") {
            return res.status(400).send({
                success: false,
                message: "Invalid ID",
            });
        }
        res.status(500).send({
            success: false,
            message: "Error in Update Category API",
            error,
        });
    }
};