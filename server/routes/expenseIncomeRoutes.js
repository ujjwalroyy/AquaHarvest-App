import express from 'express'
import { calculateFinancials, calculateProfitOrLoss, calculateProfitOrLossUser, calculateTotalExpenses, calculateTotalIncome, createExpense, createIncome, deleteExpense, deleteIncome, getAllExpenses, getAllIncome, getExpenseByPond, getIncomeByPond, updateExpense, updateIncome } from '../controllers/expenseIncomeController.js';
import { isAuth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/income', isAuth, createIncome)
router.get('/incomes', isAuth, getAllIncome)
router.get('/income/pond/:pondId', isAuth, getIncomeByPond)
router.put('/income/:pondId', isAuth, updateIncome)
router.delete('/income/:pondId', isAuth, deleteIncome)

router.get('/income/total', isAuth, calculateTotalIncome);
router.get('/expenses/total', isAuth, calculateTotalExpenses);
router.get('/profit-loss', isAuth, calculateProfitOrLossUser);

router.post('/expense', isAuth, createExpense);
router.get('/expenses', isAuth, getAllExpenses);
router.get('/expense/pond/:pondId', isAuth, getExpenseByPond);
router.put('expense/:pondId', isAuth, updateExpense);
router.delete('/expense/:pondId', isAuth, deleteExpense);
router.get('/calculate', isAuth, calculateFinancials);

router.post('/calculateProfitOrLoss', isAuth, calculateProfitOrLoss);

export default router;