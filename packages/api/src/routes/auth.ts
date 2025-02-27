import express from 'express';

import { getAuthUrl, getToken } from '../controllers/auth';

const router = express.Router();

router.get('/auth/url', getAuthUrl);

router.get('/auth/token', getToken);

export default router;