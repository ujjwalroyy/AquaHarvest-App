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
      const registrationStats = Array(12).fill(0); 
  
      users.forEach(user => {
        const month = user.createdAt.getMonth(); 
        registrationStats[month]++; 
      });
  
      const formattedStats = registrationStats.map((count, index) => ({
        month: new Date(0, index).toLocaleString('default', { month: 'long' }), 
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


export const getUserGraphs = async (req, res) => {
  const { userId } = req.params;

  try {
    const activities = await userModel.find({ userId });

    const monthlyActivity = {};

    activities.forEach(activity => {
      const month = moment(activity.date).format('MMMM'); 
      if (!monthlyActivity[month]) {
        monthlyActivity[month] = { currentData: 0, previousData: 0 };
      }
      monthlyActivity[month].currentData += 1; 
    });

    const previousYearActivities = await userModel.find({
      userId,
      date: { $gte: moment().subtract(1, 'year').startOf('year'), $lt: moment().startOf('year') }
    });

    previousYearActivities.forEach(activity => {
      const month = moment(activity.date).format('MMMM');
      if (!monthlyActivity[month]) {
        monthlyActivity[month] = { currentData: 0, previousData: 0 };
      }
      monthlyActivity[month].previousData += 1; 
    });

    const graphData = [
      {
        title: "Monthly Activity",
        data: Object.keys(monthlyActivity).map(month => ({
          date: month,
          currentData: monthlyActivity[month].currentData,
          previousData: monthlyActivity[month].previousData,
        })),
      },
    ];

    res.json(graphData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
