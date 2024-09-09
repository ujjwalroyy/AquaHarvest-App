

export const filterRecords = async (req, res) => {
    const { filterType, startDate, endDate } = req.body;
    let query = {};
  
    if (filterType === 'pastDays') {
      const pastDaysDate = new Date();
      pastDaysDate.setDate(pastDaysDate.getDate() - 30);
      query.date = { $gte: pastDaysDate };
    } else if (filterType === 'last3Months') {
      const last3MonthsDate = new Date();
      last3MonthsDate.setMonth(last3MonthsDate.getMonth() - 3);
      query.date = { $gte: last3MonthsDate };
    } else if (filterType === 'last6Months') {
      const last6MonthsDate = new Date();
      last6MonthsDate.setMonth(last6MonthsDate.getMonth() - 6);
      query.date = { $gte: last6MonthsDate };
    } else if (filterType === 'custom' && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (!isNaN(start) && !isNaN(end)) {
        query.date = { $gte: start, $lte: end };
      } else {
        return res.status(400).json({ error: 'Invalid date range' });
      }
    } else {
      return res.status(400).json({ error: 'Invalid filter type' });
    }
  
    try {
      const records = await Record.find(query);
      res.json(records);
    } catch (error) {
      console.error('Error filtering records:', error);
      res.status(500).json({ error: 'An error occurred while filtering records' });
    }
  };
  
  export const calculateProfitOrLoss = async (req, res) => {
    const { startDate, endDate } = req.body;
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }
  
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ error: 'Invalid date range' });
    }
  
    try {
      const expenses = await Record.find({ type: 'expense', date: { $gte: start, $lte: end } });
      const income = await Record.find({ type: 'income', date: { $gte: start, $lte: end } });
  
      const totalExpenses = expenses.reduce((acc, curr) => acc + curr.cost, 0);
      const totalIncome = income.reduce((acc, curr) => acc + curr.cost, 0);
  
      const profitOrLoss = totalIncome - totalExpenses;
      res.json({ profitOrLoss });
    } catch (error) {
      console.error('Error calculating profit or loss:', error);
      res.status(500).json({ error: 'An error occurred while calculating profit or loss' });
    }
  };
  