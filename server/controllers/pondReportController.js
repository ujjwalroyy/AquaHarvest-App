import PondReport from '../models/ponsReportModel.js'

export const createPondReport = async (req, res) => {
    try {
      const pondReport = new PondReport(req.body);
      await pondReport.save();
      res.status(201).json({ message: 'Pond report created successfully', pondReport });
    } catch (error) {
      res.status(500).json({ message: 'Error creating pond report', error });
    }
  };

export const getPondReports = async (req, res) => {
    try {
      const pondReports = await PondReport.find();
      res.status(200).json(pondReports);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching pond reports', error });
    }
  };

  export const getPondReportById = async (req, res) => {
    try {
      const pondReport = await PondReport.findById(req.params.id);
      if (!pondReport) {
        return res.status(404).json({ message: 'Pond report not found' });
      }
      res.status(200).json(pondReport);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching pond report', error });
    }
  };

  export const updatePondReport = async (req, res) => {
    try {
      const updatedReport = await PondReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedReport) {
        return res.status(404).json({ message: 'Pond report not found' });
      }
      res.status(200).json({ message: 'Pond report updated', updatedReport });
    } catch (error) {
      res.status(500).json({ message: 'Error updating pond report', error });
    }
  };

  export const deletePondReport = async (req, res) => {
    try {
      const deletedReport = await PondReport.findByIdAndDelete(req.params.id);
      if (!deletedReport) {
        return res.status(404).json({ message: 'Pond report not found' });
      }
      res.status(200).json({ message: 'Pond report deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting pond report', error });
    }
  };
