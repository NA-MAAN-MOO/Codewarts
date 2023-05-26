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
/**
 * @swagger
 * /code_to_run:
 *  post:
 *    summary: Execute compiled code
 *    description: Execute code using jdoodle API
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              codeToRun:
 *                type: string
 *                description: The code to excute
 *              stdin:
 *                type: string
 *                description: The standard input for the code
 *    responses:
 *      200:
 *        description: The output of the code execution
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                output:
 *                  type: string
 *                  description: The output of the excuted code using Jdoodle API
 *                statusCode:
 *                  type: integer
 *                  description: Status Code of the result
 *                memory:
 *                  type: number
 *                  description: Memory used by the program
 *                cpuTime:
 *                  type: number
 *                  description: CPU Time used by the program
 *      400:
 *        description: The excution failed
 *        content:
 *          aplication/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: Error message
 *                statusCode:
 *                  type: integer
 *                  description: Status code of the result
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
