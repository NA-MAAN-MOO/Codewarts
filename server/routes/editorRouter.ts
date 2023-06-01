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
 * /code-to-run:
 *  post:
 *    summary: Execute compiled code
 *    description: The CodeWarts' editor sends the user's code and standard input to the Jdoodle server for a response, internally passing identifying values and language information to be compiled. CodeWarts delivers this response from Jdoodle to the client.
 *    operationId: compileCode
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              codeToRun:
 *                type: string
 *                description: The user's code to execute.
 *              stdin:
 *                type: string
 *                description: The standard input for the code.
 *            required:
 *              - codeToRun
 *              - stdin
 *          examples:
 *            general example:
 *              value:
 *                codeToRun: "print(input())"
 *                stdin: "hello world"
 *            traceback example(no input when needed):
 *              value:
 *                codeToRun: "print(input())"
 *                stdin: ""
 *    responses:
 *      200:
 *        description: Code executed successfully. This includes cases where the user's code generated a traceback error message.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                output:
 *                  type: string
 *                  description: The output of the executed code using Jdoodle API.
 *                statusCode:
 *                  type: integer
 *                  description: Status Code of the result.
 *                memory:
 *                  type: number
 *                  description: Memory used by the program.
 *                cpuTime:
 *                  type: number
 *                  description: CPU Time used by the program.
 *            examples:
 *              general example:
 *                value:
 *                  output: "hello world\n"
 *                  statusCode: 200
 *                  memory: 7580
 *                  cpuTime: 0.01
 *              traceback example:
 *                value:
 *                  output: " Traceback (most recent call last): File '/home/jdoodle.py', line 1, in <module> print(input()) EOFError: EOF when reading a line "
 *                  statusCode: 200
 *                  memory: 7852
 *                  cpuTime: 0.01
 *      400:
 *        description: Bad request
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: The compile error message .
 *                statusCode:
 *                  type: integer
 *                  description: Status Code of the result.
 *      401:
 *        description: Unauthorized
 *      429:
 *        description: Daily limit reached
 *
 */

router.post('/code-to-run', compileCode);

/* 백준 문제 번호를 이용한 몽고DB 쿼리 응답 */
router.get('/boj-prob-data', getBojProbDataById);

/* 백준 문제 필터링 몽고DB 요청에 보내는 응답 */
router.post('/filtered-prob-data', getFilteredBojProbDataByPage);

export default router;
