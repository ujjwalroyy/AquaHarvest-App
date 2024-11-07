import express from 'express';
import { isAuth } from '../middlewares/auth.js';
import { singleUpload } from '../middlewares/multer.js';
import { createGalleryItemController, deleteGalleryItemController, editGalleryItemController, getAllGalleryItemsController } from '../controllers/gallaryController.js';

const router = express.Router();

router.get('/get-all', isAuth, getAllGalleryItemsController);

router.post('/create', singleUpload, createGalleryItemController);

router.put('/edit/:id', editGalleryItemController);

router.delete('/delete/:id', deleteGalleryItemController);

export default router;
