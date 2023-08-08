import express from 'express';
import * as editorController from '../controllers/editorController';

const router = express.Router();

router.get('/', editorController.origin);

/* "코드 실행하기" 요청에 보내는 응답 */
router.post('/usercode', editorController.compileCode);

/* 백준 문제 번호를 이용한 몽고DB 쿼리 응답 */
router.get('/problems/:problemId', editorController.getBojProblemById);

/* 백준 문제 필터링 몽고DB 요청에 보내는 응답 */
router.get('/problems', editorController.getFilteredBojProblemByPage);

export default router;
