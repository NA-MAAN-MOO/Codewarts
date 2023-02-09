import { v4 } from 'uuid';
import moment from 'moment';
import { Request, Response } from 'express';

export const createRoom = async (req: Request, res: Response) => {
  console.log('dddddddddddddddddddddddddddddddd');
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

export const origin = (req: Request, res: Response) => {
  console.log('dd');
  res.send({ msg: "I'm alive" });
};
