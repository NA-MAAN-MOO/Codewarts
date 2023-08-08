import { CONFIG } from '../constants/index'; // 환경변수
import axios from 'axios';

/* mongoose model */
import { Prob } from '../models/Prob';

/* load enviroment variables */
const CLIENT_ID = CONFIG.JDOODLE_CLIENT_ID;
const CLIENT_SECRET = CONFIG.JDOODLE_CLIENT_SECRET;

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
export const callJDoodleAPI = async (codeToRun: string, stdin: string) => {
  try {
    const program = createProgramData(codeToRun, stdin);

    const response = await axios({
      method: 'post',
      url: 'https://api.jdoodle.com/v1/execute',
      data: program,
    });

    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const getBojProblemById = async (problemId: string) => {
  try {
    const response = await Prob.find({ probId: problemId });
    if (response.length === 0) {
      return { err: 'problem not found', result: 0 };
    }
    return { err: undefined, result: response };
  } catch (error) {
    return {
      err: 'unexpected server error while getting problem by id',
      result: undefined,
    };
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

const createPagingData = (
  status: number,
  message: string,
  docs: any[] = [],
  totalPages: number = 0
) => ({
  status: status,
  message: message,
  payload: { pagedDocs: docs, totalPages: totalPages },
});

const paginateFilteredResult = async (
  probFilter: ProbFilter,
  page: number,
  limit: number,
  sort: object
) => {
  try {
    const options = { page, limit, sort };

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

export const getFilteredBojProblemByPage = async (
  page: number,
  limit: number,
  filter: string
) => {
  try {
    const probFilter = processFilterInput(JSON.parse(filter));
    const sort = { probId: 'asc' };

    const res = await paginateFilteredResult(probFilter, page, limit, sort);
    if (!res.payload) {
      return {
        err: { message: res.message, status: res.status },
        result: undefined,
      };
    }
    return { err: undefined, result: res.payload };
  } catch (error: any) {
    return {
      err: { message: 'unexpected error', status: 500 },
      result: undefined,
    };
  }
};
