import { useState, useEffect } from 'react';
import {
  OpenVidu,
  Session,
  StreamManager,
  SessionEventMap,
} from 'openvidu-browser';
import { Event, SessionEvent } from 'types';
import axios from 'axios';
import Audio from 'components/Audio';
import { ROOM_TYPE } from 'utils/Constants';
import { VoiceInfo } from 'types';

const APPLICATION_SERVER_URL = 'http://localhost:5000/api';

export const getSessionFromClient = (roomKey: string): string => {
  const voiceRoomList = localStorage.getItem('VoiceRoomList');
  if (!voiceRoomList) return '';

  const sessionId = JSON.parse(voiceRoomList)[roomKey];
  return sessionId;
};

//Room Key를 통해 세션 가져오기.
//세션이 생성될 때 클라이언트 로컬스토리지에 저장되므로, 로컬스토리지를 먼저 검사하고 없을 때 서버를 통해 받아오기
export const getSessionInfo = async (roomKey: string) => {
  const savedId = getSessionFromClient(roomKey);
  const savedInfo = localStorage.getItem('VoiceSessionInfo');
  if (!savedInfo) return;

  const roomInfo = JSON.parse(savedInfo)[roomKey];
  if (!roomInfo) return;

  if (savedId) {
    // 클라이언트에 저장된 세션 정보가 있으면
    // 서버에 아직 이 세션 살아있나 확인
    const { data } = await axios.get(
      `${APPLICATION_SERVER_URL}/check-session`,
      {
        params: {
          sessionId: savedId,
        },
      }
    );
    if (data) {
      return roomInfo;
    } else {
      return await getSessionFromServer(roomKey);
    }
  }
};

export const getSessionFromServer = async (roomKey: string) => {
  try {
    const { data: sessionId } = await axios.get(
      `${APPLICATION_SERVER_URL}/get-session`,
      {
        params: {
          roomKey,
        },
      }
    );

    if (!sessionId) return null;
    const sessionInfo = localStorage.getItem(sessionId);
    if (!sessionInfo) return null;
    return JSON.parse(sessionInfo);
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const createSession = async (roomKey: string) => {
  try {
    const session = await getSessionInfo(roomKey);
    //현재 세션 있으면 리턴
    if (!!session) return session;

    // 1. openvidu 객체 생성
    const newOV = new OpenVidu();

    // socket 통신 과정에서 많은 log를 남기게 되는데 필요하지 않은 log를 띄우지 않게 하는 모드
    newOV.enableProdMode();

    // 2. initSession 생성
    const newSession = newOV.initSession();

    const { data: sessionId } = await axios.post(
      APPLICATION_SERVER_URL + '/create-session',
      {
        roomKey,
        customSessionId: newSession.sessionId,
        session: newSession,
        OV: newOV,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    localStorage.setItem(
      sessionId,
      JSON.stringify({
        OV: newOV,
        session: newSession,
        sessionId: sessionId,
      })
    );
    return { OV: newOV, session: newSession, sessionId: sessionId }; // The sessionId
  } catch (err) {
    console.log(err);
  }
};

export const disconnectSession = (session: Session | undefined) => {
  if (!session) return;
  session.disconnect();
};

export const getToken = async (sessionId: string) => {
  return await createToken(sessionId);
};

export const createToken = async (sessionId: string) => {
  const response = await axios.post(
    APPLICATION_SERVER_URL +
      'api/create-connection/' +
      sessionId +
      '/connections',
    {},
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
  return response.data; // The token
};

export const registerSession = async (
  session: Session | undefined,
  addSubscriber: Function,
  deleteSubscriber: Function,
  OV: OpenVidu | undefined,
  myUserName: String
) => {
  try {
    if (!session) return;
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
    const token = await getToken(session.sessionId);
    // First param is the token got from the OpenVidu deployment. Second param can be retrieved by every user on event
    // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
    await mySession.connect(token, { clientData: myUserName });
    if (!OV) return;
    // Init a passing undefined as targetElement (we don't want OpenVidu to insert a video
    // element: we will manage it on our own) and with the desired properties
    let pubNow = await OV.initPublisherAsync(undefined, {
      audioSource: undefined, // The source of audio. If undefined default microphone
      videoSource: undefined, // The source of video. If undefined default webcam
      publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
      publishVideo: false, // Whether you want to start publishing with your video enabled or not
      resolution: '640x480', // The resolution of your video
      frameRate: 30, // The frame rate of your video
      insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
      mirror: false, // Whether to mirror your local video or not
    });

    // --- 6) Publish your stream ---

    mySession.publish(pubNow);
  } catch (error) {
    console.log(error);
  }
};
