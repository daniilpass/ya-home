import express from 'express';
import { getLoginInfo } from '../controllers/login';

const router = express.Router();

router.get('/login/info', getLoginInfo);

export default router;