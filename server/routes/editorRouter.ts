import express from 'express';
import {
  createRoom,
  compileCode,
  getBojProbData,
  origin,
} from '../controllers/editorController';

const router = express.Router();

router.get('/', origin);

/* "방 만들기" 요청에 보내는 응답 */
router.post('/create-room', createRoom);

/* "코드 실행하기" 요청에 보내는 응답 */
router.post('/run-code', compileCode);

/* 백준 문제 몽고DB 요청에 보내는 응답 */
router.get('/bojdata', getBojProbData);

export default router;
