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
      const galleryItems = await galleryModel.find();
  
      if (galleryItems.length === 0) {
        return res.status(404).send({
          success: false,
          message: "No gallery items found.",
        });
      }
  
      res.status(200).send({
        success: true,
        message: "All gallery items fetched successfully",
        totalItems: galleryItems.length,
        galleryItems,
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
  