import galleryModel from '../models/gallaryModel.js'; 
import cloudinary from 'cloudinary';
import { Readable } from 'stream';

export const createGalleryItemController = async (req, res) => {
  console.log("Received fields:", req.body);
  console.log("Received file:", req.file);

  try {
    const { name, description, images } = req.body;

    if (!name || !description) {
      return res.status(400).send({
        success: false,
        message: "Please provide name and description.",
      });
    }

    const imageData = [];

    if (req.file) {
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

    const newGalleryItem = await galleryModel.create({
      name,
      description,
      images: imageData,
    });

    res.status(201).send({
      success: true,
      message: "Gallery item created successfully",
      galleryItem: newGalleryItem,
    });
  } catch (error) {
    console.error('Error in createGalleryItemController:', error);
    res.status(500).send({
      success: false,
      message: "Error in creating gallery item",
      error: error.message || error,
    });
  }
};

export const getAllGalleryItemsController = async (req, res) => {
  try {
    const galleryItems = await galleryModel.find().lean();

    const filteredItems = galleryItems.filter(item => item.images && item.images.length > 0);

    if (filteredItems.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No gallery items found with valid images.",
      });
    }

    res.status(200).send({
      success: true,
      message: "All gallery items with valid images fetched successfully",
      totalItems: filteredItems.length,
      galleryItems: filteredItems,
    });
  } catch (error) {
    console.error('Error in getAllGalleryItemsController:', error);
    res.status(500).send({
      success: false,
      message: "Error in fetching gallery items",
      error: error.message || error,
    });
  }
};

export const editGalleryItemController = async (req, res) => {
  const { id } = req.params;
  const { name, description, images } = req.body;

  try {
    const updatedItem = await galleryModel.findByIdAndUpdate(
      id,
      { name, description, images },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).send({
        success: false,
        message: "Gallery item not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Gallery item updated successfully",
      galleryItem: updatedItem,
    });
  } catch (error) {
    console.error('Error in editGalleryItemController:', error);
    res.status(500).send({
      success: false,
      message: "Error updating gallery item",
      error: error.message || error,
    });
  }
};

export const deleteGalleryItemController = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedItem = await galleryModel.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).send({
        success: false,
        message: "Gallery item not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Gallery item deleted successfully",
      galleryItem: deletedItem,
    });
  } catch (error) {
    console.error('Error in deleteGalleryItemController:', error);
    res.status(500).send({
      success: false,
      message: "Error deleting gallery item",
      error: error.message || error,
    });
  }
};