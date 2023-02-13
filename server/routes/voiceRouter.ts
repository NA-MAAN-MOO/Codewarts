import express from 'express';
import {
  createSession,
  createConnection,
} from '../controllers/voiceController';

const router = express.Router();

router.post('/api/sessions', createSession);
router.post('/api/sessions/:sessionId/connections', createConnection);

export default router;
