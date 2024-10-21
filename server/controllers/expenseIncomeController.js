import mongoose from 'mongoose';
import incomeModel from '../models/incomeModel.js';
import expenseModel from '../models/expenseModel.js';
import pondModel from '../models/pondModel.js'

export const createIncome = async (req, res) => {
    try {
        const { pondId, productName, cost, quantity, remark, date } = req.body;

        const newIncome = await incomeModel.create({
            userId: req.user.id, 
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
    console.log('Update Income Request:', req.params.id, req.body); 
    try {
        const { id } = req.params; 
        const updateData = req.body;

        console.log('Updating income with ID:', id);
        console.log('Update data:', updateData);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const updatedIncome = await incomeModel.findByIdAndUpdate(
            id, 
            updateData,
            { new: true, runValidators: true } 
        );

        if (!updatedIncome) {
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
            userId: req.user.id,  
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
        console.error('Error updating expense record:', error); 
        res.status(500).json({ message: 'Error updating expense record', error: error.message });
    }
};

export const calculateTotalIncome = async (req, res) => {
    try {
        const userId = req.user.id;  
        console.log('User ID:', userId); 

        const ponds = await pondModel.find({ userId });
        if (!ponds || ponds.length === 0) {
            return res.status(200).json({ totalIncome: 0 });
        }

        const incomeRecords = await incomeModel.find({
            userId, 
            pondId: { $in: ponds.map(pond => pond._id) }
        });

        const totalIncome = incomeRecords.reduce((sum, record) => sum + (record.cost || 0), 0);

        console.log('Total Income:', totalIncome); 
        res.status(200).json({ totalIncome });
    } catch (error) {
        console.error('Error calculating total income:', error);
        res.status(500).json({ message: 'Failed to calculate total income', error: error.message });
    }
};

export const calculateTotalExpenses = async (req, res) => {
    try {
        const userId = req.user.id; 
        console.log('User ID:', userId); 

        const ponds = await pondModel.find({ userId });
        if (!ponds || ponds.length === 0) {
            return res.status(200).json({ totalExpenses: 0 });
        }

        const expenseRecords = await expenseModel.find({
            userId,  
            pondId: { $in: ponds.map(pond => pond._id) }
        });

        const totalExpenses = expenseRecords.reduce((sum, record) => sum + (record.cost || 0), 0);

        console.log('Total Expenses:', totalExpenses); 
        res.status(200).json({ totalExpenses });
    } catch (error) {
        console.error('Error calculating total expenses:', error);
        res.status(500).json({ message: 'Failed to calculate total expenses', error: error.message });
    }
};

export const calculateProfitOrLossUser = async (req, res) => {
    try {
        const userId = req.user.id;  
        console.log('User ID:', userId); 

        const ponds = await pondModel.find({ userId });
        if (!ponds || ponds.length === 0) {
            return res.status(200).json({ totalIncome: 0, totalExpenses: 0, profitOrLoss: 0 });
        }

        const pondIds = ponds.map(pond => pond._id);

        const incomeRecords = await incomeModel.find({
            userId,  
            pondId: { $in: pondIds }
        });

        const expenseRecords = await expenseModel.find({
            userId,  
            pondId: { $in: pondIds }
        });

        const totalIncome = incomeRecords.reduce((sum, record) => sum + (record.cost || 0), 0);
        const totalExpenses = expenseRecords.reduce((sum, record) => sum + (record.cost || 0), 0);
        const profitOrLoss = totalIncome - totalExpenses;

        console.log('Total Income:', totalIncome); 
        console.log('Total Expenses:', totalExpenses);
        console.log('Profit or Loss:', profitOrLoss); 

        res.status(200).json({ totalIncome, totalExpenses, profitOrLoss });
    } catch (error) {
        console.error('Error calculating profit or loss:', error);
        res.status(500).json({ message: 'Failed to calculate profit or loss', error: error.message });
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



export const calculateFinancials = async (req, res) => {
    try {
        const userId = req.user.id; 

        const ponds = await pondModel.find({ userId });

        if (!ponds || ponds.length === 0) {
            return res.status(200).json({ totalIncome: 0, totalExpenses: 0, profitOrLoss: 0 });
        }

        const incomeRecords = await incomeModel.find({ pondId: { $in: ponds.map(pond => pond._id) } });
        const expenseRecords = await expenseModel.find({ pondId: { $in: ponds.map(pond => pond._id) } });

        const totalIncome = incomeRecords.reduce((sum, record) => sum + (record.cost || 0), 0);

        const totalExpenses = expenseRecords.reduce((sum, record) => sum + (record.cost || 0), 0);

        const profitOrLoss = totalIncome - totalExpenses;

        console.log('Total Income:', totalIncome);
        console.log('Total Expenses:', totalExpenses);
        console.log('Profit or Loss:', profitOrLoss);

        res.status(200).json({ totalIncome, totalExpenses, profitOrLoss });
    } catch (error) {
        console.error('Error calculating financials:', error);
        res.status(500).json({ message: 'Failed to calculate financials', error: error.message });
    }
};