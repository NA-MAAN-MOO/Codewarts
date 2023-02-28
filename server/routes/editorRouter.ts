import express from 'express';
import {
  createRoom,
  compileCode,
  getBojProbData,
  getProbData,
  origin,
} from '../controllers/editorController';

const router = express.Router();

router.get('/', origin);

/* "방 만들기" 요청에 보내는 응답 */
router.post('/new_room', createRoom);

/* "코드 실행하기" 요청에 보내는 응답 */
router.post('/code_to_run', compileCode);

/* 백준 문제 몽고DB 요청에 보내는 응답 */
router.get('/bojdata', getBojProbData);

/* 백준 문제 몽고DB 요청에 보내는 응답 */
router.post('/probdata', getProbData);

export default router;
