import express from 'express'
import { isAuth } from '../middlewares/auth.js';


const router = express.Router();
router.post('/pond-report', pondReportController.createPondReport);

// Route to get all pond reports
router.get('/pond-reports', pondReportController.getPondReports);

// Route to get a specific pond report by ID
router.get('/pond-report/:id', pondReportController.getPondReportById);

// Route to update a pond report by ID
router.put('/pond-report/:id', pondReportController.updatePondReport);

// Route to delete a pond report by ID
router.delete('/pond-report/:id', pondReportController.deletePondReport);


export default router;