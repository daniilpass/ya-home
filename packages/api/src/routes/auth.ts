import express from 'express';

import { auth, getAuthUrl } from '../controllers/auth';

const router = express.Router();

router.get('/auth/url', getAuthUrl);

router.get('/auth', auth);

export default router;