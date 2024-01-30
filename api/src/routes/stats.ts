import express from 'express';
import { ping } from '../controllers/stats.js';

const router = express.Router();

router.get('/stats/ping', ping);

export default router;