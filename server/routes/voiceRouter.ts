import express from 'express';
import {
  createSession,
  createConnection,
} from '../controllers/voiceController';

const router = express.Router();

router.post('/create-session', createSession);
router.post('/create-connection/:sessionId/connections', createConnection);

export default router;
