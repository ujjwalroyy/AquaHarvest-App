import Pond from '../models/pondModel.js'; 

export const createPond = async (req, res) => {
  try {
    const { _id: userId } = req.user; 

  
    const { name, pondType, depth, area, quantity, feedType, testDate, test } = req.body;
    if (!name || !pondType || !depth || !area || !quantity || !feedType || !testDate || !test) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const pondData = {
      ...req.body,
      userId
    };

    const newPond = await Pond.create(pondData);
    res.status(201).json(newPond);
  } catch (error) {
    console.error('Error creating pond:', error.message); 
    res.status(400).json({ message: error.message });
  }
};

export const getAllPonds = async (req, res) => {
  try {
    const userId = req.user._id; 

    const ponds = await Pond.find({ userId });
    res.status(200).json(ponds);
  } catch (error) {
    console.error('Error fetching ponds:', error.message); 
    res.status(500).json({ message: 'Failed to fetch ponds.' });
  }
};

export const deletePond = async (req, res) => {
  try {
    const { _id: userId } = req.user; 
    const { pondId } = req.params;

    console.log('User ID from request:', userId);
    console.log('Pond ID from request:', pondId);

    const pond = await Pond.findById(pondId);
    console.log('Pond found:', pond);

    if (!pond) {
      return res.status(404).json({ message: "Pond not found" });
    }

    console.log('Pond userId:', pond.userId.toString());
    if (!pond.userId.equals(userId)) {
      return res.status(403).json({ message: "Not authorized to update this pond" });
    }

    await Pond.findByIdAndDelete(pondId);
    res.status(200).json({ message: "Pond deleted successfully" });
  } catch (error) {
    console.error('Error deleting pond:', error.message);
    res.status(400).json({ message: error.message });
  }
};


export const updatePond = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { pondId } = req.params;
    const updatedData = req.body;

    console.log("User ID from request:", userId);
    console.log("Pond ID from request:", pondId);

    const pond = await Pond.findById(pondId);

console.log("Pond User ID: ", pond.userId.toString());

    if (!pond) {
      return res.status(404).json({ message: "Pond not found" });
    }

    if (!pond.userId.equals(userId)) {
      return res.status(403).json({ message: "Not authorized to update this pond" });
    }

    const updatedPond = await Pond.findByIdAndUpdate(pondId, updatedData, { new: true });
    res.status(200).json(updatedPond);
  } catch (error) {
    console.error('Error updating pond:', error.message); 
    res.status(400).json({ message: error.message });
  }
};
