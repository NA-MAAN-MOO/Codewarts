import dotenv from 'dotenv';
//환경변수 이용(코드 최상단에 위치시킬 것)
dotenv.config();

import { v4 } from 'uuid';
import moment from 'moment';
import { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';

const { MongoClient } = require('mongodb');
const mongoPassword = process.env.MONGO_PW;
import { Prob } from '../models/Prob';

export const createRoom = async (req: Request, res: Response) => {
  const { userName = '', redisClient } = req.body;
  const hashField = 'code-mirror';
  const editorName = v4(); // editorName 최초 생성

  await redisClient
    /* room 정보 해쉬로 저장 */
    .hSet(
      `${editorName}:info`,
      hashField,
      JSON.stringify({
        created: moment(),
        updated: moment(),
      })
    )
    .catch((err: Error) => {
      console.error(1, err);
    });

  res.status(201).send({ editorName }); // return success & the room ID
};

/* get response for compiled code */
// export const compileCode = async (req: Request, res: Response) => {
//   const { codeToRun = '', stdin = '', redisClient } = req.body;

//   const program = {
//     script: codeToRun,
//     stdin: stdin,
//     language: 'python3',
//     versionIndex: '4',
//     clientId: `${process.env.JDOODLE_CLIENT_ID}`,
//     clientSecret: `${process.env.JDOODLE_CLIENT_SECRET}`,
//   };

//   axios({
//     method: 'post',
//     url: 'https://api.jdoodle.com/v1/execute',
//     data: program,
//   })
//     .then((response: AxiosResponse) => {
//       console.log('statusCode:', response.status);
//       console.log('body:', response.data);
//       res.status(response.status).send(response.data);
//     })
//     .catch((error: Error) => {
//       console.log('error:', error);
//     });
// };

/* google cloud functions */
async function callCloudFunction(program: any) {
  const url = `https://asia-northeast3-codeuk-379309.cloudfunctions.net/compiler`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(program),
  };
  console.log(options);

  const response = await fetch(url, options);
  const result = await response.json();
  return result;
}

/* get response for compiled code */
export const compileCode = async (req: Request, res: Response) => {
  const { code = '', stdin = '' } = req.body;

  const program = {
    code: code,
    stdin: stdin,
  };

  callCloudFunction(program)
    .then((result) => {
      console.log('RESULT:', result);
      res.status(200).send(result);
    })
    .catch((error: Error) => {
      console.error('Error:', error);
    });
};

/* get response for fetching boj problem data */
export const getBojProbData = async (req: Request, res: Response) => {
  const uri = `mongodb+srv://juncheol:${mongoPassword}@cluster0.v0izvl3.mongodb.net/?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  async function connect() {
    try {
      await client.connect();
      console.log('Connected to MongoDB Atlas to Get Boj Problem Data');
    } catch (e) {
      console.error(e);
    }
  }

  await connect();

  const db = client.db('codewart');
  const collection = db.collection('probs');

  const data = await collection
    //@ts-ignore
    .find({ probId: parseInt(req?.query?.probId) })
    .toArray();

  if (data.length === 0) {
    res.status(404).send('Problem not found');
  } else {
    res.status(200).send(data);
  }
};

/* get response for fetching filtered paginated data */
export const getProbData = async (req: Request, res: Response) => {
  const probQuery = req?.body.data;
  const page = req?.body.page;
  // console.log(req?.body);

  let probFilter = {};

  //@ts-ignore
  probQuery.forEach((value, index) => {
    console.log(value.tag, index);
    if (['백준', '리트코드'].includes(value.tag)) {
      //@ts-ignore
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
      //@ts-ignore
      probFilter['solvedAC.level'] = condition;
    } else if (['한국정보올림피아드'].includes(value.tag)) {
      //@ts-ignore
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
