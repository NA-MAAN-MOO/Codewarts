import { Request, Response } from 'express';
import { OpenVidu, Session } from 'openvidu-node-client';
import { SessionList, RoomType } from '../types/Voice';

// Environment variable: PORT where the node server is listening
const SERVER_PORT = process.env.SERVER_PORT || 5000;
// Environment variable: URL where our OpenVidu server is listening
const OPENVIDU_URL = process.env.OPENVIDU_URL || 'http://localhost:4443';
// Environment variable: secret shared with our OpenVidu server
const OPENVIDU_SECRET = process.env.OPENVIDU_SECRET || 'MY_SECRET';

let sessionList: SessionList;
const openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);

export const checkSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.query;
    const sessions = openvidu.activeSessions;
    const result = sessions.some((session) => session.sessionId === sessionId);
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};

export const getSession = async (req: Request, res: Response) => {
  try {
    const qdata = req.query;
    const roomKey = qdata.roomKey as string;
    if (!roomKey) {
      res.status(400).send({ message: 'roomKey 누락' });
    }
    if (!sessionList || !sessionList[roomKey]) {
      res.send(null);
    }
    res.send(sessionList[roomKey].sessionId);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};

export const createSession = async (req: Request, res: Response) => {
  try {
    const { roomType = 'GAME', ...sessionInfo }: { roomType?: RoomType } =
      req.body;
    //이미 세션이 있으면 실행하지 않음
    if (!!sessionList?.[roomType]) return;
    //새 세션 생성
    const newSession = await openvidu.createSession(sessionInfo);
    console.log(`sessionList created : ${newSession.sessionId}`);
    sessionList[newSession.sessionId] = newSession;
    res.send(newSession.sessionId);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};

export const createConnection = async (req: Request, res: Response) => {
  try {
    const session = openvidu.activeSessions.find(
      (s) => s.sessionId === req.params.sessionId
    );
    if (!session) {
      res.status(404).send();
    } else {
      const connection = await session.createConnection(req.body);
      console.log(`connection created`);
      res.send(connection.token);
    }
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};
