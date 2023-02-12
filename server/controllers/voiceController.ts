import { Request, Response } from 'express';
import { OpenVidu } from 'openvidu-node-client';

// Environment variable: PORT where the node server is listening
const SERVER_PORT = process.env.SERVER_PORT || 5000;
// Environment variable: URL where our OpenVidu server is listening
const OPENVIDU_URL = process.env.OPENVIDU_URL || 'http://localhost:4443';
// Environment variable: secret shared with our OpenVidu server
const OPENVIDU_SECRET = process.env.OPENVIDU_SECRET || 'MY_SECRET';

const openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);

export const createSession = async (req: Request, res: Response) => {
  try {
    const session = await openvidu.createSession(req.body);
    res.send(session.sessionId);
  } catch (err) {
    console.log(err);
    res.send(500);
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
      res.send(connection.token);
    }
  } catch (err) {
    console.log(err);
    res.send(500);
  }
};
