import mongoose from 'mongoose';
import incomeModel from '../models/incomeModel.js';
import expenseModel from '../models/expenseModel.js';

export const createIncome = async (req, res) => {
    try {
        const { pondId, productName, cost, quantity, remark, date } = req.body;

        const newIncome = await incomeModel.create({
            pondId,
            productName,
            cost,
            quantity,
            remark,
            date
        });

        res.status(201).json({ message: 'Income record created successfully', data: newIncome });
    } catch (error) {
        res.status(500).json({ message: 'Error creating income record', error: error.message });
    }
};


export const getAllIncome = async (req, res) => {
    try {
        const incomes = await incomeModel.find({ userId: req.user.id });
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching income records', error: error.message });
    }
};

export const getIncomeByPond = async (req, res) => {
    try {
        const { pondId } = req.params;
        const incomes = await incomeModel.find({ pondId });
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching income records', error: error.message });
    }
};


export const updateIncome = async (req, res) => {
    try {
        const { pondId } = req.params;
        const updateData = req.body;
        
        console.log('Updating income with ID:', pondId);
        console.log('Update data:', updateData);

        const updatedIncome = await incomeModel.findByIdAndUpdate(
            pondId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedIncome) {
            console.log('Income record not found');
            return res.status(404).json({ message: 'Income record not found' });
        }

        console.log('Income record updated successfully:', updatedIncome);
        res.status(200).json({ message: 'Income record updated successfully', data: updatedIncome });
    } catch (error) {
        console.error('Error updating income record:', error);
        res.status(500).json({ message: 'Error updating income record', error: error.message });
    }
};

export const deleteIncome = async (req, res) => {
    try {
        const deletedIncome = await incomeModel.findByIdAndDelete(req.params.id);
        if (!deletedIncome) {
            return res.status(404).json({ message: 'Income record not found' });
        }
        res.status(200).json({ message: 'Income record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting income record', error: error.message });
    }
};

export const createExpense = async (req, res) => {
    try {
        const { pondId, productName, cost, quantity, remark, date } = req.body;

        const newExpense = await expenseModel.create({
            pondId,
            productName,
            cost,
            quantity,
            remark,
            date
        });

        res.status(201).json({ message: 'Expense record created successfully', data: newExpense });
    } catch (error) {
        res.status(500).json({ message: 'Error creating expense record', error: error.message });
    }
};

export const getAllExpenses = async (req, res) => {
    try {
        const expenses = await expenseModel.find();
        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Error fetching expense records', error: error.message });
    }
};

export const getExpenseByPond = async (req, res) => {
    try {
        const { pondId } = req.params;
        const expenses = await expenseModel.find({ pondId });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expense records', error: error.message });
    }
};
export const updateExpense = async (req, res) => {
    try {
        const updatedExpense = await expenseModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedExpense) {
            return res.status(404).json({ message: 'Expense record not found' });
        }
        res.status(200).json({ message: 'Expense record updated successfully', data: updatedExpense });
    } catch (error) {
        res.status(500).json({ message: 'Error updating expense record', error: error.message });
    }
};

export const deleteExpense = async (req, res) => {
    try {
        const deletedExpense = await expenseModel.findByIdAndDelete(req.params.id);
        if (!deletedExpense) {
            return res.status(404).json({ message: 'Expense record not found' });
        }
        res.status(200).json({ message: 'Expense record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting expense record', error: error.message });
    }
};

export const calculateProfitOrLoss = async (req, res) => {
    try {
        const { userId, startDate, endDate } = req.body;

        if (!userId || !startDate || !endDate) {
            return res.status(400).json({ message: 'User ID, start date, and end date are required.' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        if (start > end) {
            return res.status(400).json({ message: 'Start date must be before end date.' });
        }

        const totalIncome = await incomeModel.aggregate([
            { $match: { userId: mongoose.Types.ObjectId(userId), date: { $gte: start, $lte: end } } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);

        const totalExpenses = await expenseModel.aggregate([
            { $match: { userId: mongoose.Types.ObjectId(userId), date: { $gte: start, $lte: end } } },
            { $group: { _id: null, total: { $sum: "$cost" } } }
        ]);

        const incomeTotal = totalIncome.length ? totalIncome[0].total : 0;
        const expenseTotal = totalExpenses.length ? totalExpenses[0].total : 0;
        const profitOrLoss = incomeTotal - expenseTotal;

        res.status(200).json({
            incomeTotal,
            expenseTotal,
            profitOrLoss
        });
    } catch (error) {
        res.status(500).json({ message: 'Error calculating profit or loss', error: error.message });
    }
};
