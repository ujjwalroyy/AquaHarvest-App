import express from "express";
import { isAdmin, isAuth } from "../middlewares/auth.js";
import { createCategory, deleteCategoryController, getAllCategoriesController, updateCategoryController } from "../controllers/categoryController.js";


const router = express.Router()

router.post("/create", isAdmin, createCategory)

router.get("/get-all", isAuth, getAllCategoriesController)

router.delete("/delete/:id", isAdmin, deleteCategoryController)

router.put("/update/:id", isAdmin, updateCategoryController)



export default router