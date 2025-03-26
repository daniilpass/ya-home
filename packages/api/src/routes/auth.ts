import express from 'express';

import { auth, getAuthUrl, refresh } from '../controllers/auth';

const router = express.Router();

router.get('/auth/url', getAuthUrl);

router.head('/auth', auth);

router.head('/auth/refresh', refresh);

export default router;