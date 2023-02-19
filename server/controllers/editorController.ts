import dotenv from 'dotenv';
//환경변수 이용(코드 최상단에 위치시킬 것)
dotenv.config();

import { v4 } from 'uuid';
import moment from 'moment';
import { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';

const { MongoClient } = require('mongodb');
const mongoPassword = process.env.MONGO_PW;

export const createRoom = async (req: Request, res: Response) => {
  const { userName = '', redisClient } = req.body;
  const hashField = 'code-mirror';
  const roomId = v4(); // roomID 최초 생성

  await redisClient
    /* room 정보 해쉬로 저장 */
    .hSet(
      `${roomId}:info`,
      hashField,
      JSON.stringify({
        created: moment(),
        updated: moment(),
      })
    )
    .catch((err: Error) => {
      console.error(1, err);
    });

  res.status(201).send({ roomId }); // return success & the room ID
};

/* get response for compiled code */
export const compileCode = async (req: Request, res: Response) => {
  const { codeToRun = '', stdin = '', redisClient } = req.body;

  const program = {
    script: codeToRun,
    stdin: stdin,
    language: 'python3',
    versionIndex: '4',
    clientId: `${process.env.JDOODLE_CLIENT_ID}`,
    clientSecret: `${process.env.JDOODLE_CLIENT_SECRET}`,
  };

  axios({
    method: 'post',
    url: 'https://api.jdoodle.com/v1/execute',
    data: program,
  })
    .then((response: AxiosResponse) => {
      console.log('statusCode:', response.status);
      console.log('body:', response.data);
      res.status(response.status).send(response.data);
    })
    .catch((error: Error) => {
      console.log('error:', error);
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

  // console.log(data);

  if (data.length === 0) {
    res.status(404).send('Problem not found');
  } else {
    res.status(200).send(data);
  }
};

export const origin = (req: Request, res: Response) => {
  res.send({ msg: "I'm alive" });
};
