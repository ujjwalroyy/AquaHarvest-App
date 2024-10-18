import userModel from "../models/userModel.js";
import moment from 'moment'; 

export const getAllUserProfile = async (req, res) => {
    try {
      const users = await userModel.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }
  

  export const getUserRegistrationStats = async (req, res) => {
    try {
      const users = await userModel.find();
      const registrationStats = Array(12).fill(0); // Create an array for 12 months initialized to 0
  
      users.forEach(user => {
        const month = user.createdAt.getMonth(); // Get the month (0-11)
        registrationStats[month]++; // Increment the count for the month
      });
  
      // Format the response to include month names and counts
      const formattedStats = registrationStats.map((count, index) => ({
        month: new Date(0, index).toLocaleString('default', { month: 'long' }), // Get month name
        count: count,
      }));
  
      res.json(formattedStats);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  };

  export const getUserById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await userModel.findById(id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  };

// For date formatting, make sure to install moment.js

export const getUserGraphs = async (req, res) => {
  const { userId } = req.params;

  try {
    // Assuming you have a UserActivity model that tracks user activity
    const activities = await userModel.find({ userId });

    // Initialize an object to hold the monthly activity counts
    const monthlyActivity = {};

    // Loop through the activities and count them by month
    activities.forEach(activity => {
      const month = moment(activity.date).format('MMMM'); // Get month name
      if (!monthlyActivity[month]) {
        monthlyActivity[month] = { currentData: 0, previousData: 0 }; // Initialize counts
      }
      monthlyActivity[month].currentData += 1; // Increment current month's count
    });

    // Example: Let's assume you have data for the previous year for comparison
    const previousYearActivities = await userModel.find({
      userId,
      date: { $gte: moment().subtract(1, 'year').startOf('year'), $lt: moment().startOf('year') }
    });

    previousYearActivities.forEach(activity => {
      const month = moment(activity.date).format('MMMM');
      if (!monthlyActivity[month]) {
        monthlyActivity[month] = { currentData: 0, previousData: 0 };
      }
      monthlyActivity[month].previousData += 1; // Increment previous year's count
    });

    // Prepare the graph data for response
    const graphData = [
      {
        title: "Monthly Activity",
        data: Object.keys(monthlyActivity).map(month => ({
          date: month,
          currentData: monthlyActivity[month].currentData,
          previousData: monthlyActivity[month].previousData,
        })),
      },
      // You can add more graphs here based on different metrics
    ];

    res.json(graphData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
