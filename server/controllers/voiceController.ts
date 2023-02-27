import axios, { AxiosError } from 'axios';
import { Request, Response } from 'express';
import { OpenVidu, Session } from 'openvidu-node-client';
import { MUTE_TYPE } from '../constants';
import MicMuteInfo from '../services/MicMuteInfo';
import VolMuteInfo from '../services/VolMuteInfo';
import { IsRoomExist as ConnectionList } from '../types/Voice';

// Environment variable: URL where our OpenVidu server is listening
const OPENVIDU_URL = process.env.OPENVIDU_URL || 'http://localhost:4443';
// Environment variable: secret shared with our OpenVidu server
const OPENVIDU_SECRET = process.env.OPENVIDU_SECRET || 'MY_SECRET';

const openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
const authCode = Buffer.from(`OPENVIDUAPP:${OPENVIDU_SECRET}`).toString(
  'base64'
);

//만들어진 커넥션 리스트
//{ '세션이름:유저이름' : 만들어진 Connection 객체 } 꼴
// let connectionList: ConnectionList = {};

export const createSession = async (req: Request, res: Response) => {
  try {
    const sessionInfo = req.body;
    //새 세션 생성
    const newSession = await openvidu.createSession(sessionInfo);
    console.log(`sessionList created : ${newSession.sessionId}`);
    res.send(newSession.sessionId);
  } catch (err) {
    console.log('세션 생성 실패');
    console.log(err);
    res.status(500).send(err);
  }
};

export const createConnection = async (req: Request, res: Response) => {
  try {
    const { userName } = req.body;
    const { sessionId } = req.params;
    const session = openvidu.activeSessions.find(
      (s) => s.sessionId === sessionId
    );
    if (!session) {
      console.log('세션 존재하지 않음');
      return res.status(404).end();
    }

    //이미 해당 유저의 커넥션 있는지 확인
    const conKey = `${sessionId}:${userName}`;
    // if (!!connectionList[conKey]) {
    //   //이미 커넥션 있으면
    //   return res.send(null);
    // }

    const connection = await session.createConnection(req.body);
    // connectionList[conKey] = connection;

    console.log('connection created');
    res.send(connection.token);
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
    if (err instanceof AxiosError && err.response?.status === 404) {
      // 아직 세션 만들어지지 않은 상태임
      res.send(false);
      return;
    }
    console.log(err);
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

//특정 세션 제거
export const deleteSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { data } = await axios.delete(
      `${OPENVIDU_URL}/openvidu/api/sessions/${sessionId}`,
      {
        headers: {
          Authorization: `Basic ${authCode}`,
        },
      }
    );

    //connectionList에서도 제거해줌
    // Object.keys(connectionList)
    //   .filter((key) => !key.includes(sessionId))
    //   .reduce((cur, key) => {
    //     return Object.assign(cur, { [key]: connectionList[key] });
    //   }, {});

    res.status(200).end();
  } catch (err: unknown) {
    console.log('세션 존재하지 않음');
    res.status(500).send(err);
  }
};

//특정 커넥션 제거(voiceController에 있는 connectionList에서 지운다는 개념)
// export const deleteConnection = async (req: Request, res: Response) => {
//   try {
//     const { sessionId } = req.params;
//     const { userName } = req.body;

//     const conKey = `${sessionId}:${userName}`;

//     //connectionList에 conKey 없으면 리턴
//     // if (!connectionList[conKey]) return res.status(200).end();

//     //connectionList에서 해당 커넥션 제거해 주기
//     // delete connectionList[conKey];
//     res.status(200).end();
//   } catch (err: unknown) {
//     console.log(err);
//     res.status(500).send(err);
//   }
// };

//서버의 ConnectionList 리셋
// export const resetConnection = async (req: Request, res: Response) => {
//   try {
//     // connectionList = {};
//     res.status(200).end();
//   } catch (err: unknown) {
//     console.log(err);
//     res.status(500).send(err);
//   }
// };

// 뮤트/언뮤트 처리
export const toggleMute = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const { userName } = req.body;

    if (type === MUTE_TYPE.VOL) {
      //볼륨 뮤트/언뮤트
      VolMuteInfo.switch(userName);
    } else {
      // 마이크 뮤트/언뮤트
      MicMuteInfo.switch(userName);
    }
    res.status(200).end();
  } catch (err: unknown) {
    console.log(err);
    res.status(500).send(err);
  }
};

// 뮤트/언뮤트 가져오기
export const getMuteInfo = async (req: Request, res: Response) => {
  try {
    const result = {
      [MUTE_TYPE.VOL]: VolMuteInfo.getAll(),
      [MUTE_TYPE.MIC]: MicMuteInfo.getAll(),
    };
    res.send(result).end();
  } catch (err: unknown) {
    console.log(err);
    res.status(500).send(err);
  }
};
