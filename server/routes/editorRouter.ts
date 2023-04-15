import express from 'express';
import {
  createRoom,
  compileCode,
  getBojProbData,
  getProbData,
  origin,
  getLeetUserData,
} from '../controllers/editorController';

const router = express.Router();

router.get('/', origin);

/* "방 만들기" 요청에 보내는 응답 */
router.post('/new_room', createRoom);

/* "코드 실행하기" 요청에 보내는 응답 */
router.post('/code_to_run', compileCode);

/* 백준 문제 번호로 몽고DB 쿼리에 대한 응답 */
router.get('/bojdata', getBojProbData);

/* 백준 문제 필터링 몽고DB 요청에 보내는 응답 */
router.post('/probdata', getProbData);

/* leetcode 유저 정보 요청에 보내는 응답 */
router.post('/leet_user_data', getLeetUserData);

export default router;
