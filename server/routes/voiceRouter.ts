import express from 'express';
import {
  createSession,
  createConnection,
  getConnections,
  getSessions,
  getSessionFromId,
  deleteSession,
  deleteConnection,
} from '../controllers/voiceController';

const router = express.Router();

router.post('/create-session', createSession);
router.post('/create-connection/:sessionId/connections', createConnection);
router.get('/get-connections', getConnections);
router.get('/get-sessions', getSessions);
router.get('/get-session-from-id', getSessionFromId);
router.delete('/delete-session/:sessionId', deleteSession);
router.delete('/delete-connection/:sessionId', deleteConnection);

export default router;
