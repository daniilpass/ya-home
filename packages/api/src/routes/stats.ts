import express from 'express';
import { ping } from '../controllers/stats';

const router = express.Router();

router.get('/stats/ping', ping);

export default router;