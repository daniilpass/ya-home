import express from 'express';
import { getDevices, postDevicesActions } from '../controllers/devices.js';

const router = express.Router();

router.get('/devices', getDevices);

router.post('/devices/actions', postDevicesActions);

export default router;