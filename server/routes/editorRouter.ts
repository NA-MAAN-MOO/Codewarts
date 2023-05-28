import express from 'express';
import {
  compileCode,
  getBojProbData,
  getProbData,
  origin,
} from '../controllers/editorController';

const router = express.Router();

router.get('/', origin);

/* "코드 실행하기" 요청에 보내는 응답 */
/**
 * @swagger
 * /code_to_run:
 *  post:
 *    summary: Execute compiled code
 *    description: Execute code using jdoodle API
 *    operationId: compileCode
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CodeToRun'
 *    responses:
 *      200:
 *        description: The output of the code execution
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ExecutionOutput'
 *      400:
 *        description: The excution failed
 *        content:
 *          aplication/json:
 *            schema:
 *              $ref: '#/components/schemas/ExecutionTraceback'
 *      401:
 *        description: Unauthorized
 *      429:
 *        description: Daily limit reached
 *
 */
router.post('/code_to_run', compileCode);

/* 백준 문제 번호로 몽고DB 쿼리에 대한 응답 */
router.get('/bojdata', getBojProbData);

/* 백준 문제 필터링 몽고DB 요청에 보내는 응답 */
router.post('/probdata', getProbData);

export default router;
