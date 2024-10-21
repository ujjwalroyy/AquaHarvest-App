import farmInventoryModel from '../models/farmInventory.js';

export const createTransaction = async (req, res) => {
    try {
        const { productName, quantity, cost, type } = req.body;
        const userId = req.user._id;  

        if (!['Income', 'Expense'].includes(type)) {
            return res.status(400).json({ message: 'Type must be either "Income" or "Expense"' });
        }

        const newTransaction = await farmInventoryModel.create({
            productName,
            quantity,
            cost,
            type,
            userId  
        });

        res.status(201).json({ message: 'Transaction record created successfully', data: newTransaction });
    } catch (error) {
        res.status(500).json({ message: 'Error creating transaction record', error: error.message });
    }
};

export const getAllTransactions = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const userId = req.user._id;  
        console.log('Fetching transactions for User ID:', userId); 

        const transactions = await farmInventoryModel.find({ userId }).lean(); 

        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transaction records:', error);
        res.status(500).json({ message: 'Error fetching transaction records', error: error.message });
    }
};

export const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;  
        const updateData = req.body;

        if (updateData.type && !['Income', 'Expense'].includes(updateData.type)) {
            return res.status(400).json({ message: 'Type must be either "Income" or "Expense"' });
        }

        const updatedTransaction = await farmInventoryModel.findOneAndUpdate(
            { _id: id, userId },  
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedTransaction) {
            return res.status(404).json({ message: 'Transaction record not found or unauthorized' });
        }

        res.status(200).json({ message: 'Transaction record updated successfully', data: updatedTransaction });
    } catch (error) {
        res.status(500).json({ message: 'Error updating transaction record', error: error.message });
    }
};

export const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id; 
        const deletedTransaction = await farmInventoryModel.findOneAndDelete({ _id: id, userId });

        if (!deletedTransaction) {
            return res.status(404).json({ message: 'Transaction record not found or unauthorized' });
        }

        res.status(200).json({ message: 'Transaction record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting transaction record', error: error.message });
    }
};

export const updateProfitOrLoss = async (req, res) => {
    try {
        const { profitOrLoss } = req.body;
        const userId = req.user._id;  

        const inventory = await farmInventoryModel.findOneAndUpdate(
            { userId, type: 'Profit/Loss' },  
            { $set: { profitOrLoss } },
            { new: true, upsert: true }  
        );

        res.status(200).json(inventory);
    } catch (error) {
        console.error('Error updating profit or loss:', error);
        res.status(500).json({ error: 'Error updating profit or loss' });
    }
};