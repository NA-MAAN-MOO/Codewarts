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
 * components:
 *  schemas:
 *    UserCodeResponse:
 *      type: object
 *      properties:
 *        output:
 *          type: string
 *          description: The output of the executed code using Jdoodle API.
 *        statusCode:
 *          type: integer
 *          description: Status Code of the result.
 *        memory:
 *          type: number
 *          description: Memory used by the program.
 *        cpuTime:
 *          type: number
 *          description: CPU Time used by the program.
 *
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
 *              $ref: '#/components/schemas/UserCodeResponse'
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
/**
 * @swagger
 * components:
 *  schemas:
 *    BOJProblemData:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          format: uuid
 *          description: The auto-generated id of the problem
 *          example: new ObjectId("63ed161b27652b075011b125")
 *        probId:
 *          type: integer
 *          description: The id of the problem
 *          example: 1001
 *        prob_desc:
 *          type: string
 *          description: The description of the problem
 *          example: \n두 정수 A와 B를 입력받은 다음, A-B를 출력하는 프로그램을 작성하시오.\n
 *        prob_input:
 *          type: string
 *          description: The input of the problem
 *          example: \n첫째 줄에 A와 B가 주어진다. (0 < A, B < 10)\n
 *        prob_output:
 *          type: string
 *          description: The output of the problem
 *          example: \n첫째 줄에 A-B를 출력한다.\n
 *        samples:
 *          type: object
 *          description: Sample input and output of the problem
 *          example: { '1': {input: '3 2\n', output: '1'} }
 *          properties:
 *            1:
 *              type: object
 *              properties:
 *                input:
 *                  type: string
 *                  example: 3 2\n
 *                output:
 *                  type: string
 *                  example: 1
 *        source:
 *          type: string
 *          description: The source of the problem
 *          example: 한국정보올림피아드
 *        solvedAC:
 *          type: object
 *          description: Information about the problem solution from Solved.AC
 *          properties:
 *            problemId:
 *              type: integer
 *              description: The problem id
 *            titleKo:
 *              type: string
 *              description: The Korean title of the problem
 *            titles:
 *              type: array
 *              description: The Korean title of the problem
 *              example: [{language: 'ko', languageDisplayName: 'ko', title: 'A-B', isOriginal: true}]
 *            isSolvable:
 *              type: boolean
 *              description: The Korean title of the problem
 *            isPartial:
 *              type: boolean
 *              description: The Korean title of the problem
 *            acceptedUserCount:
 *              type: integer
 *              description: The Korean title of the problem
 *            level:
 *              type: integer
 *              description: The Korean title of the problem
 *            votedUserCount:
 *              type: integer
 *              description: The Korean title of the problem
 *            sprout:
 *              type: boolean
 *              description: The Korean title of the problem
 *            givesNoRating:
 *              type: boolean
 *              description: The Korean title of the problem
 *            isLevelLocked:
 *              type: boolean
 *              description: The Korean title of the problem
 *            averageTries:
 *              type: number
 *              description: The Korean title of the problem
 *            official:
 *              type: boolean
 *              description: The Korean title of the problem
 *            tags:
 *              type: array
 *              description: The algorithms tags of the problem 
 *              example: [{key: 'implementation', isMeta: false, bojTagId: 102, problemCount: 4169, displayNames: [{language: 'ko', name: '구현', short: '구현'}, 
{language: 'en', name: 'implementation', short: 'impl'}]}, {key: 'arithmetic', isMeta: false, bojTagId: 121, problemCount: 809, displayNames: [
{language: 'ko', name: '사칙연산', short: '사칙연산'}, {language: 'en', name: 'arithmetic', short: 'arithmetic'}]}, {key: 'math', isMeta: false, bojTagId: 124, problemCount: 4899, displayNames: [{language: 'ko', name: '수학', short: '수학'}, {language: 'en', name: 'mathematics', short: 'math'}]}]
 * /boj-prob-data:
 *  get:
 *    summary: Retrieves the problem by its id
 *    description: This fetches a single problem from Baekjoon Online Judge (BOJ) by its id.
 *    operationId: getBojProbDataById
 *    parameters:
 *      - in: query
 *        name: probId
 *        schema:
 *          type: integer
 *        required: true
 *        description: Numeric ID of the problem to get
 *    responses:
 *      200:
 *        description: Problem data retrieved successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              $ref: '#/components/schemas/BOJProblemData'
 *      404:
 *        description: The problem data you are searching for does not exist.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Problem not found
 *      500:
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: 'An error occurred while retrieving problem.'
 *
 */
router.get('/boj-prob-data/:probId', getBojProbDataById);

/* 백준 문제 필터링 몽고DB 요청에 보내는 응답 */
/**
 * @swagger
 * /filtered-prob-data:
 *  post:
 *    summary: Retrieves filtered list of problems by page
 *    description: This fetches a paginated list of problems from Baekjoon Online Judge (BOJ) based on provided filter criteria.
 *    operationId: getFilteredBojProbDataByPage
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              probQuery:
 *                type: object
 *                description: The problem filter query
 *              page:
 *                type: integer
 *                description: The page number to fetch
 *              limit:
 *                type: integer
 *                description: The number of problems per page
 *            required:
 *              - probQuery
 *              - page
 *              - limit
 *    responses:
 *      200:
 *        description: Problem data retrieved successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              $ref: '#/components/schemas/BOJProblemData'
 *      500:
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: Error message
 *
 */
router.post('/filtered-prob-data', getFilteredBojProbDataByPage);

export default router;
