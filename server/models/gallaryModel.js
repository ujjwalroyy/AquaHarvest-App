import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, 
    trim: true, 
  },
  description: {
    type: String,
    required: true, 
    trim: true, 
  },
  images: [
    {
      public_id: {
        type: String,
        required: true, 
      },
      url: {
        type: String,
        required: true, 
      },
    },
  ],
}, {
  timestamps: true, 
});

const galleryModel = mongoose.model('Gallery', gallerySchema);

export default galleryModel;
