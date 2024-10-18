import PondTest from '../models/pondTestModel.js';

export const createPondTest = async (req, res) => {
  try {
    const {
      pondId, waterQuality, date, pH, temperature, DO, TDS, turbidity, plankton, avgLength, avgWeight
    } = req.body;

    const newPondTest = new PondTest({
      pondId,
      waterQuality,
      date,
      pH,
      temperature,
      DO,
      TDS,
      turbidity,
      plankton,
      avgLength,
      avgWeight,
    });

    await newPondTest.save();
    res.status(201).json({ message: 'Pond test saved successfully', newPondTest });
  } catch (error) {
    res.status(500).json({ message: 'Error saving pond test', error });
  }
};

export const getAllPondTest = async (req, res) => {
  try {
    const pondTests = await PondTest.find();
    res.status(200).json(pondTests);
  } catch (error) {
    console.error('Error fetching pond tests:', error);
    res.status(500).json({ message: 'Failed to fetch pond reports', error });
  }
};

export const getPondTestByPondId = async (req, res) => {
  try {
    const { pondId } = req.params;
    const pondTests = await PondTest.find({ pondId });

    if (!pondTests.length) {
      return res.status(404).json({ message: 'No tests found for this pondId' });
    }

    res.status(200).json(pondTests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pond tests', error });
  }
};

export const updatePondTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const updatedTest = await PondTest.findByIdAndUpdate(testId, req.body, { new: true });
    if (!updatedTest) return res.status(404).json({ message: 'Test not found' });
    res.status(200).json(updatedTest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePondTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const deletedTest = await PondTest.findByIdAndDelete(testId);
    if (!deletedTest) {
      return res.status(404).json({ message: 'Pond test not found' });
    }
    res.status(200).json({ message: 'Pond test deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting pond test', error });
  }
};
