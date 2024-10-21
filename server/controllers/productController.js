import { query } from "express";
import productModel from "../models/productModel.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";
import categoryModel from "../models/categoryModel.js";
import { Readable } from 'stream'; 

export const getAllProductController = async (req, res) => {
  const { keyword, category } = req.query;
  try {
    const query = {
      name: {
        $regex: keyword ? keyword : "",
        $options: "i",
      },
    };

    if (category) {
      query.category = category; 
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

export const getSingleProductController = async (req, res) => {
  try {
    console.log("Fetching product with ID:", req.params.id); 
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Product found",
      product,
    });
  } catch (error) {
    console.error(error); 
    if (error.name == "CastError") {
      return res.status(400).send({ 
        success: false,
        message: "Invalid ID",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in getting single product API",
      error,
    });
  }
};

export const createProductController = async (req, res) => {
  console.log("Received fields:", req.body);
  console.log("Received file:", req.file);

  try {
    const { name, description, price, category: categoryName, images, phone } = req.body;

    if (!name || !description || !price || !categoryName || !phone) {
      return res.status(400).send({
        success: false,
        message: "Please provide all fields",
      });
    }

    let category = await categoryModel.findOne({ name: categoryName });

    if (!category) {
      category = await categoryModel.create({ name: categoryName });
    }

    const imageData = [];

    if (req.file) {
      try {
        const stream = Readable.from(req.file.buffer);

        const uploadPromise = new Promise((resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            { resource_type: 'image' },
            (error, result) => {
              if (error) {
                return reject(error);
              }
              imageData.push({
                public_id: result.public_id,
                url: result.secure_url,
              });
              resolve();
            }
          );

          stream.pipe(uploadStream);
        });

        await uploadPromise;
      } catch (cloudinaryError) {
        console.error('Cloudinary upload error:', cloudinaryError);
        return res.status(500).send({
          success: false,
          message: 'Error uploading image to Cloudinary',
          error: cloudinaryError.message,
        });
      }
    } else {
      console.error('No file uploaded');
    }

    if (images) {
      const imageUrls = Array.isArray(images) ? images : [images];
      for (const image of imageUrls) {
        try {
          const cdb = await cloudinary.v2.uploader.upload(image);
          imageData.push({
            public_id: cdb.public_id,
            url: cdb.secure_url,
          });
        } catch (cloudinaryError) {
          console.error('Cloudinary upload error for image URL:', cloudinaryError);
          return res.status(500).send({
            success: false,
            message: 'Error uploading image URL to Cloudinary',
            error: cloudinaryError.message,
          });
        }
      }
    }

    const newProduct = await productModel.create({
      name,
      description,
      price,
      phone,
      category: category._id,
      images: imageData,
    });

    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product: {
        ...newProduct.toObject(),
        images: imageData,
      },
    });
  } catch (error) {
    console.error('Error in createProductController:', error);
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

    for (const image of product.images) {
      await cloudinary.v2.uploader.destroy(image.public_id);
    }

    await product.deleteOne(); 
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