
import express from 'express';
import { getAllUserProfile, getUserById, getUserGraphs, getUserRegistrationStats } from '../controllers/adminController.js';

const router = express.Router();

router.get("/get-users", getAllUserProfile)

router.get("/graph",getUserRegistrationStats)

router.get('/getuser/:id', getUserById);
router.get('/getusergraphs/:userId', getUserGraphs);

export default router;
