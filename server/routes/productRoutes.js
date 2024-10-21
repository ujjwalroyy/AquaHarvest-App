import express from "express";
import { createProductController, deleteProductController, deleteProductImageController, getAllProductController, getSingleProductController, updateProductController, updateProductImageCntroller } from "../controllers/productController.js";
import { isAdmin, isAuth } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router()

router.get('/get-all', getAllProductController)

router.get("/:id", getSingleProductController)

router.post('/create', singleUpload, createProductController)

router.put('/:id', isAuth, isAdmin, updateProductController)

router.put('/image/:id', isAuth, isAdmin, singleUpload, updateProductImageCntroller)

router.delete('/delete-image/:id', isAuth, isAdmin, deleteProductImageController)

router.delete('/delete/:id', deleteProductController)

export default router