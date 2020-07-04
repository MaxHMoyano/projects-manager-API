import express from 'express';
const router = express.Router();

// Local imports
import { register } from '../controllers/auth';

router.post('/register', register);

export default router;
