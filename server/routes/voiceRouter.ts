import express from 'express';
import {
  getSession,
  checkSession,
  createSession,
  createConnection,
} from '../controllers/voiceController';

const router = express.Router();

router.get('/get-session', getSession);
router.get('/check-session', checkSession);
router.post('/create-session', createSession);
router.post('/create-connection/:sessionId/connections', createConnection);

export default router;
