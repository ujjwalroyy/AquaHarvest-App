import { query } from "express";
import productModel from "../models/productModel.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";
import categoryModel from "../models/categoryModel.js";
//Get All Product
export const getAllProductController = async (req, res) => {
  const { keyword, category } = req.query;
  try {
    // Build the query object
    const query = {
      name: {
        $regex: keyword ? keyword : "",
        $options: "i",
      },
    };

    // Add category filtering if provided
    if (category) {
      query.category = category; // Assuming category is an ObjectId, adjust as necessary
    }

    const products = await productModel.find(query).populate("category");

    if (products.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No products found for the given search criteria.",
      });
    }

    res.status(200).send({
      success: true,
      message: "All products fetched successfully",
      totalProduct: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get all product API",
      error,
    });
  }
};

//get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "product not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "product found",
      product,
    });
  } catch (error) {
    console.log(error);

    if (error.name == "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in geting single product API",
      error,
    });
  }
};

//create product
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category: categoryName, images } = req.body;

    // Validate required fields
    if (!name || !description || !price || !categoryName) {
      return res.status(400).send({
        success: false,
        message: "Please provide all fields",
      });
    }

    // Fetch the category ObjectId from the database
    let category = await categoryModel.findOne({ name: categoryName }); // Ensure you're using the correct field

    // If category does not exist, create a new one
    if (!category) {
      category = await categoryModel.create({ name: categoryName }); // Ensure you're providing the name field
    }

    const imageData = [];

    // Handle uploaded file (if exists)
    if (req.file) {
      const file = getDataUri(req.file);
      const cdb = await cloudinary.v2.uploader.upload(file);
      imageData.push({
        public_id: cdb.public_id,
        url: cdb.secure_url,
      });
    }

    // Handle images URLs (if provided)
    if (images) {
      const imageUrls = Array.isArray(images) ? images : [images];
      imageUrls.forEach((image) => {
        imageData.push({
          public_id: image.split('/').pop().split('.')[0],
          url: image,
        });
      });
    }

    // Create product in the database
    await productModel.create({
      name,
      description,
      price,
      category: category._id, // Use the fetched or newly created ObjectId
      images: imageData,
    });

    res.status(201).send({
      success: true,
      message: "Product created successfully",
      
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating product",
      error: error.message || error,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    const { name, description, price, stock, category } = req.body;
    if (name) {
      product.name = name;
    }
    if (description) {
      product.description = description;
    }
    if (price) {
      product.price = price;
    }
    if (stock) {
      product.stock = stock;
    }
    if (category) {
      product.category = category;
    }

    await product.save();
    res.status(200).send({
      success: true,
      message: "product details updated",
    });
  } catch (error) {
    console.log(error);
    if (error.name == "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in update product API",
      error,
    });
  }
};

export const updateProductImageCntroller = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "No image file uploaded",
      });
    }

    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };

    product.images.push(image);
    await product.save();
    res.status(200).send({
      success: true,
      message: "Product image updated",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in update product image API",
      error,
    });
  }
};

export const deleteProductImageController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    const id = req.query.id;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    let isExist = -1;
    product.images.forEach((item, index) => {
      if (item.id.toString() === id.toString()) isExist = index;
    });
    if (isExist < 0) {
      return res.status(404).send({
        success: false,
        message: "Image not found",
      });
    }
    await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);
    product.images.splice(isExist, 1);
    await product.save();
    return res.status(200).send({
      success: true,
      message: "product images deleted successfully",
    });
  } catch (error) {
    console.log(error);
    if (error.name == "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in delete product image API",
      error,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    // Delete each image from Cloudinary
    for (const image of product.images) {
      await cloudinary.v2.uploader.destroy(image.public_id);
    }

    await product.deleteOne(); // Use deleteOne to delete the product
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in delete product API",
      error,
    });
  }
};