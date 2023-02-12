import express from 'express';
import { createSession } from '../controllers/voiceController';

const router = express.Router();

router.post('sessions', createSession);
router.post('sessions/:sessionId/connections', createSession);

export default router;
