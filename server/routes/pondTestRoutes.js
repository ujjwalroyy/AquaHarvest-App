import express from 'express';
import { createPondTest, deletePondTest, getAllPondTest, getPondTestByPondId } from '../controllers/pondTestController.js';

const router = express.Router();

router.post('/pond-test', createPondTest);

router.get('/pond-test/get-all', getAllPondTest)

router.get('/pond-tests/:pondId', getPondTestByPondId);

router.delete('/pond-test/:testId', deletePondTest);


export default router;
