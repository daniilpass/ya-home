import express from 'express';
import { getDevices } from '../controllers/devices.js';

const router = express.Router();

router.get('/devices', getDevices);

export default router;