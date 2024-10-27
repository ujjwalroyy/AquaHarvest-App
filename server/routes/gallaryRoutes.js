import express from 'express';
import { isAuth } from '../middlewares/auth.js';
import { singleUpload } from '../middlewares/multer.js';
import { createGalleryItemController, getAllGalleryItemsController } from '../controllers/gallaryController.js';

const router = express.Router();

router.get('/get-all', isAuth, getAllGalleryItemsController);

router.post('/create', singleUpload, createGalleryItemController);

export default router;
