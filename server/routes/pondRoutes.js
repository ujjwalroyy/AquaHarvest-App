import express from 'express';
import { createPond, getAllPonds, deletePond, updatePond, updatePondTestDate, checkPondTimers } from '../controllers/pondController.js';
import { isAuth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/create', isAuth, createPond);
router.get('/getPonds', isAuth, getAllPonds);
router.delete('/delete/:pondId', isAuth, deletePond);
router.put('/update/:pondId', isAuth, updatePond);
router.put('/updateTestDate/:pondId', updatePondTestDate);
router.get('/checkTimers', checkPondTimers);


export default router;
