import express from 'express'
import { isAuth } from '../middlewares/auth.js';
import { createPondReport, deletePondReport, getPondReportById, getPondReports, updatePondReport } from '../controllers/pondReportController.js';


const router = express.Router();
router.post('/pond-report', isAuth, createPondReport);

router.get('/pond-reports', isAuth, getPondReports);

router.get('/pond-report/:id', isAuth, getPondReportById);

router.put('/pond-report/:id', isAuth, updatePondReport);

router.delete('/pond-report/:id', isAuth, deletePondReport);


export default router;