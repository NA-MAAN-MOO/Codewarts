import express from 'express';
import { createRoom, origin } from '../controllers/editorController';

const router = express.Router();

router.get('/', origin);

/* "방 만들기" 요청에 보내는 응답 */
router.post('/create-room', createRoom);

export default router;
