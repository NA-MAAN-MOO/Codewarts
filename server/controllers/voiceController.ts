import { Request, Response } from 'express';
import { OpenVidu, Session } from 'openvidu-node-client';
import { IsRoomExist } from '../types/Voice';

// Environment variable: URL where our OpenVidu server is listening
const OPENVIDU_URL = process.env.OPENVIDU_URL || 'http://localhost:4443';
// Environment variable: secret shared with our OpenVidu server
const OPENVIDU_SECRET = process.env.OPENVIDU_SECRET || 'MY_SECRET';

let isRoomExist: IsRoomExist = {};
const openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);

export const createSession = async (req: Request, res: Response) => {
  try {
    const sessionInfo = req.body;
    //새 세션 생성
    const newSession = await openvidu.createSession(sessionInfo);
    console.log(`sessionList created : ${newSession.sessionId}`);
    isRoomExist[newSession.sessionId] = true;
    res.send(newSession.sessionId);
  } catch (err) {
    console.log('세션 생성 실패');
    console.log(err);
    res.status(500).send(err);
  }
};

export const createConnection = async (req: Request, res: Response) => {
  try {
    const session = openvidu.activeSessions.find(
      (s) => s.sessionId === req.params.sessionId
    );
    if (!session) {
      console.log('세션 존재하지 않음');
      res.status(404).end();
    } else {
      const connection = await session.createConnection(req.body);
      console.log('connection created', connection);
      res.send(connection.token);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
