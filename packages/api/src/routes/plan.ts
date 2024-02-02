import express from 'express';
import { getUserPlan } from '../controllers/plan.js';

const router = express.Router();

router.get('/plan', getUserPlan);

export default router;