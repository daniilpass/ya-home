import express from 'express';

import { getUserMedia } from '../controllers/media';

const router = express.Router();

router.get('/media/:id', getUserMedia);

export default router;