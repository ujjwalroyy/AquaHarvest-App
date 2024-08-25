import express from 'express';
import authToken from '../middlewares/authToken.js'; 

const router = express.Router();

router.get('/protected', authToken, (req, res) => {
  res.send(`Hello, ${req.user.name}`);
});

export default router;
