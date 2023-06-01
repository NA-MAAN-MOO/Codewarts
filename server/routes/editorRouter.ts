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
/**
 * @swagger
 * /code_to_run:
 *   post:
 *     summary: Execute compiled code
 *     description: The CodeWarts' editor sends the user's code and standard input to the Jdoodle server for a response, internally passing identifying values and language information to be compiled. CodeWarts delivers this response from Jdoodle to the client.
 *     operationId: compileCode
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codeToRun:
 *                 type: string
 *                 description: The code to execute.
 *                 example: print("hello world")
 *               stdin:
 *                 type: string
 *                 description: The standard input for the code.
 *                 example: hello
 *             required:
 *               - codeToRun
 *               - stdin
 *     responses:
 *       200:
 *         description: Code executed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 output:
 *                   type: string
 *                   description: The output of the executed code using Jdoodle API.
 *                 statusCode:
 *                   type: integer
 *                   description: Status Code of the result.
 *                 memory:
 *                   type: number
 *                   description: Memory used by the program.
 *                 cpuTime:
 *                   type: number
 *                   description: CPU Time used by the program.
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The compile error message .
 *                 statusCode:
 *                   type: integer
 *                   description: Status Code of the result.
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Daily limit reached
 *
 */

router.post('/code_to_run', compileCode);

/* 백준 문제 번호를 이용한 몽고DB 쿼리 응답 */
router.get('/boj_prob_data', getBojProbDataById);

/* 백준 문제 필터링 몽고DB 요청에 보내는 응답 */
router.post('/filtered_prob_data', getFilteredBojProbDataByPage);

export default router;
