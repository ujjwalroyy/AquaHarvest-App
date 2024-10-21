import express from 'express';
import {
    createTransaction,
    deleteTransaction,
    getAllTransactions,
    updateProfitOrLoss,
    updateTransaction
} from '../controllers/farmInvertoryController.js';

import { isAuth } from '../middlewares/auth.js';

const router = express.Router();

router.post("/create", isAuth, createTransaction);  
router.get("/get-all", isAuth, getAllTransactions); 
router.put('/update/:id', isAuth, updateTransaction); 
router.delete('/delete/:id', isAuth, deleteTransaction);
router.put('/profit-or-loss', isAuth, updateProfitOrLoss)

export default router;
