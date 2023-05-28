import dotenv from 'dotenv';
dotenv.config(); //환경변수 이용(코드 최상단에 위치시킬 것)

import { Request, Response } from 'express';
import axios from 'axios';

/* mongoose model */
import { Prob } from '../models/Prob';

/* load enviroment variables */
const CLIENT_ID = process.env.JDOODLE_CLIENT_ID;
const CLIENT_SECRET = process.env.JDOODLE_CLIENT_SECRET;

/* define interfaces */
interface ProbQueryItem {
  tag: string;
}

interface ProbFilter {
  platform?: string;
  'solvedAC.level'?: number | object;
  source?: string;
}

/* create the data to be sent to the JDoodle API */
const createProgramData = (codeToRun: string, stdin: string) => {
  return {
    script: codeToRun,
    stdin: stdin,
    language: 'python3',
    versionIndex: '4',
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  };
};

/* the actual interaction with the JDoodle API */
const callJDoodleAPI = async (program: object) => {
  try {
    const response = await axios({
      method: 'post',
      url: 'https://api.jdoodle.com/v1/execute',
      data: program,
    });

    return response;
  } catch (error) {
    console.error('error:', error);
    throw new Error('Error calling JDoodle API');
  }
};

/* manage the handling for request and response to compile user's code. */
export const compileCode = async (req: Request, res: Response) => {
  const { codeToRun = '', stdin = '' } = req.body;

  // check if required fields are provided
  if (codeToRun === undefined || stdin === undefined) {
    res.status(400).send({ error: 'Required fields: codeToRun and stdin' });
    return;
  }

  const program = createProgramData(codeToRun, stdin);

  try {
    const response = await callJDoodleAPI(program);
    res.status(response.status).send(response.data);
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

/* get response for fetching boj problem data by its id */
export const getBojProbDataById = async (req: Request, res: Response) => {
  try {
    const data = await Prob.find({ probId: req?.query?.probId });
    if (data.length === 0) {
      return res.status(404).json({ message: 'Problem not found' });
    } else {
      return res.status(200).json(data);
    }
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ message: 'An error occurred while retrieving problem.' });
  }
};

/* get response for fetching filtered paginated data */
export const getFilteredBojProbDataByPage = async (
  req: Request,
  res: Response
) => {
  const probQuery: ProbQueryItem[] = req?.body.probQuery;
  const page: number = req?.body.page;
  // console.log(req?.body);

  let probFilter: ProbFilter = {};

  probQuery.forEach((value, index) => {
    console.log(value.tag, index);
    if (['백준', '리트코드'].includes(value.tag)) {
      probFilter['platform'] = value.tag;
    } else if (
      [
        '브론즈',
        '실버',
        '다이아몬드',
        '플래티넘',
        '골드',
        '루비',
        '난이도 없음',
      ].includes(value.tag)
    ) {
      let condition = null;
      switch (value.tag) {
        case '브론즈':
          condition = { $gt: 0, $lt: 6 };
          break;
        case '실버':
          condition = { $gt: 5, $lt: 11 };
          break;
        case '골드':
          condition = { $gt: 10, $lt: 16 };
          break;
        case '플래티넘':
          condition = { $gt: 15, $lt: 21 };
          break;
        case '다이아몬드':
          condition = { $gt: 20, $lt: 26 };
          break;
        case '루비':
          condition = { $gt: 25, $lt: 32 };
          break;
        default:
          condition = 0;
      }
      probFilter['solvedAC.level'] = condition;
    } else if (['한국정보올림피아드'].includes(value.tag)) {
      probFilter['source'] = value.tag;
    }
  });

  console.log(probFilter);

  const options = {
    page: page,
    limit: 10,
    sort: { probId: 'asc' },
  };

  //@ts-ignore
  Prob.paginate(probFilter, options, function (err, result) {
    // console.log(result.docs);
    // console.log(result.totalPages);
    const resultData = {
      message: 'problems found',
      payload: { pagedDocs: result.docs, totalPages: result.totalPages },
    };
    // console.log(resultData.payload);
    // console.log(result.pagingCounter);
    // result.docs is an array of paginated documents
    // result.totalPages is the total number of pages
    // result.currentPage is the current page number
    // result.hasNextPage is a boolean indicating if there are more pages
    // result.hasPrevPage is a boolean indicating if there are previous pages
    // result.nextPage is the number of the next page
    // result.prevPage is the number of the previous page
    // result.pagingCounter is the number of the current page within the total number of pages

    if (!resultData.payload.pagedDocs.length) {
      resultData.message = 'problem not found';
      res.status(404).send(resultData);
    } else {
      res.status(200).send(resultData);
    }
  });
};

export const origin = (req: Request, res: Response) => {
  res.send({ msg: "I'm alive" });
};
