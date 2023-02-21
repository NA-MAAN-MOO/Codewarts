import { useState, useEffect } from 'react';
import {
  OpenVidu,
  Session,
  StreamManager,
  SessionEventMap,
} from 'openvidu-browser';
import useGetPlayer from 'hooks/useGetPlayer';
import axios from 'axios';
import { GAME_STATUS } from 'utils/Constants';
import { Connection } from 'types';

const APPLICATION_SERVER_URL = 'http://localhost:3002';

export default () => {
  const { getConnections } = useGetPlayer();
  const initSession = () => {
    // 1. openvidu 객체 생성
    const newOV = new OpenVidu();

    // socket 통신 과정에서 많은 log를 남기게 되는데 필요하지 않은 log를 띄우지 않게 하는 모드
    newOV.enableProdMode();

    // 2. initSession 생성
    const newSession = newOV.initSession();
    return { OV: newOV, session: newSession };
  };

  const createSession = async (sessionId: string) => {
    try {
      const data = await axios.post(
        APPLICATION_SERVER_URL + '/create-session',
        {
          customSessionId: sessionId,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return 1;
    } catch (err) {
      console.log('createSession error');
      console.log(err);
      return 0;
    }
  };

  const disconnectSession = (session: Session | undefined) => {
    if (!session) return;
    session.disconnect();
  };

  const getToken = async (sessionId: string) => {
    return await createToken(sessionId);
  };

  const createToken = async (sessionId: string) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL +
        '/create-connection/' +
        sessionId +
        '/connections',
      {},
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data; // The token
  };

  const registerSession = async (props: {
    session: Session | undefined;
    sessionId: string;
    addSubscriber: Function;
    deleteSubscriber: Function;
    handlePublisher: Function;
    OV: OpenVidu | undefined;
    userName: String;
  }) => {
    const {
      session,
      sessionId,
      addSubscriber,
      deleteSubscriber,
      OV,
      userName,
      handlePublisher,
    } = props;
    try {
      console.log('레지스터 진입');
      if (!session) return;
      const content: Connection[] = (await getConnections(sessionId)) || [];
      console.log('일', content);
      const isConnectExist = content.some((con: Connection) => {
        const { user } = JSON.parse(con.clientData);
        return user === userName;
      });
      console.log('이', isConnectExist);
      if (isConnectExist) return;

      const mySession = session;

      // --- 3) Specify the actions when events take place in the session ---

      // On every new Stream received...
      mySession.on('streamCreated', (event) => {
        // Subscribe to the Stream to receive it. Second parameter is undefined
        // so OpenVidu doesn't create an HTML video by its own

        const subscriber = mySession.subscribe(event.stream, undefined);

        // Update the state with the new subscribers
        addSubscriber(subscriber);
      });

      // On every Stream destroyed...
      mySession.on('streamDestroyed', (event) => {
        // Remove the stream from 'subscribers' array
        deleteSubscriber(event.stream.streamManager);
      });

      // On every asynchronous exception...
      mySession.on('exception', (exception) => {
        console.warn(exception);
      });

      // --- 4) Connect to the session with a valid user token ---

      // Get a token from the OpenVidu deployment
      const token = await getToken(sessionId);
      // First param is the token got from the OpenVidu deployment. Second param can be retrieved by every user on event
      // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
      await mySession.connect(token, { user: userName });
      if (!OV) return;
      // Init a passing undefined as targetElement (we don't want OpenVidu to insert a video
      // element: we will manage it on our own) and with the desired properties
      let pubNow = await OV.initPublisherAsync(undefined, {
        audioSource: undefined, // The source of audio. If undefined default microphone
        videoSource: false, // The source of video. If undefined default webcam
        publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
        publishVideo: false, // Whether you want to start publishing with your video enabled or not
        resolution: '640x480', // The resolution of your video
        frameRate: 30, // The frame rate of your video
        insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
        mirror: false, // Whether to mirror your local video or not
      });

      // --- 6) Publish your stream ---

      await mySession.publish(pubNow);
      handlePublisher(pubNow);
      const connections2 = await getConnections(sessionId);
      console.log('삼', connections2);
    } catch (error) {
      console.log(error);
    }
  };
  return {
    initSession,
    createSession,
    disconnectSession,
    getToken,
    createToken,
    registerSession,
  };
};
