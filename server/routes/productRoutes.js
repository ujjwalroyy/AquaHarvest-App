import express from "express";
import { createProductController, deleteProductController, deleteProductImageController, getAllProductController, getSingleProductController, updateProductController, updateProductImageCntroller } from "../controllers/productController.js";
import { isAdmin, isAuth } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router()

//get all product
router.get('/get-all', getAllProductController)

//get single product
router.get("/:id", getSingleProductController)

//create product
router.post('/create', singleUpload, createProductController)

//update product
router.put('/:id', isAuth, isAdmin, updateProductController)

//update product image
router.put('/image/:id', isAuth, isAdmin, singleUpload, updateProductImageCntroller)

//delete product image
router.delete('/delete-image/:id', isAuth, isAdmin, deleteProductImageController)

//delete product
router.delete('/delete/:id', isAuth, isAdmin, deleteProductController)

export default router