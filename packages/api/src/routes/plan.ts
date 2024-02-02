import express from 'express';
import { getUserPlan } from '../controllers/plan';

const router = express.Router();

router.get('/plan', getUserPlan);

export default router;