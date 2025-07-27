import express from 'express';
import { register, login } from '../controllers/auth.js';

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);
router.post('/health', (req, res) => {
  res.status(200).json({ message: 'Auth service is healthy' });
});

export default router;
