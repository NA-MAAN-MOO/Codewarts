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
  'solvedAC.level'?: string;
  source: string;
}

interface ProbFilter {
  'solvedAC.level'?: string | object | number;
  source?: string;

  // Add other possible keys here
  [key: string]: string | object | number | undefined;
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

/* fetch boj problem data by its id */
export const getBojProbDataById = async (req: Request, res: Response) => {
  try {
    console.log(req);
    const data = await Prob.find({ probId: req?.params?.probId });
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

/* process the filtering tags to proper mongoose query */
const processFilterInput = (probQuery: ProbQueryItem[]) => {
  let probFilter: ProbFilter = {};
  probQuery.forEach((query) => {
    let [key, value] = Object.entries(query)[0];
    probFilter[key] = value;
  });

  if (!('solvedAC.level' in probFilter)) return probFilter;

  const levelRanges: Record<string, { $gt: number; $lt: number }> = {
    브론즈: { $gt: 0, $lt: 6 },
    실버: { $gt: 5, $lt: 11 },
    골드: { $gt: 10, $lt: 16 },
    플래티넘: { $gt: 15, $lt: 21 },
    다이아몬드: { $gt: 20, $lt: 26 },
    루비: { $gt: 25, $lt: 32 },
  };
  const level = probFilter['solvedAC.level'] as string;
  probFilter['solvedAC.level'] = levelRanges[level] || 0;
  return probFilter;
};

const createPagingOptions = (page: number, limit: number, sort: object) => ({
  page,
  limit,
  sort,
});

const createPagingData = (
  status: number,
  message: string,
  docs: any[] = [],
  totalPages: number = 0
) => ({
  status,
  message,
  payload: { pagedDocs: docs, totalPages: totalPages },
});

const paginateFilteredResult = async (
  probFilter: ProbFilter,
  page: number,
  limit: number,
  sort: object
) => {
  const options = createPagingOptions(page, limit, sort);

  try {
    //@ts-ignore
    const result = await Prob.paginate(probFilter, options);
    let data = createPagingData(
      200,
      'problems found',
      result.docs,
      result.totalPages
    );

    // 검색 결과가 없는 경우
    if (!data.payload.pagedDocs.length) {
      data = createPagingData(404, 'problems not found');
    }
    return data;
  } catch (err) {
    console.log(err);
    return createPagingData(500, 'An error occurred while paginating result');
  }
};

/* fetch paginated and filtered boj problems */
export const getFilteredBojProbDataByPage = async (
  req: Request,
  res: Response
) => {
  const { probQuery, page, limit } = req.body;

  const probFilter = processFilterInput(probQuery);
  const sort = { probId: 'asc' };

  try {
    const response = await paginateFilteredResult(
      probFilter,
      page,
      limit,
      sort
    );
    res.status(response.status).send(response);
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

export const origin = (req: Request, res: Response) => {
  res.send({ msg: "I'm alive" });
};
