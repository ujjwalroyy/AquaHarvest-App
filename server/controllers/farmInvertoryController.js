import farmInventoryModel from '../models/farmInventory.js';

// Create a new inventory record
export const createTransaction = async (req, res) => {
    try {
        const { productName, quantity, cost, type } = req.body;

        // Validate the type
        if (!['Income', 'Expense'].includes(type)) {
            return res.status(400).json({ message: 'Type must be either "Income" or "Expense"' });
        }

        const newTransaction = await farmInventoryModel.create({
            productName,
            quantity,
            cost,
            type
        });

        res.status(201).json({ message: 'Transaction record created successfully', data: newTransaction });
    } catch (error) {
        res.status(500).json({ message: 'Error creating transaction record', error: error.message });
    }
};

// Get all inventory records
export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await farmInventoryModel.find();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transaction records', error: error.message });
    }
};

// Update an inventory record by ID
export const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;  // Getting ID from route parameters
        const updateData = req.body;

        // Validate the type
        if (updateData.type && !['Income', 'Expense'].includes(updateData.type)) {
            return res.status(400).json({ message: 'Type must be either "Income" or "Expense"' });
        }

        const updatedTransaction = await farmInventoryModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedTransaction) {
            return res.status(404).json({ message: 'Transaction record not found' });
        }

        res.status(200).json({ message: 'Transaction record updated successfully', data: updatedTransaction });
    } catch (error) {
        res.status(500).json({ message: 'Error updating transaction record', error: error.message });
    }
};

// Delete an inventory record by ID
export const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;  // Getting ID from route parameters
        const deletedTransaction = await farmInventoryModel.findByIdAndDelete(id);

        if (!deletedTransaction) {
            return res.status(404).json({ message: 'Transaction record not found' });
        }

        res.status(200).json({ message: 'Transaction record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting transaction record', error: error.message });
    }
};

export const updateProfitOrLoss = async (req, res) => {
    try {
      const { profitOrLoss } = req.body;
      console.log('Incoming request:', req.body);  // Log request body
      
      const inventory = await FarmInventory.findOneAndUpdate(
        { /* criteria to identify profit/loss record */ },
        { $set: { profitOrLoss } },
        { new: true, upsert: true } 
      );
      
      res.status(200).json(inventory);
    } catch (error) {
      console.error('Error updating profit or loss:', error);  // Log error details
      res.status(500).json({ error: 'Error updating profit or loss' });
    }
  };