import express from 'express';
import { getUserInfo } from '../controllers/user';

const router = express.Router();

router.get('/user/info', getUserInfo);

export default router;