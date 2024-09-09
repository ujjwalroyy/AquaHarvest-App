import express from "express";
import { isAuth } from "../middlewares/auth.js";
import { filterRecords, calculateProfitOrLoss } from '../controllers/passbookController.js';
const router = express.Router();

router.post('/filter', isAuth, filterRecords);

router.post('/calculateProfitOrLoss', isAuth, calculateProfitOrLoss);

export default router;