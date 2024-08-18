import express from "express";
import { isAuth } from "../middlewares/auth.js";
import { createCategory } from "../controllers/categoryController.js";


const router = express.Router()

// create category 
router.post("/create", isAuth, createCategory)


export default router