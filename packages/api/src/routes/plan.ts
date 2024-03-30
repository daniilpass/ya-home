import express from 'express';
import { getUserPlans, getUserPlanById, updateUserPlan, createUserPlan } from '../controllers/plan';

const router = express.Router();

router.get('/plan', getUserPlans);
router.get('/plan/:id', getUserPlanById);
router.put('/plan/:id', updateUserPlan);
router.post('/plan', createUserPlan);

export default router;