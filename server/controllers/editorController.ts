import { v4 } from 'uuid';
import moment from 'moment';
import { Request, Response } from 'express';
import axios from 'axios';

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
    .then((response: Response) => {
      console.log('statusCode:', response.status);
      console.log('body:', response.data);
      res.status(response.status).send(response.data);
    })
    .catch((error: Error) => {
      console.log('error:', error);
    });
};

export const origin = (req: Request, res: Response) => {
  res.send({ msg: "I'm alive" });
};
