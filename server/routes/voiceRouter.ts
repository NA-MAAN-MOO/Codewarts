import express from 'express';
import {
  createSession,
  createConnection,
  getConnections,
  getSessions,
} from '../controllers/voiceController';

const router = express.Router();

router.post('/create-session', createSession);
router.post('/create-connection/:sessionId/connections', createConnection);
router.get('/get-connections', getConnections);
router.get('/get-sessions', getSessions);

export default router;
