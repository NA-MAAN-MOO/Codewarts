import express from 'express';
import {
  createSession,
  createConnection,
} from '../controllers/voiceController';

const router = express.Router();

router.post('sessions', createSession);
router.post('sessions/:sessionId/connections', createConnection);

export default router;
