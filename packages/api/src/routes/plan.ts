import express from 'express';
import { getUserPlan, updateUserPlan } from '../controllers/plan';

const router = express.Router();

router.get('/plan', getUserPlan);
router.put('/plan/:id', updateUserPlan);

export default router;