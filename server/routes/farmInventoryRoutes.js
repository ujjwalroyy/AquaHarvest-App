import express from 'express';
import {
    createTransaction,
    deleteTransaction,
    getAllTransactions,
    updateProfitOrLoss,
    updateTransaction
} from '../controllers/farmInvertoryController.js';

const router = express.Router();

router.post("/create", createTransaction);  // Use POST for creating records
router.get("/get-all", getAllTransactions); // Use GET to retrieve records
router.put('/update/:id', updateTransaction); // Use PUT to update records
router.delete('/delete/:id', deleteTransaction); // Use DELETE to remove records
router.put('/profit-or-loss', updateProfitOrLoss)

export default router;
