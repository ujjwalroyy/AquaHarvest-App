import express from 'express'
import { isAuth } from '../middlewares/auth.js';
import { createPondReport, deletePondReport, getPondReportById, getPondReports, updatePondReport } from '../controllers/pondReportController.js';


const router = express.Router();
router.post('/pond-report', isAuth, createPondReport);

// Route to get all pond reports
router.get('/pond-reports', isAuth, getPondReports);

// Route to get a specific pond report by ID
router.get('/pond-report/:id', isAuth, getPondReportById);

// Route to update a pond report by ID
router.put('/pond-report/:id', isAuth, updatePondReport);

// Route to delete a pond report by ID
router.delete('/pond-report/:id', isAuth, deletePondReport);


export default router;