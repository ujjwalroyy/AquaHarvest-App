import express from 'express'
import { calculateProfitOrLoss, createExpense, createIncome, deleteExpense, deleteIncome, getAllExpenses, getAllIncome, getExpenseById, getIncomeById, updateExpense, updateIncome } from '../controllers/expenseIncomeController.js';
import { isAuth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/income', isAuth, createIncome)
router.get('/incomes', isAuth, getAllIncome)
router.get('/income/:id', isAuth, getIncomeById)
router.put('/income/:id', isAuth, updateIncome)
router.delete('/income/:id', isAuth, deleteIncome)

router.post('/expense', isAuth, createExpense);
router.get('/expenses', isAuth, getAllExpenses);
router.get('/expense/:id', isAuth, getExpenseById);
router.put('/expense/:id', isAuth, updateExpense);
router.delete('/expense/:id', isAuth, deleteExpense);

router.post('/calculateProfitOrLoss', isAuth, calculateProfitOrLoss);

export default router;