import express from 'express'
import { isAuth } from '../middlewares/auth.js';
import { buySubscription, paymentVerification } from '../controllers/paymentController.js';


const router = express.Router();

router.get("/subscribe", isAuth, buySubscription)

router.post("/paymentVerification", isAuth, paymentVerification)


export default router;