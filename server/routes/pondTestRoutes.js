import express from 'express';
import { createPondTest, deletePondTest, getPondTestByPondId } from '../controllers/pondTestController.js';

const router = express.Router();

router.post('/pond-test', createPondTest);

router.get('/pond-tests/:pondId', getPondTestByPondId);

router.delete('/pond-test/:testId', deletePondTest);


export default router;
