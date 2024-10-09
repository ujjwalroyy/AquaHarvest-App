import express from "express";
import { isAuth } from "../middlewares/auth.js";
import { createCategory, deleteCategoryController, getAllCategoriesController, updateCategoryController } from "../controllers/categoryController.js";


const router = express.Router()

// create category 
router.post("/create", createCategory)

router.get("/get-all", isAuth, getAllCategoriesController)

router.delete("/delete/:id", isAuth, deleteCategoryController)

router.put("/update/:id", isAuth, updateCategoryController)



export default router