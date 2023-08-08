import express from 'express';
import {
  compileCode,
  getBojProbDataById,
  getFilteredBojProbDataByPage,
  origin,
} from '../controllers/editorController';

const router = express.Router();

router.get('/', origin);

/* "코드 실행하기" 요청에 보내는 응답 */
router.post('/code-to-run', compileCode);

/* 백준 문제 번호를 이용한 몽고DB 쿼리 응답 */
router.get('/boj-prob-data', getBojProbDataById);

/* 백준 문제 필터링 몽고DB 요청에 보내는 응답 */
router.post('/filtered-prob-data', getFilteredBojProbDataByPage);

export default router;
