import axios, { AxiosError } from 'axios';
import { Request, Response } from 'express';
import { OpenVidu, Session } from 'openvidu-node-client';
import { IsRoomExist } from '../types/Voice';

// Environment variable: URL where our OpenVidu server is listening
const OPENVIDU_URL = process.env.OPENVIDU_URL || 'http://localhost:4443';
// Environment variable: secret shared with our OpenVidu server
const OPENVIDU_SECRET = process.env.OPENVIDU_SECRET || 'MY_SECRET';

let isRoomExist: IsRoomExist = {};
const openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
const authCode = Buffer.from(`OPENVIDUAPP:${OPENVIDU_SECRET}`).toString(
  'base64'
);

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
      console.log('connection created');
      res.send(connection.token);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

//특정 세션에 있는 전체 커넥션 가져오기
export const getConnections = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.query;

    const { data } = await axios.get(
      `${OPENVIDU_URL}/openvidu/api/sessions/${sessionId}/connection`,
      {
        headers: {
          Authorization: `Basic ${authCode}`,
        },
      }
    );
    res.send(data.content);
  } catch (err: unknown) {
    console.log(err);
    if (err instanceof AxiosError && err.response?.status === 404) {
      // 아직 세션 만들어지지 않은 상태임
      res.send([]);
      return;
    }
    res.status(500).send(err);
  }
};

//전체 세션 가져오기
export const getSessions = async (req: Request, res: Response) => {
  try {
    const { data } = await axios.get(`${OPENVIDU_URL}/openvidu/api/sessions`, {
      headers: {
        Authorization: `Basic ${authCode}`,
      },
    });
    res.send(data.content);
  } catch (err: unknown) {
    console.log(err);
    res.status(500).send(err);
  }
};

export const getSessionFromId = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.query;
    const { data } = await axios.get(
      `${OPENVIDU_URL}/openvidu/api/sessions/${sessionId}`,
      {
        headers: {
          Authorization: `Basic ${authCode}`,
        },
      }
    );
    res.send(data);
  } catch (err: unknown) {
    console.log(err);
    res.status(500).send(err);
  }
};
