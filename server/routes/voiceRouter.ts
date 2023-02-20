import express from 'express';
import {
  createSession,
  createConnection,
  getConnection,
} from '../controllers/voiceController';

const router = express.Router();

router.post('/create-session', createSession);
router.post('/create-connection/:sessionId/connections', createConnection);
router.get('/get-connection', getConnection);

export default router;
