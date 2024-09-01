import productModel from "../models/productModel.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";
//Get All Product
export const getAllProductController = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.status(200).send({
      success: true,
      message: "all product fetched successfully",
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
    //get product id
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
    const { name, description, price, category, stock } = req.body;
    //validation
    // if (!name || !description || !price || !stock) {
    //   return res.status(500).send({
    //     success: false,
    //     message: "Please provide all fields",
    //   });
    // }
    if (!req.file) {
      return res.status(500).send({
        success: false,
        message: "please provide product images",
      });
    }
    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    await productModel.create({
      name,
      description,
      price,
      category,
      stock,
      images: [image],
    });
    res.status(201).send({
      success: true,
      message: "product Created Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in geting single product API",
      error,
    });
  }
};

// update product
export const updateProductController = async (req, res) => {
  try {
    //find product
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

//update product image
export const updateProductImageCntroller = async (req, res) => {
  try {
    //find product
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    if (!req.file) {
      return res.status(404).send({
        success: false,
        message: "Product image not found",
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

//Delete product
export const deleteProductImageController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    //image id find
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
    // delete
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

//delete product
export const deleteProductController = async (req, res) => {
  try {
    //find product
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    //find and delete
    for (let index = 0; index < product.length; index++) {
      await cloudinary.v2.uploader.destroy(product.images[index].public_id);
    }
    await product.deleteOne();
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
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
